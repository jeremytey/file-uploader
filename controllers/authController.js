const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const  passport = require('../config/passport');
const bcrypt = require('bcrypt');

const getLoginForm = (req, res) => {
    res.render('login');
};

const postLogin = (req, res, next) => {
    passport.authenticate('local',
        { successRedirect: '/', 
          failureRedirect: '/login' })(req, res, next);
};

const getSignupForm = (req, res) => {
    res.render('signUp');
};

const postSignup = async (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('signUp', { message: 'Passwords do not match' });
    }
    if (username.trim().length === 0 || password.trim().length === 0) {
        return res.render('signUp', { message: 'Username and password cannot be empty' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return res.render('signUp', { message: 'Username already exists' });
        }
        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = await prisma.user.create({
            data: {
                username,
                passwordHash,
            },
        });
        req.login(newUser, (err) => {
            if (err) {
                return res.render('signUp', { message: 'Error occurred while logging in' });
            }
            res.redirect('/');
        });
    } catch (error) {
        console.error(error);
        res.render('signUp', { message: 'An error occurred while creating the user' });
    }
};

const postLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
};

module.exports = {
    getLoginForm,
    postLogin,
    getSignupForm,
    postSignup,
    postLogout,
};