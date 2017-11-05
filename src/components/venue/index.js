import { h, Component } from 'preact';

class Venue extends Component {
  render() {
    return (
      <div class="venueContainer" key={result.venue.id}>
        <img
          class="venue__image"
          src={`${result.venue.featuredPhotos.items[0].prefix}300x300${result.venue.photos.groups[0].items[0].suffix}`}
          alt={result.venue.name}
        />
        <h2 class="venue__name">{result.venue.name}</h2>
        <p class="venue__addr">{result.venue.location.formattedAddress[0]}</p>
        <p class="venue__city">{result.venue.location.formattedAddress[1]}</p>
        <p class="venue__dist">
          <span>{result.venue.location.distance} m</span> from midpoint.
        </p>
        <a class="venue__link" href={`https://foursquare.com/v/${result.venue.id}`} target="_blank"><i class="fa fa-foursquare" /> Visit On Foursquare</a>
      </div>
    );
  }
};

export default Venue;
