import { h } from 'preact';

const Results = (props) => {
  const results = props.results;
  return (
    <div className="resultsContainer">
      {results.map((result) => {
        return (
          <div className="venueContainer" key={result.venue.id}>
            <img
              className="venue__image"
              src={`${result.venue.featuredPhotos.items[0].prefix}300x300${result.venue.photos.groups[0].items[0].suffix}`}
              alt={result.venue.name}
            />
            <h2 className="venue__name">{result.venue.name}</h2>
            <p className="venue__addr">{result.venue.location.formattedAddress[0]}</p>
            <p className="venue__city">{result.venue.location.formattedAddress[1]}</p>
            <p className="venue__dist">
              <span>{result.venue.location.distance} m</span> from midpoint.
            </p>
            <a className="venue__link" href={`https://foursquare.com/v/${result.venue.id}`} target="_blank"><i className="fa fa-foursquare" /> Visit On Foursquare</a>
          </div>
        );
      })}
    </div>
  );
};

export default Results;
