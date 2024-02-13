
 export const valid = ({ fullname, username, email, password, cf_password, gender }) => {
    const err = {}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if(!fullname){
        err.fullname = "Please add your full name"
    } else if(fullname.length > 25){
        err.fullname = "Full name is up to 25 characters long"
    }

    if(!username){
        err.username = "Please add your user name"
    } else if(username.length > 25){
        err.username = "User name is up to 25 characters long"
    }

    if(!email ) {
        err.email= "Email is required!"
    }else if (!regex.test(email)) {
        err.email= "This is not a valid email!"
    }else if (!email.includes('com') || !email.includes('gmail')  ) {
        err.email= "This is not a valid email!"
    }

    if(!password){
        err.password = "Please add your password"
    } else if(password.length < 6){
        err.password = "Password must be at least 6 characters"
    }

    if(password !== cf_password){
        err.cf_password = "Confirm password did not match"
    }

    return {
        errMsg: err,
        errLength: Object.keys(err).length
    }

}