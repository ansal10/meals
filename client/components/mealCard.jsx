import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import {Gen} from "../helpers/gen";


class MealCard extends Component {

    constructor(props){
        super(props);
    }

    mealClicked() {
        this.props.history.push(`/meal/${this.props.meal.id}`);
    }

    render(){
        const {id, images, title, city, country, locality, edit, rent, builtArea, type, availableFrom} = this.props.meal;
        const availableFromMessage = Gen.getAvailableString(availableFrom);
        return(
            <Row className="meal-card-container" onClick={this.mealClicked.bind(this)}>
                <Col className="meal-image-container" xs={4} md={3}>
                    <img className="meal-image" src={images[0]} />
                </Col>

                <Col className="meal-info-container" xs={8} md={9}>
                    <div className="meal-title" >
                        {title}
                    </div>
                    <div className="meal-location">
                        {`${locality}, ${city}, ${country} `}
                    </div>
                    <Row>
                        <Col xs={6} className="meal-area">
                            {`${Gen.round(builtArea)} sq ft`}
                        </Col>
                        <Col xs={6} className="meal-rate">
                            {`$ ${Gen.round(rent)}`}
                        </Col>
                    </Row>
                    <div className="meal-furnishing-status">
                        {`${type}, ${availableFromMessage}`}
                    </div>
                </Col>
            </Row>
        )
    };
}

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
}

export default withRouter(MealCard);
