const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const authMiddleware = require('../middleware/authMiddleware');

// All pet routes are protected
router.use(authMiddleware);

router.post('/', petController.createPet);
router.get('/', petController.getPets);
router.get('/:petId', petController.getPetById);
router.put('/:petId', petController.updatePet);
router.delete('/:petId', petController.deletePet);

module.exports = router;
