import React, {Component} from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import {Link, NavLink} from 'react-router-dom';
import {notify} from 'react-notify-toast';
import { Field, reduxForm } from 'redux-form';
import { validate_addProperty as validate }  from './../common/forms/validation';
import { renderTextField, renderMultiselect, renderTextarea } from './../common/forms/input-types';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InternalTextBanner from './../components/banners/internalTextBanner';

import axiosInstance from '../client';
import {renderDateTimePicker, renderDropdownList} from "../common/forms/input-types/index";
import {CREATE_PROPERTY_ENDPOINT, UPDATE_PROPERTY_ENDPOINT} from "../endpoints";
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import UploadImage from "../components/uploadImage";
import {Gen} from "../helpers/gen";
import {clearPropertyData, fetchPropertyAction} from "../actions";
import {connect} from "react-redux";
import LocationSearchInput from "../components/locationSearchInput";

class AddPropertyPage extends Component {

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
            this.props.fetchPropertyAction(id);
        } else {
            this.props.clearPropertyData();
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

      let {title, country, city, locality, rent, builtArea, carpetArea, latitude, longitude, type, availability, availableFrom, description, availableFor, floor, address, powerBackup, maintenance, features, furnishingStatus} = data;

      if(!latitude) {
          latitude = this.state.lat;
      }

        if(!longitude) {
            longitude = this.state.lng;
        }

        const id = this.props.match.params.id || null;
        const endpoint = this.getPageType() === "Edit" ? UPDATE_PROPERTY_ENDPOINT + "/" + id : CREATE_PROPERTY_ENDPOINT;

        const postData = {id, images, title, country, city, locality, rent, builtArea, carpetArea, latitude, longitude, type, availability, availableFrom, description, availableFor, floor, address, powerBackup, maintenance, features, furnishingStatus};

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
                    console.log(error.response.data.error.message);
                    notify.show(error.response.data.error.message, 'error');
                    this.toggle();
                });
        }
  }

  head(){
    return (
        <Helmet bodyAttributes={{class: "contactPage"}}>
          <title>{`Add/Edit Property`}</title>
        </Helmet>
    );
  }

    render() {

      const { handleSubmit, propertyData } = this.props;
      const pageType = this.getPageType();

      if((pageType === 'Edit' && !propertyData) || (pageType === 'Create' && propertyData)) {
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
                                    <Link className="proceed-to-link" to="/">Proceed to properties page</Link>

                                </div>: <form className="add-property-container" onSubmit={handleSubmit(this.submit.bind(this))}>

                                    <div className="form_wrap">

                                        <div className="form_row">
                                            <Field
                                                name="title"
                                                component={renderTextField}
                                                label="Title:"
                                            />
                                        </div>

                                        <UploadImage images={propertyData ? propertyData.images : []} addImage={this.addImage.bind(this)} removeImage={this.removeImage.bind(this)}/>
                                        <div className="form_row">
                                            <Field
                                                name="country"
                                                component={renderTextField}
                                                label="country:"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="city"
                                                component={renderTextField}
                                                label="city:"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="locality"
                                                component={renderTextField}
                                                label="locality:"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="rent"
                                                component={renderTextField}
                                                label="rent:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="builtArea"
                                                component={renderTextField}
                                                label="builtArea:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="carpetArea"
                                                component={renderTextField}
                                                label="carpetArea:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="latitude"
                                                component={renderTextField}
                                                label="latitude:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="longitude"
                                                component={renderTextField}
                                                label="longitude:"
                                                type="number"
                                            />
                                        </div>


                                        <div className="form_row">
                                            <div className="form_label">
                                                <label>Enter location</label>
                                            </div>
                                        <LocationSearchInput latlngReceived={this.latlngReceived.bind(this)}/>
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="type"
                                                component={renderDropdownList}
                                                label="type:"
                                                data={[ '1rk', '2rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+' ]}/>
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="availability"
                                                component={renderDropdownList}
                                                label="availability:"
                                                data={[ 'yes', 'no', 'archive' ]}/>
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="availableFrom"
                                                component={renderDateTimePicker}
                                                showTime={false}
                                                label="availableFrom:"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="description"
                                                component={renderTextarea}
                                                label="description:"
                                            />
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="availableFor"
                                                component={renderDropdownList}
                                                label="availableFor:"
                                                data={[ 'all', 'family', 'couples', 'bachelors' ]}/>
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="floor"
                                                component={renderTextField}
                                                label="floor:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="address"
                                                component={renderTextarea}
                                                label="address:"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="powerBackup"
                                                component={renderDropdownList}
                                                label="powerBackup:"
                                                data={[ 'full', 'partial', 'no' ]}/>
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="maintenance.monthly"
                                                component={renderTextField}
                                                label="maintenance monthly:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="maintenance.deposit"
                                                component={renderTextField}
                                                label="maintenance deposit:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="maintenance.brokerage"
                                                component={renderTextField}
                                                label="maintenance brokerage:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="maintenance.annually"
                                                component={renderTextField}
                                                label="maintenance annually:"
                                                type="number"
                                            />
                                        </div>

                                        <div className="form_row">
                                            <Field
                                                name="features"
                                                component={renderMultiselect}
                                                label="features:"
                                                data={[ 'Water Purifier','Lift','Water storage','Visitor Parking','Park','Security Personnel','Waste disposal','Rain water harvesting','Gym','tv','wardrobe','bed','dinning table','fridge','sofa','stove','washing machine' ]}/>
                                        </div>


                                        <div className="form_row">
                                            <Field
                                                name="furnishingStatus"
                                                component={renderDropdownList}
                                                label="furnishingStatus:"
                                                data={[ 'furnished', 'unfurnished', 'semifurnished' ]}/>
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
                                                {pageType} property
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
        propertyData: state.property,
        initialValues: state.property
    };
};

AddPropertyPage = reduxForm({
      form: 'propertyForm',
      validate,
      enableReinitialize: true,
})(AddPropertyPage);

export default {
    component: connect(mapStateToProps, { fetchPropertyAction, clearPropertyData })(AddPropertyPage)
};