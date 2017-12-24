import { h, Component } from 'preact';
import style from './style.sass';

import smoothScroll from 'smoothscroll';

import Venue from '../venue';

class Results extends Component {
	componentDidMount() {
		const map = document.getElementById('map');
		smoothScroll(map, 500);
	}
	render() {
		const results = this.props.results;
		return <div class={style.resultsContainer}>{results.map(result => <Venue result={result} />)}</div>;
	}
}

export default Results;
