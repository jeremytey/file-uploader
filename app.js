require('dotenv').config();
require('./config/passport');
const express = require('express');
const app = express();
const authRouter = require('./routes/authRouter');
const fileRouter = require('./routes/fileRouter');
const folderRouter = require('./routes/folderRouter');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const {PrismaSessionStore} = require('@quixo3/prisma-session-store');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

// Set EJS as the view engine and specify the views directory
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware to parse URL-encoded bodies, override HTTP methods, and manage sessions
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
        checkPeriod: 2 * 60 * 1000, 
        dbRecordIdIsSessionId: true,
    }),
}));
app.get('/share/:token', folderController.getSharedFolder);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/', authRouter);
app.use('/files', fileRouter);
app.use('/', folderRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

