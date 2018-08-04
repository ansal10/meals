import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputRange, {Range} from 'react-input-range';
import { Field, reduxForm } from 'redux-form';
import {renderDropdownList, renderMultiselect, renderTextField} from "../common/forms/input-types/index";
import { validate_filters as validate }  from './../common/forms/validation';
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import {Gen} from "../helpers/gen";



class Filter extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false,
            rent: {
                min: 500,
                max: 10000
            },
            builtArea: {
                min: 250,
                max: 10000
            },
            carpetArea: {
                min: 250,
                max: 10000
            }
        }
    }


    updateState(obj) {
        const newState = Gen.objectCopy(this.state);
        const key = Object.keys(obj)[0];
        const value = obj[key];

        newState[key] = value;
        this.setState(newState);
    }

    submit(data) {
        console.log(data);
        const dataCopy = Gen.objectCopy(data);
        if(data.UserId) {
            dataCopy.UserId = [this.props.user.id];
        } else {
            dataCopy.UserId = [];
        }
        dataCopy.rent = [this.state.rent.min, this.state.rent.max];
        dataCopy.builtArea = [this.state.builtArea.min, this.state.builtArea.max];
        dataCopy.carpetArea = [this.state.carpetArea.min, this.state.carpetArea.max];

        this.props.applyFilter(dataCopy);
    }

    render(){

        const {handleSubmit} = this.props;
        return(
            <div className="form-wrapper">
                <form className="filter-container" onSubmit={handleSubmit(this.submit.bind(this))} >

                <div className="form_row">
                    <Field
                        name="searchString"
                        component={renderTextField}
                        label="Search:"
                        type="text"
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="type"
                        component={renderMultiselect}
                        label="type:"
                        data={[ '1rk', '2rk', '1bhk', '2bhk', '3bhk', '4bhk', '5bhk', '5bhk+' ]}/>
                </div>

                <div className="form_row">
                    <Field
                        name="furnishingStatus"
                        component={renderMultiselect}
                        label="furnishingStatus:"
                        data={[ 'furnished', 'unfurnished', 'semifurnished' ]}/>
                </div>

                <div className="form_row">
                    <Field
                        name="powerBackup"
                        component={renderMultiselect}
                        label="powerBackup:"
                        data={[ 'full', 'partial', 'no' ]}/>
                </div>

                <div className="form_row">
                    <Field
                        name="availableFor"
                        component={renderMultiselect}
                        label="availableFor:"
                        data={[ 'all', 'family', 'couples', 'bachelors' ]}/>
                </div>

                <div className="form_row">
                    <Field
                        name="availability"
                        component={renderMultiselect}
                        label="availability:"
                        data={[ 'yes', 'no', 'archive' ]}/>
                </div>


                <div className="form_row">
                    <div className="form_item">
                        <div className="form_label">
                            <label>Rent</label>
                        </div>
                        <InputRange
                            draggableTrack
                            maxValue={10000}
                            minValue={500}
                            onChange={value => this.updateState({rent: value})}
                            value={this.state.rent} />
                    </div>
                </div>



                <div className="form_row">
                    <div className="form_item">
                        <div className="form_label">
                        <label>Built Area</label>
                    </div>
                    <InputRange
                        draggableTrack
                        maxValue={10000}
                        minValue={250}
                        onChange={value => this.updateState({builtArea: value})}
                        value={this.state.builtArea} />
                    </div>
                </div>

                <div className="form_row">
                    <div className="form_item">
                        <div className="form_label">
                        <label>Carpet Area</label>
                    </div>
                    <InputRange
                        draggableTrack
                        maxValue={10000}
                        minValue={250}
                        onChange={value => this.updateState({carpetArea: value})}
                        value={this.state.carpetArea} />
                    </div>
                </div>

                    {
                        Gen.isUserRealorOrAdmin(this.props.user) ?
                        <div className="form_row form_checkbox_row">
                            <Field
                                name="UserId"
                                component={renderTextField}
                                label="Listed by me only:"
                                type="checkbox"
                            />
                        </div> : null
                    }

                <div className="filter-button form_buttons">
                    <LaddaButton
                        type="submit"
                        className="btn btn-add first"
                        data-color="#eee"
                        data-size={XL}
                        data-style={SLIDE_UP}
                        data-spinner-size={30}
                        data-spinner-color="#ddd"
                        data-spinner-lines={12}
                    >
                        Apply
                    </LaddaButton>
                </div>

            </form>
            </div>
        )
    };
}

Filter.proptypes = {
    applyFilter: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
}

Filter = reduxForm({
    form: 'filterForm',
    validate,
    enableReinitialize: true,
})(Filter);

export default Filter;