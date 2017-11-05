import { h } from 'preact';
import style from './style.sass';

const Banner = () => (
	<header class={style.banner}>
		<h1 class="animated bounceInDown">
			Let's Meet <span>Half</span>way!
		</h1>
	</header>
);

export default Banner;
