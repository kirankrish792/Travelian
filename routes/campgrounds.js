const express = require('express');
const router = express.Router();

const campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema } = require('../schemas');






const campgroundValidation = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 404)
    }
    else {
        next();
    }
}



router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });

}))

router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', campgroundValidation, catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const newCampground = new campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const findCampground = await campground.findById(id);
    res.render('campgrounds/edit', { findCampground, id });
}))

router.put('/:id', campgroundValidation, catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndUpdate(id, req.body.campground);
    res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

router.get('/:id', catchAsync(async (req, res) => {
    res.render('campgrounds/show', { campground: await campground.findById(req.params.id).populate('reviews') });
}))

module.exports = router;