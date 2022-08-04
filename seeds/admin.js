const inquirer = require('inquirer');
const User = require('../models/user');
const mongoose = require('mongoose');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1/yelp_camp';

mongoose.connect(dbUrl);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB')
  inquirer.prompt(choiceQuestion).then(res => {
    if (res.choice === '1') {
      return registerAdmin()
    }
    upgradeToAdmin()
  })
});


const choiceQuestion = [
  {
    type: 'input',
    name: 'choice',
    message: "1 for Register a new admin\n2 For Upgrade a existing User to admin: "
  }
]

const questions = [
  {
    type: 'input',
    name: 'username',
    message: "What's your username?",
  },
  {
    type: 'input',
    name: 'name',
    message: "What's your name?",
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
    mask: true
  },
];


const upgradeToAdmin = () => {
  try {
    inquirer.prompt(questions[0]).then(async (res) => {
      const { username } = res;
      const updatedValue = await User.findOneAndUpdate(
        { username },
        { isAdmin: true },
      );
      if (!updatedValue) {
        throw new Error('User not found');
      }
      console.log(`success fully upgraded ${username} as admin, congratulations`);
      process.exit(1);
    })
  } catch (err) {
    console.dir(err);
    process.exit(1);
  }
}

const registerAdmin = () => {
  inquirer.prompt(questions).then(async (res) => {
    try {
      const isAdmin = true
      const { username, password, email,name } = res;
      const newUser = new User({ username, email, isAdmin,name });
      const registerUser = await User.register(newUser, password);
      console.log(`success fully added ${username} as admin, congratulations`);
      process.exit(1);
    }
    catch (err) {
      console.log(err);
      process.exit(1);
    }
  })
}

