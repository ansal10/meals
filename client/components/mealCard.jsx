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
        const {id, title, description, calories, type, items, time, day, date, status, createdAt, updatedAt} = this.props.meal;
        return(
            <Row className="meal-card-container" onClick={this.mealClicked.bind(this)}>
                <Col className="meal-image-container" xs={3} md={3}>
                    <img className="meal-image" src={`/assets/graphics/${type}.jpg`} />
                </Col>

                <Col className="meal-info-container" xs={6} md={6}>
                    <div className="meal-title" >
                        {title}
                    </div>
                    <div className="meal-location">
                        {`${Gen.getFormattedDate(date)},  ${time} `}
                    </div>
                    <Row>
                        <Col xs={6} className="meal-area">
                            {day}
                        </Col>
                        <Col xs={6} className="meal-rate">
                            {type}
                        </Col>
                    </Row>
                    <div className="meal-furnishing-status">
                        {`${status ? status : ''} ${calories} calories`}
                    </div>
                </Col>

                <Col className="arrow" xs={3} md={3}>
                    <img className="arrow-indicator" src={Gen.isGreen(this.props.meal) ? "/assets/graphics/down-arrow.png" : "/assets/graphics/up-arrow.png" } />
                </Col>
            </Row>
        )
    };
}

MealCard.propTypes = {
    meal: PropTypes.object.isRequired,
}

export default withRouter(MealCard);
