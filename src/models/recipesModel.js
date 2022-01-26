const { ObjectId } = require('mongodb');
const { connection } = require('./connection');

const createRecipe = async (recipe) => {
    const conn = await connection();
    const { insertedId } = await conn.collection('recipes').insertOne(recipe);   
    return insertedId;   
};  

const listRecipes = async () => connection().then((db) => db.collection('recipes').find().toArray())
.then((recipes) =>
    recipes.map(({ _id, name, ingredients, preparation, userId }) =>
      ({
         _id,
         name,
         ingredients,
         preparation,
         userId,            
       })));

const findId = async (id) => {
  if (ObjectId.isValid(id)) {
    const conn = await connection();
    const query = await conn.collection('recipes').findOne(ObjectId(id));  
    return query;
  }
  return null;
};    

const updateRecipe = async (recipe, id) => {
    const conn = await connection();
    const updated = await conn.collection('recipes').updateOne(
        { _id: ObjectId(id) },
        { $set: { 
          name: recipe.name,
          ingredients: recipe.ingredients,
          preparation: recipe.preparation } },
    ); 
    return updated;  
  }; 

  const deleteRecipe = async (id) => {
    const conn = await connection();
    const updated = await conn.collection('recipes').deleteOne(
        { _id: ObjectId(id) },   
    ); 
    return updated;  
  }; 

  const uploadImg = async (imagePath, id) => {
    const conn = await connection();
    const updated = await conn.collection('recipes').updateOne(
        { _id: ObjectId(id) },
        { $set: { 
          image: imagePath,
          },
        },
    ); 
    return updated;  
  }; 

module.exports = { createRecipe, listRecipes, findId, updateRecipe, deleteRecipe, uploadImg };  