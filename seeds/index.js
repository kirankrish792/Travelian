const mongoose = require('mongoose');
const campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');


mongoose.connect('mongodb://localhost:27017/yelp_camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const sample = Array => Math.floor(Math.random() * Array.length);

const seedDb = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 60; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const newCampground = new campground({
            title: `${descriptors[sample(descriptors)]} ${places[sample(places)]}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`
        })
        await newCampground.save();
    }
}

seedDb();