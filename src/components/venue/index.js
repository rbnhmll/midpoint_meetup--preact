import { h } from 'preact';
import style from './style.sass';

const Venue = (props) => {
	return (
		<div class={style.venueContainer} key={props.result.venue.id}>
			<a href={`https://foursquare.com/v/${props.result.venue.id}`} target="_blank">
				<img
					class={style.venue__image}
					src={`${props.result.venue.featuredPhotos.items[0].prefix}300x300${props.result.venue.photos.groups[0]
						.items[0].suffix}`}
					alt={props.result.venue.name}
				/>
			</a>
			<h3 class={style.venue__name}>{props.result.venue.name}</h3>
			<p class={style.venue__addr}>{props.result.venue.location.formattedAddress[0]}</p>
			<p class={style.venue__city}>{props.result.venue.location.formattedAddress[1]}</p>
			<p class={style.venue__dist}>
				<span>{props.result.venue.location.distance} m</span> from midpoint.
			</p>
			<a class={style.venue__link} href={`https://foursquare.com/v/${props.result.venue.id}`} target="_blank">
				<i class="fa fa-foursquare" /> Visit On Foursquare
			</a>
		</div>
	);
};

export default Venue;
