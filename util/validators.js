module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Void username is not allowed';
    }
    if(email.trim() === ''){
        errors.email = 'Magic email shall not be passed';
    } else {
        const emailRegEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[0-9a-zA-Z]{2,9})$/;
        if(!email.match(emailRegEx)){
            errors.email = 'Please forgive my offense. This is not a human email';
        }
    }
    if(password === ''){
        errors.password = 'Your password is void';
    }else if (password !== confirmPassword){
        errors.confirmPassword = 'Your confirm to pass the confirmPassword?';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (
    username,
    password,
) => {
    const errors = {};
    if(username.trim() === ''){
        errors.username = 'Username and password must not be empty';
    }
    if(password.trim() === ''){
        errors.password = 'Username and password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}