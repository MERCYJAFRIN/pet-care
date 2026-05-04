const { Product } = require('../models');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured } = req.query;
    let where = {};
    if (category) where.category = category;
    if (featured === 'true') where.isFeatured = true;

    const products = await Product.findAll({ where });
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
};

// Get product by id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err.message });
  }
};

// Create product (Admin only logic can be added later)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: 'Error creating product', error: err.message });
  }
};

// Seed initial products if none exist
exports.seedProducts = async (req, res) => {
  try {
    // Clear existing products to ensure a fresh, professional slate
    await Product.destroy({ where: {}, truncate: true });

    const initialProducts = [
      {
        name: 'Royal Canin Adult Dry Food',
        description: 'Tailored nutrition for adult dogs to maintain health and vitality. Contains essential antioxidants.',
        price: 2499.00,
        category: 'Food',
        stock: 50,
        imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800', // Professional dog food
        isFeatured: true,
        rating: 4.8
      },
      {
        name: 'Grain-Free Salmon Cat Food',
        description: 'High-protein, grain-free formula with real salmon for a shiny coat and digestive health.',
        price: 1850.00,
        category: 'Food',
        stock: 40,
        imageUrl: 'https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?w=800', // Professional cat food
        isFeatured: false,
        rating: 4.7
      },
      {
        name: 'Interactive Kong Classic Toy',
        description: 'Durable natural rubber toy that satisfies instinctual needs and provides mental stimulation.',
        price: 899.00,
        category: 'Toys',
        stock: 100,
        imageUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=800', // Dog with toy
        isFeatured: true,
        rating: 4.9
      },
      {
        name: 'Automatic Laser Cat Toy',
        description: 'Hands-free laser toy that keeps your cat active and entertained for hours.',
        price: 1250.00,
        category: 'Toys',
        stock: 25,
        imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800', // Active cat
        isFeatured: false,
        rating: 4.5
      },
      {
        name: 'Orthopedic Memory Foam Bed',
        description: 'Ultra-soft bed with memory foam for joint support and maximum comfort during sleep.',
        price: 4999.00,
        category: 'Accessories',
        stock: 15,
        imageUrl: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?w=800', // Pet bed
        isFeatured: true,
        rating: 5.0
      },
      {
        name: 'Luxury Leather Collar',
        description: 'Handcrafted genuine leather collar for a sophisticated and durable pet accessory.',
        price: 1599.00,
        category: 'Accessories',
        stock: 30,
        imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800', // Leather collar
        isFeatured: false,
        rating: 4.6
      },
      {
        name: 'Pet Health & Wellness Kit',
        description: 'Essential vitamins, minerals, and grooming tools to support your pet\'s complete wellbeing.',
        price: 2750.00,
        category: 'Health',
        stock: 60,
        imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800', // Health kit
        isFeatured: true,
        rating: 4.7
      },
      {
        name: 'Organic Pet Shampoo',
        description: 'Gentle, pH-balanced oatmeal shampoo for sensitive skin and a fresh coat.',
        price: 550.00,
        category: 'Grooming',
        stock: 45,
        imageUrl: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=800', // Pet being bathed
        isFeatured: false,
        rating: 4.4
      }
    ];

    await Product.bulkCreate(initialProducts);
    res.json({ message: 'Successfully seeded marketplace products!' });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
};
