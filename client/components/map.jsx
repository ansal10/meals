// apiKey = "AIzaSyCT09OGdLmjs1sbYjJJH1K6TORh_ugdzD4";

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

export class MapContainer extends Component {
    render() {
        const {lat, lng, title} = this.props;
        return (
            <Map google={this.props.google}
                 style={{width: '100%', height: '100%', position: 'relative'}}
                 containerStyle={{width: '100%', height: '30%', position: 'relative'}}
                 initialCenter={{
                     lat: lat,
                     lng: lng
                 }}
                 center={{
                     lat: lat,
                     lng: lng
                 }}
                 zoom={14}>

                <Marker
                    title={title}
                    name={title}
                    mapCenter={{lat, lng}}
                    position={{lat, lng}} />
            </Map>
        );
    }
}

MapContainer.propTypes = {
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
}

export default GoogleApiWrapper({
    apiKey: "AIzaSyCT09OGdLmjs1sbYjJJH1K6TORh_ugdzD4"
})(MapContainer)
