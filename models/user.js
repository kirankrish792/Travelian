const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin:{
        type: Boolean,
        default: false,
        required: true
    },
    campgrounds:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Campground'
        }
    ],
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);