import { h } from 'preact';

import Venue from '../venue';

const Results = props => {
	const results = props.results;
	return <div className="resultsContainer">{results.map(result => <Venue result={result} />)}</div>;
};

export default Results;
