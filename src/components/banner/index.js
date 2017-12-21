import { h } from 'preact';
import style from './style.sass';

const Banner = () => (
	<header class={style.banner}>
		<h1 class="animated bounceInDown">Midpoint <span>Meetup</span></h1>
		<h2>
			Let<span class="animated bounce">'</span>s Meet Halfway!
		</h2>
	</header>
);

export default Banner;
