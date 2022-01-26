const { insertUser, loginUser } = require('../services/usersService');

const created = 201;
const success = 200;

const insertOne = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;  
    const user = { name, email, password };
    const newUser = await insertUser(user);
    return res.status(created).json(newUser);
  } catch (err) {    
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;  
    const user = { email, password };
    const token = await loginUser(user);
    return res.status(success).json(token);
  } catch (err) {    
    return next(err);
  }
};

module.exports = {
  insertOne,
  login,
};