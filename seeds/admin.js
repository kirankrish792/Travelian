const inquirer = require('inquirer');
const User = require('../models/user');
const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const dbUrl = process.env.MONGODB_URI;

mongoose.connect('mongodb://localhost:27017/yelp_camp');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB')
  registerAdmin();
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
    mask,
  },
];


const upgradeToAdmin = ()=>{
  try{
      inquirer.prompt(choice).then(async (res)=>{
      const { username } = res;
      const updatedValue = await User.findOneAndUpdate({username}, {admin: true},{new: true});
      if(!updatedValue){
        throw new Error('User not found');
      }
      console.log(`success fully upgraded ${username} as admin, congratulations`);
    })
  }catch(err){
    console.dir(err);
  }
}

const registerAdmin = ()=>{
  inquirer.prompt(questions).then(async (res)=>{
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
}

  