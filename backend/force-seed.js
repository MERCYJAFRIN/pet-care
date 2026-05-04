const { Product } = require('./src/models');
const { sequelize } = require('./src/models');

async function seed() {
    console.log('--- STARTING MANUAL SEED ---');
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        await Product.destroy({ where: {}, truncate: true });
        console.log('Marketplace cleared.');

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
                imageUrl: 'https://images.unsplash.com/photo-1585059895524-72359e061880?w=800', // Premium cat food
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
                imageUrl: 'https://images.unsplash.com/photo-1629813203102-132d7515c1e5?w=800', // Leather collar
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
        console.log('Seeding successful!');

        // Also fix zeek role while we are at it
        const [results] = await sequelize.query("UPDATE users SET role = 'doctor', is_verified = 1 WHERE email = 'zeek@gmail.com'");
        console.log('Role update results:', JSON.stringify(results));

    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        process.exit(0);
    }
}

seed();
