import { h, Component } from 'preact';
import style from './style.sass';

import scrollToElement from 'scroll-to-element';

import Venue from '../venue';

class Results extends Component {
	componentDidMount() {
		scrollToElement('#map', {
			offset: -20,
			align: 'top',
			ease: 'linear',
			duration: 500
		});
	}
	render() {
		const results = this.props.results;
		return <div class={style.resultsContainer}>{results.map(result => <Venue result={result} />)}</div>;
	}
}

export default Results;
