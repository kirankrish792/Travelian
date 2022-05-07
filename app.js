const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const campground = require('./models/campground');
const { findById } = require('./models/campground');

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




app.get('/', (req, res) => {
    res.render('home');
})

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });

})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const newCampground = new campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const findCampground = await campground.findById(id);
    res.render('campgrounds/edit', { findCampground, id });
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})

app.get('/campgrounds/:id', async (req, res) => {
    res.render('campgrounds/show', { campground: await campground.findById(req.params.id) });
})

app.listen(3000, () => {
    console.log("Server is running in port 3000 ");
})