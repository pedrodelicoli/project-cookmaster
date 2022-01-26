const fs = require('fs');

const { 
  insertRecipe,
  findAll,
  findById,
  updateId,
  deleteId,
  uploadImage,
} = require('../services/recipesService');

const created = 201;
const success = 200;
const nocontent = 204;

const createOne = async (req, res, next) => {
    try {
      const { name, ingredients, preparation } = req.body;  
      const id = req.userId;
      const recipe = { name, ingredients, preparation };
      const newRecipe = await insertRecipe(recipe, id);
      return res.status(created).json(newRecipe);
    } catch (err) {    
      return next(err);
    }
  };

const listRecipes = async (_req, res, next) => {
    try {
      const recipes = await findAll();
      return res.status(success).send(recipes);
    } catch (err) {
      next(err);
    }  
};

const recipeById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const findRecipe = await findById(id);
      return res.status(success).send(findRecipe);    
    } catch (err) {
      next(err);
    }    
};   

const updateById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, ingredients, preparation } = req.body;
      const recipe = { name, ingredients, preparation }; 
      const { userId, role } = req;
      const user = { userId, role };
      const updateRecipe = await updateId(recipe, id, user);
      return res.status(success).send(updateRecipe);    
    } catch (err) {
      next(err);
    }    
};  

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role } = req;
    const user = { userId, role };
    await deleteId(id, user);
    return res.status(nocontent).send();    
  } catch (err) {
    next(err);
  }    
};  

const upload = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role, file } = req;
    const imagePath = `localhost:3000/src/uploads/${file.filename}`;
    const user = { userId, role };
    const uploaded = await uploadImage(imagePath, id, user);
    return res.status(success).send(uploaded);    
  } catch (err) {
    next(err);
  }    
};  

const getImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    fs.readFile(`../uploads/${id}`, (_err, data) => {
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.send(data);
    }); 
  } catch (err) {
    next(err);
  }    
}; 

module.exports = {
    createOne,
    listRecipes, 
    recipeById, 
    updateById, 
    deleteById, 
    upload,
    getImage,
};