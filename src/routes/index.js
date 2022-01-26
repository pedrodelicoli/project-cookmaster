const express = require('express');

const { insertOne, login } = require('../controllers/usersController');
const { 
    createOne, 
    listRecipes, 
    recipeById, 
    updateById,
    deleteById,
    upload,
    getImage,
} = require('../controllers/recipesController');
const { auth } = require('../middlewares/auth');
const uploadMiddleware = require('../middlewares/upload');

const router = express.Router();

router.post('/users', insertOne);
router.post('/login', login);
router.post('/recipes', auth, createOne);
router.get('/recipes', listRecipes);
router.get('/recipes', auth, listRecipes);
router.get('/recipes/:id', recipeById);
router.get('/recipes/:id', auth, recipeById);
router.put('/recipes/:id', auth, updateById);
router.delete('/recipes/:id', auth, deleteById);
router.put('/recipes/:id/image', uploadMiddleware.single('image'), auth, upload);
router.get('/images/:id', getImage);

module.exports = router; 