import React from 'react';
// import Header from './Header';
import HeaderBar from './HeaderBar'

export default ({ children }) => {
  return (
    <div>
      {/* <Header/> */}
      <HeaderBar/>
      {children}
    </div>
  );
};
