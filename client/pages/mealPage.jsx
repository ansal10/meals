import React, {Component} from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Helmet } from 'react-helmet';
import InfoBlock from '../components/infoBlock';
import Feature from '../components/feature';
import {fetchMealAction, clearMealData} from "../actions";
import InternalTextBanner from '../components/banners/internalTextBanner';
import {Grid, Row, Col, Image, Button} from 'react-bootstrap';
import ImageSlider from "../components/imageSlider";
import axiosInstance from '../client';

import TitleInfo from "../components/titleInfo";
import {Gen} from "../helpers/gen";
import {Link} from "react-router-dom";
import {DELETE_MEAL_ENDPOINT} from "../endpoints";
import {notify} from "react-notify-toast";
import { withRouter } from 'react-router-dom'


class Meal extends Component {

    componentDidMount(){
        console.log(this.props);
        this.props.fetchMealAction(this.props.match.params.id);
    }

    componentWillUnmount(){
        this.props.clearMealData();
    }

    deleteMeal() {
        axiosInstance.delete(DELETE_MEAL_ENDPOINT + "/" + this.props.match.params.id)
            .then((success) => {
                console.log(success.data.success.message);
                notify.show(success.data.success.message, 'success');
                this.props.history.push(`/meals`);
            })
            .catch((error) => {
                console.log(error.response.data.error.message);
                notify.show(error.response.data.error.message, 'error');
            });
    }

    render() {

        const {mealData} = this.props;

        if(this.props.mealData){
            const {id, title, description, calories, type, items, UserId, time, day, date, createdAt, updatedAt} = this.props.mealData;

            return(
                <div className="meal-page">
                    <Helmet bodyAttributes={{class: "postPage"}}>
                        <title>{`${this.props.mealData.title}`}</title>
                    </Helmet>
                    {/*<InternalTextBanner Heading={this.props.mealData.title} wrapperClass="post" />*/}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="post">
                                    <Grid>
                                        <Row className="title-row">
                                            <TitleInfo name={title} date={date} time={time} day={day}/>
                                            {
                                                mealData.edit ? <div><Link className="right-align" to={`/meal/edit/${id}`}>Edit this meal</Link>
                                                    <div className="delete-meal" onClick={this.deleteMeal.bind(this)}>
                                                        Delete
                                                    </div>
                                                    </div>
                                                    : ''
                                            }
                                        </Row>
                                        <Row className="bottom-line-separator">
                                            {/*<Col xs={12} md={6}>*/}
                                                {/*<div className="post_banner">*/}
                                                    {/*<ImageSlider images={images} />*/}
                                                {/*</div>*/}
                                            {/*</Col>*/}
                                            <Col xs={12} md={6}>

                                                <Row>
                                                    <Col xs={6}>
                                                        <Link to={`/user/${UserId}`} > User Profile </Link>
                                                    </Col>

                                                </Row>

                                                <Row>
                                                    <Col xs={6}>
                                                        <InfoBlock heading="Type" info={type}/>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <InfoBlock heading="time" info={time}/>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="Calories" info={calories} />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="date" info={date}/>
                                                    </Col>
                                                    <Col xs={6} >
                                                        <InfoBlock heading="day" info={day}/>
                                                    </Col>


                                                </Row>

                                            </Col>

                                        </Row>

                                        <Row className="bottom-line-separator">
                                            <Col xs={12}>
                                                <InfoBlock heading="About Meal" info={description} />
                                            </Col>
                                        </Row>


                                        <h1 className="small-header">
                                            Items
                                        </h1>
                                        <Row className="feature-wrapper bottom-line-separator">
                                            {
                                                items.map((feature, i) =>
                                                    <Feature name={feature} key={i} />
                                                )
                                            }
                                        </Row>

                                    </Grid>
                                </div>
                            </div>
                        </div>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div className="meal-page">
                    <Helmet bodyAttributes={{class: "postPage"}}>
                        <title>{'Meal Page'}</title>
                    </Helmet>
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <div className="grid">
                            <div className="column column_12_12">
                                <div className="post">

                                </div>
                            </div>
                        </div>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        }
    }
  }

function mapStateToProps(state){
    return {
        mealData: state.meal,
    };
};

function loadData(store, landingPageID){
    return store.dispatch(fetchMealAction(landingPageID));
}

export default {
    loadData,
    component: withRouter(connect(mapStateToProps, { fetchMealAction, clearMealData })(Meal))
};

