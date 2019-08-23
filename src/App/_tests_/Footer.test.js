import React from 'react';
import { shallow } from '../../enzyme';
import Footer from '../Components/Common/Footer';

describe('Footer', () => {
  const footer = shallow(<Footer />);
  it('renders the Footer component', () => {
    expect(footer.find('div').text()).toEqual('© Authors Haven2019');
  });
});
