import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import {Gen} from "../helpers/gen";


class PropertyCard extends Component {

    constructor(props){
        super(props);
    }

    propertyClicked() {
        this.props.history.push(`/property/${this.props.property.id}`);
    }

    render(){
        const {id, images, title, city, country, locality, edit, rent, builtArea, type, availableFrom} = this.props.property;
        const availableFromMessage = Gen.getAvailableString(availableFrom);
        return(
            <Row className="property-card-container" onClick={this.propertyClicked.bind(this)}>
                <Col className="property-image-container" xs={4} md={3}>
                    <img className="property-image" src={images[0]} />
                </Col>

                <Col className="property-info-container" xs={8} md={9}>
                    <div className="property-title" >
                        {title}
                    </div>
                    <div className="property-location">
                        {`${locality}, ${city}, ${country} `}
                    </div>
                    <Row>
                        <Col xs={6} className="property-area">
                            {`${Gen.round(builtArea)} sq ft`}
                        </Col>
                        <Col xs={6} className="property-rate">
                            {`$ ${Gen.round(rent)}`}
                        </Col>
                    </Row>
                    <div className="property-furnishing-status">
                        {`${type}, ${availableFromMessage}`}
                    </div>
                </Col>
            </Row>
        )
    };
}

PropertyCard.propTypes = {
    property: PropTypes.object.isRequired,
}

export default withRouter(PropertyCard);