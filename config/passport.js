const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
// Pool replaced with PrismaClient for database interactions
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const passport = require('passport');

// Passport authentication setup
passport.use(
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    username: username
                }
            });
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
}); // Serialize user ID to store in session

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id
            }
        });
        done(null, user);
    } catch (err) {
        done(err);
    }
}); // Deserialize user from session

module.exports = passport;