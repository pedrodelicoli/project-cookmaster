/* const { ObjectId } = require('mongodb'); */
const { connection } = require('./connection');

const createUser = async (user) => {
  const conn = await connection();
  const { insertedId } = await conn.collection('users').insertOne(user);   
  return insertedId;     
};
const findByEmail = async (data) => {
  const conn = await connection();
  const user = await conn.collection('users').findOne({
    email: data,
  });   
  return user;     
};

module.exports = { createUser, findByEmail };