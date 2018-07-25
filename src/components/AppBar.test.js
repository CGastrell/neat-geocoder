import React from 'react';
import ReactDOM from 'react-dom';
import AppBar from './AppBar';

const defaultProps = {
  classes: {},
  setKey: () => {}
}
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppBar {...defaultProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
