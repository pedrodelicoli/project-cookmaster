const Joi = require('joi');
const { 
  createRecipe,
  listRecipes,
  findId,
  updateRecipe,
  deleteRecipe,
  uploadImg,
} = require('../models/recipesModel');
const { errorHandler } = require('../utils/errorhandler');

const erro400 = 400;
const erro404 = 404;

const errorName = {
  entries: 'Invalid entries. Try again.', 
  token: 'jwt malformed',
  notfound: 'recipe not found',
};

const recipeObj = Joi.object({
    name: Joi.required(),
    ingredients: Joi.required(),
    preparation: Joi.required(),
  });

const insertRecipe = async (recipe, id) => {
    const { error } = recipeObj.validate(recipe);
    if (error) throw errorHandler(erro400, errorName.entries);    
    const newRecipe = {
      ...recipe,
      userId: id,
    };
    const recipeId = await createRecipe(newRecipe);
    return { 
      recipe: {
        _id: recipeId,
        ...newRecipe,
      },  
    };    
  };

const findAll = async () => {
  const recipeslist = await listRecipes();
  return recipeslist;
};

const findById = async (id) => {
  const recipeFound = await findId(id);
  if (!recipeFound) throw errorHandler(erro404, errorName.notfound);
  return recipeFound;
};

const updateId = async (recipe, id, user) => {
  const { error } = recipeObj.validate(recipe);
  if (error) throw errorHandler(erro400, errorName.entries);
  if (user.role === 'admin') {
    await updateRecipe(recipe, id);
    const updated = await findId(id);
    return updated;
  }
  const { userId } = await findId(id);
  if (userId.toString() === user.userId.toString()) {
    await updateRecipe(recipe, id);
    const updated = await findId(id);
    return updated; 
  }     
};

const deleteId = async (id, user) => {
  if (user.role === 'admin') {
    return deleteRecipe(id);   
  }
  const { userId } = await findId(id);    
  if (userId.toString() === user.userId.toString()) {
    await deleteRecipe(id);      
  }     
};
  
const uploadImage = async (imagePath, id, user) => {
  if (user.role === 'admin') {
    await uploadImg(imagePath, id);
    const updated = await findId(id);
    return updated;
  }
  const { userId } = await findId(id);
  if (userId.toString() === user.userId.toString()) {
    await uploadImg(imagePath, id);
    const updated = await findId(id);
    return updated; 
  }     
};

module.exports = { insertRecipe, findAll, findById, updateId, deleteId, uploadImage };  