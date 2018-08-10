import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from '../components/banners/internalTextBanner';
import {clearNextUrl, fetchMealsAction} from '../actions';
import { Helmet } from 'react-helmet';
import {Link} from 'react-router-dom';
import PropertyCard from "../components/mealCard";
import Filter from "../components/filter";
import MultipleMapContainer from "../components/mapMultiple";

class Meals extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showFilterOnMobile: false,
            filters: {}
        };
    }


    componentDidMount(){
        this.props.clearNextUrl();
        this.props.fetchMealsAction();
    }

    loadMoreClicked() {
        console.log("load more clicked")
        this.props.fetchMealsAction(this.state.filters);
    }

    renderMeals() {
        if (this.props.meals != false) {
            const mealsData = this.props.meals.map((meal, index) => {
                return (
                    <div key={index} className="meal">
                        <PropertyCard meal={meal}/>
                    </div>
                );
            });

            return (<div>
                {mealsData}
                    <div className={`${this.props.nextUrl ? '' : 'hidden'} load-more-container`}>
                        <div className="load-more" onClick={this.loadMoreClicked.bind(this)}> Load more</div>
                    </div>
                </div>
            );
        }
    }

    shouldShowMap() {
        return this.props.location.pathname.includes("/meals/map");
    }

    renderMealsOnMap() {
        if (this.props.meals) {
            const coordinates = this.props.meals.map((meal, i) => {
                const {latitude, longitude, id} = meal;
                return {latitude, longitude, id};
                // return {latitude: 40.741895, longitude: -73.989308};
            });


            return (
                <MultipleMapContainer title="Property search" coordinates={coordinates}/>
            )

        }
    }

    showFilter() {
        this.setState({
            showFilterOnMobile: true,
            filters: this.state.filters
        })
    }

    hideFilter() {
        this.setState({
            showFilterOnMobile: false,
            filters: this.state.filters
        })
    }


    head(){
        return (
            <Helmet bodyAttributes={{class: "postsPage"}}>
                <title>{`Meals Page`}</title>
            </Helmet>
        );
    }

    fetchPropertyAndHideFilterOnMobile(data) {
        this.props.clearNextUrl();
        this.props.fetchMealsAction(data);
        this.setState({
            showFilterOnMobile: false,
            filters: data
        })
    }

    displayNavLink(isMap) {
        return isMap ? <Link className="right-align" to="/meals">See meals list</Link> : <Link className="right-align" to="/meals/map">See meals on map</Link>
    }

    render() {

        const isMap = this.shouldShowMap();

        const {meals} = this.props;
        if(this.props.meals){
            return(
                <div className="meals-page">
                    {this.head()}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <Grid className="meals">

                            <Row>
                                {this.displayNavLink(isMap)}
                            </Row>

                            <div className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'} show-filter-button`} onClick={this.showFilter.bind(this)}>
                                filter
                            </div>

                            <Row>
                                <Col className={`${!this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={4}>
                                    <Filter user={this.props.user} applyFilter={this.fetchPropertyAndHideFilterOnMobile.bind(this)}/>
                                </Col>
                                <Col className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={8}>
                                    {
                                        (meals.length > 0) ? (
                                            isMap ? this.renderMealsOnMap() : this.renderMeals())
                                         :
                                           <div className="no-result">
                                            <h2> Oops!!! No Results</h2>
                                            <h2> Try to widen your search</h2>
                                           </div>
                                    }
                                </Col>
                            </Row>
                        </Grid>
                    </div>
                    </ReactCSSTransitionGroup>
                </div>
            );
        } else {
            return (
                <div>
                    {this.head()}
                    <InternalTextBanner Heading="" wrapperClass="posts" />
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                        <div className="main anim-appear">
                            <div className="grid">
                                <div className="column column_8_12">
                                    <div className="posts">

                                    </div>
                                </div>
                                <div className="column column_4_12">

                                </div>
                            </div>
                        </div>
                    </ReactCSSTransitionGroup>
                </div>);
        }
  }
}

function mapStateToProps(state){
    return {
        meals: state.meals.arr,
        nextUrl: state.meals.nextUrl,
        user: state.user,
    };
};

function loadData(store){
    return store.dispatch(fetchMealsAction());
}

export default {
    loadData,
    component: connect(mapStateToProps, { fetchMealsAction, clearNextUrl })(Meals)
};

