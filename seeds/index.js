const mongoose = require('mongoose');
const campground = require('../models/campground');
const User = require('../models/user');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelper');


mongoose.connect('mongodb://127.0.0.1/yelp_camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


const sample = Array => Math.floor(Math.random() * Array.length);
const price = Math.floor(Math.random() * 100) + 10;

const seedDb = async () => {
    await campground.deleteMany({});
    const user = await User.findById("62ea40d1866afe8ec0ffe1ee");
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const newCampground = new campground({
          author: "62ea40d1866afe8ec0ffe1ee",
          title: `${descriptors[sample(descriptors)]} ${
            places[sample(places)]
          }`,
          location: `${cities[random1000].city}, ${cities[random1000].state}`,
          description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit.Necessitatibus incidunt enim culpa, accusamus autem maxime cupiditate perspiciatis magni eos praesentium dicta facere dolores, ipsam architecto voluptatem deserunt repellat doloribus eveniet!",
          price,
          geometry: {
            type: "Point",
            coordinates: [
              cities[random1000].longitude,
              cities[random1000].latitude,
            ],
          },
          images: [
            {
              url: "https://res.cloudinary.com/df5mquyck/image/upload/v1653405083/YelpCamp/kd56ckmow8r87lmwd1vp.jpg",
              filename: "YelpCamp/kj5j7aqubz8z3eaqfbgx",
            },
            {
              url: "https://res.cloudinary.com/df5mquyck/image/upload/v1653469848/YelpCamp/hibckpdxems69tgzqezr.jpg",
              filename: "YelpCamp/afjuauq8qxlohifdwyzj",
            },
          ],
        });
        user.campgrounds.push(newCampground);
        await newCampground.save();
        await user.save();
    }
}

seedDb();