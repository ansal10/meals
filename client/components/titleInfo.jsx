import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Col} from 'react-bootstrap';


class TitleInfo extends Component {

    constructor(props){
        super(props);
    }

    render(){

        const {name, location, price, area} = this.props;
        return(
            <Col xs={12} className="title-container" >
                <div className="title dark-text">
                    {name}
                </div>
                <div className="location light-text">
                    {location}
                </div>
                <div className="price dark-text float-left margin-right-10">
                    {price}
                </div>
                <div className="area light-text">
                    {area}
                </div>
            </Col>
        )
    };
}

TitleInfo.propTypes = {
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    area: PropTypes.string.isRequired,
}

export default TitleInfo;