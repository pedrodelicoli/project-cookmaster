const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { createUser, findByEmail } = require('../models/usersModel');
const { errorHandler } = require('../utils/errorhandler');

const erro400 = 400;
const erro409 = 409;
const erro401 = 401;

const secret = 'seusecretdetoken';

const errorName = {
  exists: 'Email already registered',
  entries: 'Invalid entries. Try again.', 
  login: 'All fields must be filled',
  auth: 'Incorrect username or password',  
};

const userObj = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  password: Joi.required(),
});

const insertUser = async (user) => {
  const { email, name } = user;  
  const { error } = userObj.validate(user);
  if (error) throw errorHandler(erro400, errorName.entries);
  const emailCorrect = /^[a-z0-9._]+@[a-z0-9]+\.[a-z]+(\.[a-z]+)?$/i;
  const validateEmail = emailCorrect.test(email);
  if (!validateEmail) throw errorHandler(erro400, errorName.entries);
  const userExist = await findByEmail(email);
  if (userExist !== null) throw errorHandler(erro409, errorName.exists);
  const newUser = await createUser(user);
  return { 
    user: {
      _id: newUser,
      name,
      email, 
      role: 'user',
    },    
  }; 
};

const userlogin = Joi.object({
  email: Joi.required(),
  password: Joi.required(),
});

const jwtConfig = {
  expiresIn: '7d',
  algorithm: 'HS256',
};

const loginUser = async (user) => {
  const { email, password } = user;  
  const { error } = userlogin.validate(user);
  if (error) throw errorHandler(erro401, errorName.login);
  const userExist = await findByEmail(email);
  if (!userExist) throw errorHandler(erro401, errorName.auth);
  if (userExist.password !== password) throw errorHandler(erro401, errorName.auth);
  const token = jwt.sign({ data: user.email }, secret, jwtConfig);
  return { token }; 
};

module.exports = {
  insertUser,
  loginUser,  
};
