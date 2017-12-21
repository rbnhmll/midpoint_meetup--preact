import { h, Component } from 'preact';
import style from './style.sass';

class Modal extends Component {
	componentDidMount() {
		// Hide modal on Esc
		document.addEventListener('keydown', e => {
			if (e.keyCode === 27) {
				this.props.closeModal();
			}
		});
	}

	render() {
		return (
			<div class={`${style.modal_container} ${this.props.show_modal ? `${style.show}` : ''}`}>
				<div onClick={this.props.closeModal} class={style.overlay} />
				<div class={style.modal}>
					<button onClick={this.props.closeModal} class={style['close-button']}>
						<i class="fa fa-times" />
					</button>
					<p>
						Find a mutual meet-up spot for you and your friend, halfway between your two locations using Midpoint
						Meetup!
					</p>
					<p>
						Simply enter the addresses of you and your friend, choose if you want to meet up for coffee or beers, and
						hit the Meet Up button.
					</p>
					<p>Through the wonders of the internet, a midpoint will be calculated, and local results will appear.</p>
					<h5>
						Created by <a href="http://robinhamill.com">Robin Hamill</a> using the Mapbox &amp; Foursquare APIs
					</h5>
				</div>
			</div>
		);
	}
}

export default Modal;
