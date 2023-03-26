const User = require('../models/User');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

exports.home = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('home', {message: 'Welcome to my first Middleware REST API'}); // send in signup.ejs file
}
exports.register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('signUp', {pageTitle: 'Sign Up Form'}); // Send in signup.ejs file
}

exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    // Create User
    const {name, email, password, confirmPassword} = req.body;
    try{
        User.create({
            name: name,
            password: password,
            email: email,
            confirmPassword: confirmPassword
       
       
        }).then(user => res.json(user));
    } catch(error){
        console.log(error);
        const errors = validationResult(req);
        const errorDetails = [
            {
                "location": "Authorization",
                "msg": `${name} ${errors}`,
                "param": name
            }
        ];
        res.json({errors: errorDetails});
    }
}
exports.loginForm = async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    res.status(200).render('login', {pageTitle: 'Login Form'}); // Send back the login.ejs files
}
exports.login = async (req, res) => {  //Michael Brown ASU IFT458

    // find the user
    const user = await User.findOne({email: req.body.email});
    
    if(!user){
        return res.status(401).render('home', {message: `<<Error>> login unsuccessful, invalid credentials`});
    }
    // compare the password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if(!isMatch){
        return res.status(401).render('home', {message: `<<Error>> User: ${user.name} login unsuccessful`});
    }
    // login user
    try{
        let token = await user.generateAuthToken();
        res.cookie('jwtoken', token, {
            expires: new Date(Date.now() + 25892000000),
            httpOnly: true
        });
        res.status(200).render('home', {message: `User: ${user.name} login successful`});
    } catch(error){
        console.log(error);
        res.status(401).render('home', {message: `User: ${user.name} Error: ${error} login unsuccessful`});
    }
}

exports.logout = async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((currentElement) => {
            return currentElement.token !== req.token;
        });
        res.clearCookie('jwtoken', {path: '/'});
        await req.user.save();
        res.status(200).send('User logout');
    } catch(error){
        console.log(error);
    }
}