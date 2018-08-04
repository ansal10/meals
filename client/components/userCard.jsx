import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Grid, Row, Col} from 'react-bootstrap';
import { withRouter } from 'react-router-dom'
import {Gen} from "../helpers/gen";


class UserCard extends Component {

    constructor(props){
        super(props);
    }

    propertyClicked() {
        this.props.history.push(`/user/${this.props.user.id}`);
    }

    render(){
        const {id, email, name, sex, role, status, createdAt, updatedAt} = this.props.user;
        return(
            <Row className="property-card-container" onClick={this.propertyClicked.bind(this)}>
                <Col className="property-image-container" xs={4} md={3}>
                    <img className="property-image" src="https://www.mykhel.com/thumb/247x100x233/cricket/players/9/11419..jpg" />
                </Col>

                <Col className="property-info-container" xs={8} md={9}>
                    <div className="property-title" >
                        {name}
                    </div>
                    <div className="property-location">
                        {`sex: ${sex} `}
                    </div>
                    <div className="property-location">
                        {`role: ${role} `}
                    </div>
                    <div className={`${status === 'active' ? 'green' : 'red'} property-location`}>
                        {`status: ${status} `}
                    </div>

                    <Row>
                        <Col xs={6} className="property-area">
                            {email}
                        </Col>
                        <Col xs={6} className="property-rate">
                            {`createdAt: ${Gen.getFormattedDate(createdAt)}`}
                        </Col>
                    </Row>
                    <div className="property-furnishing-status">
                        {`updatedAt: ${Gen.getFormattedDate(updatedAt)}`}
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