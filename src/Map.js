import React, { Component } from 'react';
import GoogleMap from 'google-map-react';
import SearchBox from './SearchBox';

class Map extends Component {
    constructor (props) {
        super(props);

        this.searchBar = React.createRef();
        this.state = {
            mapsApiLoaded: false,
            mapInstance: null,
            mapsapi: null,
            center: {
                lat: 43.499329,
                lng: -80.522703,
            },
            zoom: 17
        }
    }

    apiLoaded = (map, maps) => {
        map.controls[maps.ControlPosition.TOP_LEFT].push(this.searchBar.current);
        if (map && maps) {
            this.setState({
                mapsApiLoaded: true,
                mapInstance: map,
                mapsapi: maps
            });
        }
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100%' }}>
                <GoogleMap
                    bootstrapURLKeys={{ libraries: ['places', 'drawing'] }}
                    defaultCenter={this.state.center}
                    defaultZoom={this.state.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => this.apiLoaded(map, maps)}
                >
                </GoogleMap>
                    <div ref={this.searchBar} >
                        {this.state.mapsApiLoaded &&
                            <SearchBox
                                map={this.state.mapInstance}
                                mapsapi={this.state.mapsapi}
                            />
                        }
                    </div>
            </div>
      )
  } 
}

export default Map;
