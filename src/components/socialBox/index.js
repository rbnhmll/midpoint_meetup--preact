import { h, Component } from 'preact';
import twttr from 'twitter-widgets';
import style from './style.sass';

class SocialBox extends Component {
	componentDidMount() {
		!(function(d, s, id) {
			let js,
				fjs = d.getElementsByTagName(s)[0],
				p = /^http:/.test(d.location) ? 'http' : 'https';
			if (!d.getElementById(id)) {
				js = d.createElement(s);
				js.id = id;
				js.src = p + '://platform.twitter.com/widgets.js';
				fjs.parentNode.insertBefore(js, fjs);
			}
		})(document, 'script', 'twitter-wjs');
		twttr.widgets.load();
	}
	render() {
		return (
			<div class={style['social-box']}>
				<a
					href="https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Flocalhost%3A8000%2F&amp;ref_src=twsrc%5Etfw&amp;text=Find%20a%20mutual%20meet-up%20spot%20for%20you%20%26%20a%20friend%20using%20Midpoint%20Meetup!%20%2F%2F&amp;tw_p=tweetbutton&amp;url=http%3A%2F%2Fmidpointmeetup.com&amp;via=rbnhmll"
					class="twitter-btn"
					id="b"
				>
					<i class="fa fa-twitter" />
					<span class="label" id="l">
						Tweet
					</span>
				</a>
			</div>
		);
	}
}

export default SocialBox;
