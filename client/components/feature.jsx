import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col, Image, Button} from 'react-bootstrap';


class Feature extends Component {

    constructor(props){
        super(props);
    }

    render(){

        let icon;
        switch (this.props.name) {
            case "Water Purifier":
                icon = 'wp';
                break;
            case "Lift":
                icon = 'lf';
                break;
            case "Water storage":
                icon = 'ws';
                break;
            case "Visitor Parking":
                icon = 'vp';
                break;
            case "Park":
                icon = 'pk';
                break;
            case "Security Personnel":
                icon = 'sp';
                break;
            case "Waste disposal":
                icon = 'wd';
                break;
            case "Rain water harvesting":
                icon = 'rw';
                break;
            case "Gym":
                icon = 'fc';
                break;

            default:
                icon = "fs";
                break;

        }
        return(
            <Col xs={12} md={4} lg={3} className="pdOtherFeatures icon-container">
                <i className={`amnIcons feature-icon ${icon}`}></i>
                <div className="feature-name">{this.props.name}</div>
            </Col>
        )
    };
}

Feature.propTypes = {
    name: PropTypes.any.isRequired,
}

export default Feature;