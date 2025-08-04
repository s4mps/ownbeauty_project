const mysql = require('mysql2/promise');

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'sampana2006_',
    database: process.env.DB_NAME || 'ownbeauty_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const checkAndAddProducts = async () => {
    const connection = await mysql.createConnection(config);

    try {
        console.log('🔍 Checking products in database...');

        // Check if products table exists and has data
        const [products] = await connection.execute('SELECT COUNT(*) as count FROM products');
        console.log(`📦 Found ${products[0].count} products in database`);

        if (products[0].count === 0) {
            console.log('➕ No products found, adding sample products...');

            const sampleProducts = [
                {
                    name: 'Natural Face Cream',
                    description: 'Hydrating face cream with natural ingredients',
                    price: 29.99,
                    category: 'skincare',
                    stock: 50,
                    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
                    rating: 4.5,
                    rating_count: 12
                },
                {
                    name: 'Organic Lip Balm',
                    description: 'Moisturizing lip balm with organic beeswax',
                    price: 8.99,
                    category: 'skincare',
                    stock: 100,
                    image_url: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400',
                    rating: 4.2,
                    rating_count: 8
                },
                {
                    name: 'Anti-Aging Serum',
                    description: 'Advanced anti-aging serum with vitamin C',
                    price: 45.99,
                    category: 'skincare',
                    stock: 25,
                    image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
                    rating: 4.8,
                    rating_count: 15
                },
                {
                    name: 'Gentle Cleanser',
                    description: 'Daily gentle facial cleanser for all skin types',
                    price: 18.99,
                    category: 'skincare',
                    stock: 75,
                    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
                    rating: 4.3,
                    rating_count: 20
                },
                {
                    name: 'Sunscreen SPF 50',
                    description: 'Broad spectrum sunscreen for daily protection',
                    price: 22.99,
                    category: 'skincare',
                    stock: 60,
                    image_url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
                    rating: 4.6,
                    rating_count: 18
                }
            ];

            for (const product of sampleProducts) {
                await connection.execute(`
          INSERT INTO products (name, description, price, category, stock, image_url, rating, rating_count) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [product.name, product.description, product.price, product.category, product.stock, product.image_url, product.rating, product.rating_count]);
            }

            console.log('✅ Added 5 sample products to database');
        } else {
            console.log('✅ Products already exist in database');
        }

        // Show all products
        const [allProducts] = await connection.execute('SELECT id, name, price, stock, category FROM products LIMIT 10');
        console.log('\n📋 Current products:');
        allProducts.forEach(product => {
            console.log(`  - ${product.name} ($${product.price}) - Stock: ${product.stock} - Category: ${product.category}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await connection.end();
    }
};

checkAndAddProducts(); 