const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getFeatured, getCategories } = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', adminAuth, createProduct);
router.put('/:id', adminAuth, updateProduct);
router.delete('/:id', adminAuth, deleteProduct);

module.exports = router;
