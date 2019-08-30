// import queryString from 'query-string';
import async from 'async';
import axios from '../../configs/axios';
import types from '.';

const {
  SHOW_NOTIFICATIONS,
  HIDE_NOTIFICATIONS,
  GET_NOTIFICATIONS,
  NOTIFICATIONS_CATCH_ERROR,
  SNOOZE_NOTIFICATION,
  GET_NOTIFICATIONS_CONFIGS,
  GET_USER_PROFILE_ON_LOGIN,
  MARK_NOTIFICATION_AS_READ,
  MARK_ALL_NOTIFICATIONS_AS_READ
} = types;

const actions = {
  show: () => (dispatch) => {
    document.getElementById('notifications').style.display = 'block';
    document.getElementById('notifications-triangle').style.display = 'block';
    return dispatch({ type: SHOW_NOTIFICATIONS, payload: true });
  },
  hide: () => (dispatch) => {
    document.getElementById('notifications').style.display = 'none';
    document.getElementById('notifications-triangle').style.display = 'none';
    return dispatch({ type: HIDE_NOTIFICATIONS, payload: false });
  },
  get: token => (dispatch) => {
    axios
      .get('/api/notifications/unseen', { headers: { authorization: token } })
      .then((res) => {
        dispatch({ type: GET_NOTIFICATIONS, payload: res.data });
      })
      .catch((error) => {
        const errorObject = error.response.data.errors;
        const errorMessage = errorObject[Object.getOwnPropertyNames(errorObject)[0]];
        dispatch({ type: NOTIFICATIONS_CATCH_ERROR, payload: errorMessage });
      });
  },

  snooze: (operation, token) => (dispatch) => {
    axios
      .patch(`/api/notifications/configuration/${operation}`,
        { data: {} },
        { headers: { authorization: token } })
      .then((res) => {
        dispatch({ type: SNOOZE_NOTIFICATION, payload: res.data });
      })
      .catch((error) => {
        const errorObject = error.response.data.errors;
        const errorMessage = errorObject[Object.getOwnPropertyNames(errorObject)[0]];
        dispatch({ type: NOTIFICATIONS_CATCH_ERROR, payload: errorMessage });
      });
  },

  getConfigs: token => (dispatch) => {
    axios
      .get('/api/notifications/configuration', { headers: { authorization: token } })
      .then((res) => {
        dispatch({ type: GET_NOTIFICATIONS_CONFIGS, payload: res.data });
      })
      .catch((error) => {
        const errorObject = error.response.data.errors;
        const errorMessage = errorObject[Object.getOwnPropertyNames(errorObject)[0]];
        dispatch({ type: NOTIFICATIONS_CATCH_ERROR, payload: errorMessage });
      });
  },

  getProfile: token => (dispatch) => {
    axios
      .get('/api/profiles', { headers: { authorization: token } })
      .then((res) => {
        dispatch({ type: GET_USER_PROFILE_ON_LOGIN, payload: res.data });
      })
      .catch((error) => {
        const errorObject = error.response.data.errors;
        const errorMessage = errorObject[Object.getOwnPropertyNames(errorObject)[0]];
        dispatch({ type: NOTIFICATIONS_CATCH_ERROR, payload: errorMessage });
      });
  },

  markAsRead: (token, id) => dispatch => new Promise((resolve, reject) => {
    axios
      .patch(`/api/notifications/${id}/seen`, { data: {} }, { headers: { authorization: token } })
      .then((res) => {
        dispatch({ type: MARK_NOTIFICATION_AS_READ, payload: res.data });
        resolve(res.data);
      })
      .catch((error) => {
        const errorObject = error.response.data.errors;
        const errorMessage = errorObject[Object.getOwnPropertyNames(errorObject)[0]];
        dispatch({ type: NOTIFICATIONS_CATCH_ERROR, payload: errorMessage });
        reject(error);
      });
  }),

  markAllAsRead: (token, data) => dispatch => new Promise((resolve, reject) => {
    let messages = [];
    async.each(data,
      (notification, callback) => {
        axios
          .patch(`/api/notifications/${notification.id}/seen`,
            { data: {} },
            { headers: { authorization: token } })
          .then((res) => {
            messages = [...messages, res.data];
            callback();
          });
      },
      (error) => {
        if (!error) {
          dispatch({ type: MARK_ALL_NOTIFICATIONS_AS_READ, payload: messages });
          resolve(messages);
        } else reject(error);
      });
  })
};

export default actions;