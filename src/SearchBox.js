import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchBox extends Component {
    static propTypes = {
        mapsapi: PropTypes.shape({
            places: PropTypes.shape({
                SearchBox: PropTypes.func,
            }),
            event: PropTypes.shape({
                clearInstanceListeners: PropTypes.func,
            }),
        }).isRequired,
        placeholder: PropTypes.string,
        onPlacesChanged: PropTypes.func,
    };

    static defaultProps = {
        placeholder: 'Search...',
        onPlacesChanged: null,
    };

    constructor(props) {
        super(props);

        this.searchInput = React.createRef();
    }

    componentDidMount() {
        const { map, mapsapi } = this.props;

        let markers = [];
        let infowindow = new mapsapi.InfoWindow();
        let service = new mapsapi.places.PlacesService(map);

        this.searchBox = new mapsapi.places.SearchBox(this.searchInput.current);
        this.searchBox.addListener('places_changed', function() {
            let places = this.getPlaces();
  
            if (places.length == 0) {
                return;
            }
  
            // Clear out the old markers.
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
  
            // For each place, get the icon, name and location.
            let bounds = new mapsapi.LatLngBounds();
            places.forEach(function(place) {
                let icon = {
                    url: place.icon,
                    size: new mapsapi.Size(71, 71),
                    origin: new mapsapi.Point(0, 0),
                    anchor: new mapsapi.Point(17, 34),
                    scaledSize: new mapsapi.Size(25, 25)
                };
  
                // Create a marker for each place.

                let marker = new mapsapi.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                });
                markers.push(marker);
  
                // Show infowindow
                mapsapi.event.addListener(marker, 'click', function(evt) {
                    service.getDetails({
                        placeId: place.place_id
                    }, (function(marker) {
                        return function(place, status) {
                            if (status === mapsapi.places.PlacesServiceStatus.OK) {
                                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 'Place ID: ' + place.place_id + '<br>' + place.formatted_address + '</div>');
                                infowindow.open(map, marker);
                            }
                        }
                    }(marker)));
                });

                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                }
                else {
                    bounds.extend(place.geometry.location);
                }

                map.fitBounds(bounds);
            });
        });
    }

    componentWillUnmount() {
        const { mapsapi: { event }, } = this.props;
        event.clearInstanceListeners(this.searchBox);
    }

    onPlacesChanged = () => {
        const { onPlacesChanged } = this.props;

        if (onPlacesChanged) {
            onPlacesChanged(this.searchBox.getPlaces());
        }
    }

    render() {
        const { placeholder } = this.props;

        return (
            <input
                ref={this.searchInput}
                placeholder={placeholder}
                type="search"
                style={{
                    width: '350px',
                    height: '20px',
                }}
            />
        );
    }
}

export default SearchBox;
