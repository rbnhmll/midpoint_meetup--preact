import { h } from 'preact';
import style from './style.sass';

import Venue from '../venue';

const Results = props => {
	const results = props.results;
	return <div class={style.resultsContainer}>{results.map(result => <Venue result={result} />)}</div>;
};

export default Results;
