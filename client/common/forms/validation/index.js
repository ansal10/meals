
export const validate_filters = values => {

    const errors = {}

    const requiredFields = [
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    });

    if(values['fromTime']){
        let value = values['fromTime'];
        if(value.length !=5 || isNaN(value[0]) || isNaN(value[1]) || isNaN(value[3]) || isNaN(value[4]) || value[2] !== ':') {
            errors.fromTime = "from time should be in format hh:mm";
        }
    }

    if(values['toTime']){
        let value = values['toTime'];
        if(value.length !=5 || isNaN(value[0]) || isNaN(value[1]) || isNaN(value[3]) || isNaN(value[4]) || value[2] !== ':') {
            errors.toTime = "to time should be in format hh:mm";
        }
    }
    return errors;

};


export const validate_meal = values => {

    const errors = {}

    const requiredFields = [
        'title',
        'description',
        'calories',
        'type',
        'mealDate',
        'mealTime',
        'status',
        'items',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if(values['mealTime']){
        let value = values['mealTime'];
        if(value.length !=5 || isNaN(value[0]) || isNaN(value[1]) || isNaN(value[3]) || isNaN(value[4]) || value[2] !== ':') {
            errors.mealTime = "meal time should be in format hh:mm";
        }
    }

    if(values.title && (values.title.length < 10 || values.title.length > 50))
        errors.title = "title must be between 10 and 50 length";

    if(values.description && (values.description.length < 10 || values.description.length > 1000))
        errors.description = "description must be between 50 and 1000 length";
    return errors;

}

export const validate_contactForm = values => {

    const errors = {}

    const requiredFields = [
      'name',
      'email',
      'message'
    ]

    requiredFields.forEach(field => {
      if (!values[field]) {
        errors[field] = 'Required'
      }
    })

    if (
      values.email &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = 'Invalid email address'
    }

    return errors;

  }


export const validate_registerForm = values => {

    const errors = {}

    const requiredFields = [
        'name',
        'email',
        'password',
        'sex',
        'type',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }

    if (
        values.email && values.email.length < 6
    ) {
        errors.password = 'Invalid password'
    }

    return errors;

}

export const validate_loginForm = values => {

    const errors = {}

    const requiredFields = [
        'email'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.email &&
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
        errors.email = 'Invalid email address'
    }


    return errors;

}

export const validate_resetForm = values => {

    const errors = {}

    const requiredFields = [
        'token',
        'password',
        'confirmPassword'
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if (
        values.password !== values.confirmPassword
    ) {
        errors.confirmPassword = 'Passwords do not match'
    }


    return errors;

}
