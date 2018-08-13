import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Grid, Row, Col} from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from '../components/banners/internalTextBanner';
import {clearNextUrl, fetchMealsAction} from '../actions';
import { Helmet } from 'react-helmet';
import {Link} from 'react-router-dom';
import MealCard from "../components/mealCard";
import Filter from "../components/filter";

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
        const id = this.props.match.params.id;
        if(id)
            this.props.fetchMealsAction({UserId: [id]});
        else
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
                        <MealCard meal={meal}/>
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

    fetchMealAndHideFilterOnMobile(data) {
        this.props.clearNextUrl();
        this.props.fetchMealsAction(data);
        this.setState({
            showFilterOnMobile: false,
            filters: data
        })
    }


    render() {

        const {meals} = this.props;
        const userId = this.props.match.params.id;
        if(this.props.meals){
            return(
                <div className="meals-page">
                    {this.head()}
                    <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
                    <div className="main anim-appear">
                        <Grid className="meals">

                            <div className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'} show-filter-button`} onClick={this.showFilter.bind(this)}>
                                filter
                            </div>

                            <Row>
                                <Col className={`${!this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={4}>
                                    <Filter user={this.props.user} applyFilter={this.fetchMealAndHideFilterOnMobile.bind(this)} userId={userId ? userId: ''} />
                                </Col>
                                <Col className={`${this.state.showFilterOnMobile ? 'mobile-hidden' : 'mobile-displayed'}`} xs={12} md={8}>
                                    {
                                        (meals.length > 0) ? this.renderMeals()
                                         :
                                           <div className="no-result">
                                            <h2> Oops!!! No meals</h2>
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

