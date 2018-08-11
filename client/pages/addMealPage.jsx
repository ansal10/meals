import React, {Component} from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import {Link, NavLink} from 'react-router-dom';
import {notify} from 'react-notify-toast';
import { Field, reduxForm } from 'redux-form';
import { validate_addMeal as validate }  from './../common/forms/validation';
import { renderTextField, renderMultiselect, renderTextarea } from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';

import axiosInstance from '../client';
import {renderDateTimePicker, renderDropdownList} from "../common/forms/input-types/index";
import {CREATE_MEAL_ENDPOINT, UPDATE_MEAL_ENDPOINT} from "../endpoints";
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import UploadImage from "../components/uploadImage";
import {Gen} from "../helpers/gen";
import {clearMealData, fetchMealAction} from "../actions";
import {connect} from "react-redux";

class AddMealPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            showForm: true,
            images: [],
            initialized: false,
            lat: null,
            lng: null,
        };
    }

    getPageType() {
        const id = this.props.match.params.id || null;
        return id ? "Edit" : "Create";
    }

    componentWillMount() {
        const id = this.props.match.params.id || null;
        if(id) {
            this.props.fetchMealAction(id);
        } else {
            this.props.clearMealData();
        }
    }


    toggle() {
        this.setState({
            loading: !this.state.loading,
            progress: 0.5,
            showForm: this.state.showForm,
            initialized: this.state.initialized,
        });
    }

    addImage(uploadUrl) {
        const newState = Gen.objectCopy(this.state);
        newState.images.push(uploadUrl);
        this.setState(newState);
    }

    removeImage() {
        // no action
    }

    latlngReceived(latlng) {
        console.log(latlng);
        const newState = {...this.state, ...latlng};
        this.setState(newState);
    }


    submit(data){
        this.toggle();
        console.log(data);

        const images = data.images ? Gen.mergeArray(data.images, this.state.images) : this.state.images;

        let {title, description, calories, type, items, mealTime, mealDate, status} = data;

        let time = Gen.getTimeFromISODate(mealTime);
        let date = Gen.getDateFromISODate(mealDate);
        let day = Gen.getDayFromISODate(mealDate);

        const id = this.props.match.params.id || null;

        const endpoint = this.getPageType() === "Edit" ? UPDATE_MEAL_ENDPOINT + "/" + id : CREATE_MEAL_ENDPOINT;

        const postData = {id, title, description, calories, type, items, time, day, date, status};

        if(this.getPageType() === "Edit") {
            axiosInstance.put(endpoint, postData)
                .then((success) => {
                    console.log(success.data.success.message);
                    this.toggle();
                    notify.show(success.data.success.message, 'success');
                    this.setState({
                        loading: false,
                        showForm: false,
                    })
                })
                .catch((error) => {
                    console.log(error.response.data.error.message);
                    notify.show(error.response.data.error.message, 'error');
                    this.toggle();
                });
        } else {
            axiosInstance.post(endpoint, postData)
                .then((success) => {
                    console.log(success.data.success.message);
                    this.toggle();
                    notify.show(success.data.success.message, 'success');
                    this.setState({
                        loading: false,
                        showForm: false,
                    })
                })
                .catch((error) => {
                    console.log(error.message);
                    notify.show(error.message, 'error');
                    this.toggle();
                });
        }
  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`Add/Edit Meal`}</title>
        </Helmet>
    );
  }

    render() {

      const { handleSubmit, mealData } = this.props;
      const pageType = this.getPageType();

      if((pageType === 'Edit' && !mealData) || (pageType === 'Create' && mealData)) {
          return null;
      }

      return (

          <section className="contactPage_wrap">
          {this.head()}
            <ReactCSSTransitionGroup transitionName="anim" transitionAppear={true}  transitionAppearTimeout={5000} transitionEnter={false} transitionLeave={false}>
            <div className="main anim-appear">
                  <div className="grid">
                      <div className="column column_12_12">
                        <div className="content_block">
                            {
                                !this.state.showForm ? <div className="confirm_email_block">
                                    <div className="confirm_email_check">
                                        Resource created/updated successfully
                                    </div>
                                    <Link className="proceed-to-link" to="/">Proceed to meals page</Link>

                                </div>: <form className="add-meal-container" onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">

                                        <div className="form_row">
                                            <Field
                                                name="title"
                                                component={renderTextField}
                                                label="Title:"
                                            />
                                        </div>

                                        <UploadImage images={mealData ? mealData.images : []} addImage={this.addImage.bind(this)} removeImage={this.removeImage.bind(this)}/>
                                        <div className="form_row">
                                            <Field
                                                name="description"
                                                component={renderTextField}
                                                label="Description:"
                                            />
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="calories"
                                                component={renderTextField}
                                                label="Calories:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="type"
                                                component={renderDropdownList}
                                                label="Type:"
                                                data={[ 'breakfast', 'lunch', 'snacks', 'dinner', 'others' ]}/>
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="mealDate"
                                                component={renderDateTimePicker}
                                                showTime={false}
                                                label="Meal Date:"
                                            />
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="mealTime"
                                                component={renderDateTimePicker}
                                                showTime={true}
                                                dontShowDate={true}
                                                label="Meal Time:"
                                            />
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="status"
                                                component={renderDropdownList}
                                                label="Status:"
                                                data={[ 'exact', 'over', 'below' ]}/>
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="features"
                                                component={renderMultiselect}
                                                label="features:"
                                                data={[ 'eggs', 'fruits', 'other', 'rice']}/>
                                        </div>


                                        <div className="form_buttons">
                                            <LaddaButton
                                                type="submit"
                                                className="btn btn-add first"
                                                loading={this.state.loading}
                                                data-color="#eee"
                                                data-size={XL}
                                                data-style={SLIDE_UP}
                                                data-spinner-size={30}
                                                data-spinner-color="#ddd"
                                                data-spinner-lines={12}
                                            >
                                                {pageType} meal
                                            </LaddaButton>
                                        </div>

                                    </div>

                                </form>
                            }

                        </div>
                      </div>
                  </div>
              </div>
              </ReactCSSTransitionGroup>

          </section>

      );
    }
  }


function mapStateToProps(state){
    return {
        mealData: state.meal,
        initialValues: state.meal
    };
};

AddMealPage = reduxForm({
      form: 'mealForm',
      validate,
      enableReinitialize: true,
})(AddMealPage);

export default {
    component: connect(mapStateToProps, { fetchMealAction, clearMealData })(AddMealPage)
};
