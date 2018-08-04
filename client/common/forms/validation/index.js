
export const validate_filters = values => {

    const errors = {}

    const requiredFields = [
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })
    return errors;

};


export const validate_addProperty = values => {

    const errors = {}

    const requiredFields = [
        'title',
        'country',
        'city',
        'locality',
        'rent',
        'builtArea',
        'carpetArea',
        'type',
        'availability',
        'availableFrom',
        'description',
        'availableFor',
        'floor',
        'address',
        'powerBackup',
        'maintenance',
        'features',
        'furnishingStatus',
    ]

    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Required'
        }
    })

    if(values.address && (values.address.length < 10 || values.address.length > 100))
        errors.address = "address must be between 10 and 100 length";

    if(values.title && (values.title.length < 10 || values.title.length > 50))
        errors.title = "title must be between 10 and 50 length";

    if(values.description && (values.description.length < 50 || values.description.length > 1000))
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