const { Product, User } = require('./src/models');
const { sequelize } = require('./src/models');

async function fix() {
    console.log('--- STARTING IMAGE & ROLE FIX ---');
    try {
        await sequelize.authenticate();

        // 1. Force Zeek to be Doctor
        const [userUpdate] = await sequelize.query("UPDATE users SET role = 'doctor', is_verified = 1 WHERE email = 'zeek@gmail.com'");
        console.log('User Role Update:', JSON.stringify(userUpdate));

        // 2. Clear and Re-seed Marketplace with RELIABLE URLs
        await Product.destroy({ where: {}, truncate: true });

        const products = [
            {
                name: 'Royal Canin Adult Dry Food',
                description: 'Tailored nutrition for adult dogs to maintain health and vitality.',
                price: 2499.00,
                category: 'Food',
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a311350a?w=800',
                isFeatured: true,
                rating: 4.8
            },
            {
                name: 'Grain-Free Salmon Cat Food',
                description: 'High-protein formula with real salmon for a shiny coat.',
                price: 1850.00,
                category: 'Food',
                stock: 40,
                imageUrl: 'https://images.unsplash.com/photo-1548810930-e66aa9024564?w=800',
                isFeatured: false,
                rating: 4.7
            },
            {
                name: 'Interactive Kong Classic Toy',
                description: 'Durable rubber toy for mental stimulation.',
                price: 899.00,
                category: 'Toys',
                stock: 100,
                imageUrl: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800',
                isFeatured: true,
                rating: 4.9
            },
            {
                name: 'Automatic Laser Cat Toy',
                description: 'Hands-free laser toy to keep your cat active.',
                price: 1250.00,
                category: 'Toys',
                stock: 25,
                imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
                isFeatured: false,
                rating: 4.5
            },
            {
                name: 'Orthopedic Memory Foam Bed',
                description: 'Supportive bed for maximum comfort.',
                price: 4999.00,
                category: 'Accessories',
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1629813203102-132d7515c1e5?w=800',
                isFeatured: true,
                rating: 5.0
            },
            {
                name: 'Luxury Leather Collar',
                description: 'Handcrafted genuine leather collar.',
                price: 1599.00,
                category: 'Accessories',
                stock: 30,
                imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800',
                isFeatured: false,
                rating: 4.6
            },
            {
                name: 'Pet Health & Wellness Kit',
                description: 'Complete health support kit.',
                price: 2750.00,
                category: 'Health',
                stock: 60,
                imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
                isFeatured: true,
                rating: 4.7
            },
            {
                name: 'Organic Pet Shampoo',
                description: 'Gentle oatmeal shampoo for sensitive skin.',
                price: 550.00,
                category: 'Grooming',
                stock: 45,
                imageUrl: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?w=800',
                isFeatured: false,
                rating: 4.4
            }
        ];

        await Product.bulkCreate(products);
        console.log('Seeding successful!');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit(0);
    }
}

fix();
