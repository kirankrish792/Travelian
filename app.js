if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');


const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const UserRouter = require('./routes/user');
const adminRouter = require('./routes/admin');


const User = require('./models/user');
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp_camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const secret = process.env.SECRET;

const store = new MongoStore(
    {
        mongoUrl: dbUrl,
        secret,
        touchAfter: 24 * 3600
    }
)

store.on('error', function (error) {
    console.log("Store error", error);
})


const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize({
    replaceWith: '_',
}));


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.originalUrl = req.originalUrl;
    req.session.returnTo = req.originalUrl;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})



app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/', UserRouter);
app.use('/admin', adminRouter);


app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
})