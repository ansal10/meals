import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import {Gen} from "../helpers/gen";


class UserCard extends Component {

    constructor(props){
        super(props);
    }

    mealClicked() {
        this.props.history.push(`/user/${this.props.user.id}`);
    }

    render(){
        const {id, email, name, sex, role, status, createdAt, updatedAt} = this.props.user;
        return(
            <Row className="meal-card-container" onClick={this.mealClicked.bind(this)}>
                <Col className="meal-image-container" xs={4} md={3}>
                    <img className="meal-image" src="https://www.mykhel.com/thumb/247x100x233/cricket/players/9/11419..jpg" />
                </Col>

                <Col className="meal-info-container" xs={8} md={9}>
                    <div className="meal-title" >
                        {name}
                    </div>
                    <div className="meal-location">
                        {`sex: ${sex} `}
                    </div>
                    <div className="meal-location">
                        {`role: ${role} `}
                    </div>
                    <div className={`${status === 'active' ? 'green' : 'red'} meal-location`}>
                        {`status: ${status} `}
                    </div>

                    <Row>
                        <Col xs={6} className="meal-area">
                            {email}
                        </Col>
                        <Col xs={6} className="meal-rate">
                            {`createdAt: ${Gen.getDateFromISODate(createdAt)}`}
                        </Col>
                    </Row>
                    <div className="meal-furnishing-status">
                        {`updatedAt: ${Gen.getDateFromISODate(updatedAt)}`}
                    </div>
                </Col>
            </Row>
        )
    };
}

UserCard.propTypes = {
    user: PropTypes.object.isRequired,
}

export default withRouter(UserCard);
