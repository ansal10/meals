import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InputRange, {Range} from 'react-input-range';
import { Field, reduxForm } from 'redux-form';
import {renderDropdownList, renderMultiselect, renderTextField} from "../common/forms/input-types/index";
import { validate_filters as validate }  from './../common/forms/validation';
import LaddaButton, {SLIDE_UP, XL} from "react-ladda";
import {Gen} from "../helpers/gen";
import { renderDateTimePicker } from "../common/forms/input-types";

class Filter extends Component {

    constructor(props){
        super(props);

        this.state = {
            loading: false,
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
        let dataCopy = {};
        if(data.type) {
            dataCopy.type = data.type;
        }

        if(data.day) {
            dataCopy.day = data.day;
        }


        if(this.props.userId) {
            dataCopy.UserId = [this.props.userId];
        } else {
            dataCopy.UserId = [];
        }


        dataCopy.date = [data.fromDate ? Gen.getDateFromISODate(data.fromDate) : '1990-01-01', data.toTime ? Gen.getDateFromISODate(data.toDate) : '2020-01-01'];
        dataCopy.time = [data.fromTime ? data.fromTime : '00:00', data.toTime ? data.toTime: '24:00'];

        this.props.applyFilter(dataCopy);
    }

    render(){

        const {handleSubmit} = this.props;
        return(
            <div className="form-wrapper form_wrap">
                <form className="filter-container" onSubmit={handleSubmit(this.submit.bind(this))} >

                <div className="form_row">
                    <Field
                        name="type"
                        component={renderMultiselect}
                        label="type:"
                        data={[ "breakfast", "dinner", "lunch", "snacks", "others"  ]}/>
                </div>

                <div className="form_row">
                    <Field
                        name="day"
                        component={renderMultiselect}
                        label="day:"
                        data={[ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ]}/>
                </div>

                <div className="form_row">
                    <Field
                        name="fromDate"
                        component={renderDateTimePicker}
                        label="from date:"
                        showTime={false}
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="toDate"
                        component={renderDateTimePicker}
                        label="to date:"
                        showTime={false}
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="fromTime"
                        component={renderTextField}
                        placeholder="HH:MM"
                        label="from time:"
                    />
                </div>

                <div className="form_row">
                    <Field
                        name="toTime"
                        placeholder="HH:MM"
                        component={renderTextField}
                        label="to time:"
                    />
                </div>

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
    userId: PropTypes.number,
}

Filter = reduxForm({
    form: 'filterForm',
    validate,
    enableReinitialize: true,
})(Filter);

export default Filter;
