import React from 'react';
import style from './style.sass';

const ModalToggle = props => (
	<div onClick={props.toggleModal} class={style['show-button']}>
		<span className="fa fa-info" />
	</div>
);

export default ModalToggle;
