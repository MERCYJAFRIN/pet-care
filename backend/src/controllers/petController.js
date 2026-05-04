const { Pet } = require('../models');

exports.createPet = async (req, res) => {
  try {
    const { name, type, breed, age, weight, color, dateOfBirth, medicalNotes, vaccinated, neutered } = req.body;

    console.log('📥 Creating pet with data:', { name, type, breed, age, weight, color, dateOfBirth, medicalNotes, vaccinated, neutered });
    console.log('🔐 User ID from middleware:', req.userId);
    console.log('🔐 User object:', req.user);

    // Validation
    if (!name) {
      console.warn('⚠️ Pet name is missing');
      return res.status(400).json({ message: 'Pet name is required' });
    }
    if (!type) {
      console.warn('⚠️ Pet type is missing');
      return res.status(400).json({ message: 'Pet type is required' });
    }
    
    // Validate pet type
    const validTypes = ['dog', 'cat', 'bird', 'rabbit', 'other'];
    const normalizedType = type.toLowerCase();
    if (!validTypes.includes(normalizedType)) {
      console.warn('⚠️ Invalid pet type:', type);
      return res.status(400).json({ 
        message: `Invalid pet type. Must be one of: ${validTypes.join(', ')}`,
        receivedType: type,
        validTypes: validTypes
      });
    }
    
    if (!req.userId) {
      console.error('❌ No userId in request! User object:', req.user);
      return res.status(401).json({ message: 'User not authenticated - missing userId' });
    }

    console.log('✅ Validation passed. Creating pet record...');

    const pet = await Pet.create({
      userId: req.userId,
      name: name.trim(),
      type: normalizedType,
      breed: breed || null,
      age: age ? parseInt(age) : null,
      weight: weight ? parseFloat(weight) : null,
      color: color || null,
      dateOfBirth: dateOfBirth || null,
      medicalNotes: medicalNotes || null,
      vaccinated: vaccinated === true || vaccinated === 'true',
      neutered: neutered === true || neutered === 'true',
    });

    console.log('✅ Pet created successfully:', pet);

    res.status(201).json({
      message: 'Pet created successfully',
      pet,
    });
  } catch (error) {
    console.error('❌ Error creating pet:', error);
    console.error('❌ Error details:', {
      message: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });
    res.status(500).json({ 
      message: 'Error creating pet', 
      error: error.message,
      errorName: error.name,
      details: error.errors ? error.errors.map(e => e.message) : error.message
    });
  }
};

exports.getPets = async (req, res) => {
  try {
    const pets = await Pet.findAll({ where: { userId: req.userId } });

    res.json({
      pets,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pets', error: error.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await Pet.findOne({
      where: { id: petId, userId: req.userId },
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({ pet });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pet', error: error.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const { petId } = req.params;
    const { name, breed, age, weight, color, medicalNotes, vaccinated, neutered } = req.body;

    const pet = await Pet.findOne({
      where: { id: petId, userId: req.userId },
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await pet.update({
      name,
      breed,
      age,
      weight,
      color,
      medicalNotes,
      vaccinated,
      neutered,
    });

    res.json({
      message: 'Pet updated successfully',
      pet,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating pet', error: error.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const { petId } = req.params;

    const pet = await Pet.findOne({
      where: { id: petId, userId: req.userId },
    });

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    await pet.destroy();

    res.json({
      message: 'Pet deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pet', error: error.message });
  }
};
