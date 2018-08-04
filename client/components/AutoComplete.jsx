import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AutoDetect from "./AutoDetect";

class AutoComplete extends Component {

    constructor(props){
        super(props);
    }


    _geoCodeCallback = (results, status, event) => {
    const google = window.google; // eslint-disable-line
    if (status === google.maps.GeocoderStatus.OK) {
        if (results[0]) {
            const add = results[0].formatted_address;
            const value = add.split(",");
            const count = value.length;
            const city = value[count - 3];
            // here we can dispatch action to search by city name and autofill the autocomplete
        } else {
            console.log("address not found");
        }
    } else {
        console.log(status);
        }
    }
    _geocodeAddress = (geocoder, latlng) => {
        geocoder.geocode({ location: latlng }, this._geoCodeCallback);
    }
    _detectUserLocation = (event) => {
        // check for Geolocation support
        const google = window.google; // eslint-disable-line
        if (navigator.geolocation) {
            this._displayLocation = (latitude, longitude) => {
                const geocoder = new google.maps.Geocoder();
                const latlng = new google.maps.LatLng(latitude, longitude);
                this._geocodeAddress(geocoder, latlng);
            };
            this.geoSuccess = (position) => {
                this._displayLocation(position.coords.latitude, position.coords.longitude);
            };
            this.geoError = (error) => {
                switch (error.code) {
                    case error.TIMEOUT:
                        console.log("Browser geolocation error !\n\nTimeout.");
                        break;
                    case error.PERMISSION_DENIED:
                        console.log("Only secure origins are allowed");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log("Browser geolocation error !\n\nPosition unavailable.");
                        break;
                    default:
                        console.log(error.code);
                        break;
                }
            };
            navigator.geolocation.getCurrentPosition(this.geoSuccess, this.geoError);
        } else {
            console.log("Geolocation is not supported for this Browser/OS.");
        }
    }
    _renderAutoDetect = () => {
        return (
            <AutoDetect onClick={ this._detectUserLocation } />
        );
    }
    render() {
        return (
            <div className="Autocomplete">
                <Input
                    autoFocus={ this.props.autoFocus }
                    focusDelay={ this.props.focusDelay }
                    name="autocomplete"
                    inputClassName="Autocomplete__search mb-0"
                    value={ this.props.value }
                    onChange={ this._handleChange }
                    autoComplete="off"
                    placeholder={ this.props.placeHolder }
                />
                this._renderAutoDetect()
            </div>
        );
    }
}

export default AutoComplete;