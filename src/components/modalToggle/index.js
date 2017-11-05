import React from 'react';
import style from './style.sass';

const ModalToggle = (props) => {
  return (
    <div
      onClick={props.toggleModal} className="show-button"
    >
      <span className="fa fa-info" />
    </div>
  );
};

export default ModalToggle;
