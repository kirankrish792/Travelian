const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp_camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', engine);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);



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


app.listen(3000, () => {
    console.log("Server is running in port 3000 ");
})