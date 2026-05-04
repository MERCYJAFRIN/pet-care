const { sequelize, User, DoctorProfile, Product, Pet } = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    console.log('--- PROFESSIONAL SEEDING STARTED ---');
    try {
        // Sync database (resetting for clean state)
        await sequelize.sync({ force: true });
        console.log('✓ Database reset and synced.');

        // 1. Create a Default Admin/Doctor User
        const hashedPassword = await bcrypt.hash('password123', 10);
        const adminUser = await User.create({
            id: uuidv4(),
            firstName: 'Dr. Sarah',
            lastName: 'Wilson',
            email: 'sarah.wilson@petcare.com',
            password: hashedPassword,
            role: 'doctor',
            isVerified: true,
            phone: '+1 234 567 8900'
        });
        console.log('✓ Admin/Doctor user created.');

        // 2. Create Doctor Profile
        await DoctorProfile.create({
            userId: adminUser.id,
            specialization: 'General Veterinary, Surgery',
            experience: 12,
            clinicName: 'Elite Paws Veterinary Clinic',
            clinicAddress: '123 Pet Lane, Health City',
            licenseNumber: 'VET-99234',
            bio: 'Dedicated to providing the best care for your furry friends. Specialist in small animal surgery and general wellness.',
            consultationFee: 750.00,
            rating: 4.9,
            availableDays: 'Mon,Tue,Wed,Thu,Fri',
            availableTime: '09:00 AM - 06:00 PM',
            isVerified: true
        });

        // Add more doctors
        const doc2User = await User.create({
            id: uuidv4(),
            firstName: 'Dr. James',
            lastName: 'Miller',
            email: 'james.miller@petcare.com',
            password: hashedPassword,
            role: 'doctor',
            isVerified: true
        });

        await DoctorProfile.create({
            userId: doc2User.id,
            specialization: 'Avian & Exotic Pets',
            experience: 8,
            clinicName: 'Exotic Friends Clinic',
            clinicAddress: '456 Wing Way, Sky Town',
            licenseNumber: 'VET-88321',
            bio: 'Expert in birds and exotic mammals. Passionate about avian health.',
            consultationFee: 900.00,
            rating: 4.7,
            availableDays: 'Mon,Wed,Fri',
            availableTime: '10:00 AM - 04:00 PM',
            isVerified: true
        });
        console.log('✓ Professional doctor profiles created.');

        // 3. Seed Marketplace Products
        const products = [
            {
                name: 'Premium Adult Dog Food',
                description: 'Nutrient-rich dry food for adult dogs with real chicken.',
                price: 2999.00,
                category: 'Food',
                stock: 50,
                imageUrl: 'https://images.unsplash.com/photo-1568640347023-a616a311350a?w=800',
                isFeatured: true,
                rating: 4.8
            },
            {
                name: 'Interactive Cat Laser Toy',
                description: 'Automatic 360-degree laser toy for cats.',
                price: 1250.00,
                category: 'Toys',
                stock: 30,
                imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800',
                isFeatured: true,
                rating: 4.5
            },
            {
                name: 'Orthopedic Pet Bed',
                description: 'Memory foam bed for senior pets or joint support.',
                price: 4500.00,
                category: 'Accessories',
                stock: 15,
                imageUrl: 'https://images.unsplash.com/photo-1629813203102-132d7515c1e5?w=800',
                isFeatured: true,
                rating: 5.0
            },
            {
                name: 'Pet First Aid Kit',
                description: 'Essential medical supplies for pet emergencies.',
                price: 1800.00,
                category: 'Health',
                stock: 20,
                imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
                isFeatured: false,
                rating: 4.9
            }
        ];

        await Product.bulkCreate(products);
        console.log('✓ Marketplace seeded with professional products.');

        console.log('--- SEEDING COMPLETE ---');
    } catch (err) {
        console.error('✗ Seeding FAILED:', err);
    } finally {
        process.exit(0);
    }
}

seed();
