const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { schema } = require('./schema');
const app = express();
const path = require('path');
const Joi = require('joi');
const methodOverride = require('method-override');
const campground = require('./models/campground');

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


const validation = (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    }
    else {
        next();
    }
}



app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });

}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validation, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const newCampground = new campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const findCampground = await campground.findById(id);
    res.render('campgrounds/edit', { findCampground, id });
}))

app.put('/campgrounds/:id', validation, catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
}))

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    res.render('campgrounds/show', { campground: await campground.findById(req.params.id) });
}))

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