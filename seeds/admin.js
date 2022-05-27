const inquirer = require('inquirer');
const User = require('../models/user');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp_camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB\n');
});


const questions = [
  {
    type: 'input',
    name: 'username',
    message: "What's your username?",
  },
  {
    type: 'input',
    name: 'email',
    message: "What's your email?",
  },
  {
    type: 'password',
    name: 'password',
    message: "What's your password?",
  },
];

const name =inquirer.prompt(questions[0]).then(async (res)=>{
    try{
    const admin = true
    const { username, password, email } = res;
    const newUser = new User({ username, email, admin });
    const registerUser = await User.register(newUser, password);
    console.log(`success fully added ${username} as admin, congratulations`);
    }
    catch(err){
        console.log(err);
    }

})


  