// apiKey = "AIzaSyCT09OGdLmjs1sbYjJJH1K6TORh_ugdzD4";

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { withRouter } from 'react-router-dom'


export class MultipleMapContainer extends Component {

    onMarkerClicked(id) {
        this.props.history.push(`/property/${id}`);
    }

    render() {
        const {coordinates, title} = this.props;
        return (
            <Map google={this.props.google}
                 style={{width: '100%', height: '100%', position: 'relative'}}
                 containerStyle={{width: '100%', height: '70%', position: 'relative'}}
                 initialCenter={{
                     lat: coordinates[0].latitude,
                     lng: coordinates[0].longitude,
                 }}
                 center={{
                     lat: coordinates[0].latitude,
                     lng: coordinates[0].longitude,
                 }}
                 zoom={8}>
                {
                    coordinates.map((point, i) =>(
                        <Marker
                            key={i}
                            name={title}
                            mapCenter={{lat: point.latitude, lng: point.longitude}}
                            position={{lat: point.latitude, lng: point.longitude}}
                            onClick={() => this.onMarkerClicked(point.id)}
                        />

                        )
                    )
                }
                
            </Map>
        );
    }
}

MultipleMapContainer.propTypes = {
    coordinates: PropTypes.any,
    title: PropTypes.string.isRequired,
};

export default withRouter(GoogleApiWrapper({
    apiKey: "AIzaSyCT09OGdLmjs1sbYjJJH1K6TORh_ugdzD4"
})(MultipleMapContainer))
