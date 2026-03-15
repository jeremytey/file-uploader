const { Router } = require('express');
const authController = require('../controllers/authController');
const authRouter = Router();
const authMiddleware = require('../middlewares/auth');

// Register route
authRouter.post('/signup', authController.postSignup);
authRouter.get('/signup', authController.getSignupForm);

// Login route
authRouter.post('/login', authController.postLogin);
authRouter.get('/login', authController.getLoginForm);

// Logout route
authRouter.post('/logout', authMiddleware.isLoggedIn, authController.postLogout);

module.exports = authRouter;
