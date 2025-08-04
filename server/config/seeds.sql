-- Sample data for products
USE ownbeauty_db;

-- Insert sample products
INSERT INTO products (name, description, price, category, stock, image_url, rating, rating_count) VALUES
('Hydrating Face Serum', 'A powerful hydrating serum with hyaluronic acid and vitamin E for plump, radiant skin.', 29.99, 'Skincare', 50, 'https://moonstarsworld.in/cdn/shop/files/83.jpg?v=1721285604', 4.5, 125),
('Volumizing Mascara', 'Get dramatic, voluminous lashes with this long-lasting, clump-free mascara.', 19.99, 'Makeup', 75, 'https://static-01.daraz.com.np/p/d915bd14ec96a44ed394ad55a0188fc1.jpg', 4.2, 89),
('Matte Liquid Lipstick', 'Full-coverage, long-wearing liquid lipstick in a beautiful matte finish.', 15.99, 'Makeup', 60, 'https://img.drz.lazcdn.com/static/np/p/97e7e5d7856938c634e4c42a5f2202d8.png_720x720q80.png', 4.7, 203),
('Anti-Aging Night Cream', 'Rich, nourishing night cream with retinol and peptides to reduce fine lines.', 39.99, 'Skincare', 35, 'https://images.ctfassets.net/0v2sa6e8k7dp/2z4OGDyZw3I6gF2VvycvLh/2541e747595298f90d18dbf091e6875f/01_Olay_TotalEffects_20gm_82247774_AntiAgeingNightCream_GROUPANGLE_INDIA_0308.jpg?fm=webp&q=75', 4.6, 156),
('Setting Powder', 'Translucent setting powder for a smooth, shine-free finish that lasts all day.', 24.99, 'Makeup', 45, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBN1ANgvKJ1QchHYHrXIlorNPXEmb3ARgKvg&s', 4.3, 92),
('Vitamin C Brightening Serum', 'Brighten and even skin tone with this potent vitamin C serum.', 34.99, 'Skincare', 40, 'https://www.farmers.co.nz/INTERSHOP/static/WFS/Farmers-Shop-Site/-/Farmers-Shop/en_NZ/product/67/23/573/6723573_00_W500_H652.jpg?lastmodified=202202252211046', 4.8, 267),
('Eyeshadow Palette', '12-shade eyeshadow palette with both matte and shimmer finishes.', 27.99, 'Makeup', 30, 'https://images-cdn.ubuy.co.id/633fec74a00c490f7a2aed75-matte-and-shimmer-eyeshadow-palette.jpg', 4.4, 178),
('Gentle Cleansing Foam', 'Mild, sulfate-free cleanser that removes makeup without stripping skin.', 18.99, 'Skincare', 80, 'https://www.goryeobeauty.com/cdn/shop/products/sulwhasoo-gentle-cleansing-foam4_1024x.jpg?v=1590139004', 4.1, 134),
('Cream Blush', 'Buildable cream blush for a natural, healthy glow.', 21.99, 'Makeup', 55, 'https://prettyclickcosmetics.com/cdn/shop/files/54eb1e12562852484cfaebe89363a353ce202429_1710780326_all-products-33007426.webp?v=1745930302', 4.5, 87),
('SPF 30 Moisturizer', 'Daily moisturizer with broad-spectrum SPF 30 protection.', 25.99, 'Skincare', 65, 'https://i5.walmartimages.com/seo/CeraVe-AM-Face-Moisturizer-with-Broad-Spectrum-Protection-SPF-30-3-oz_81519f31-a5ad-4ea1-a410-a314051da6f8.4bd22c7780217823517255e8ae603dc0.jpeg', 4.3, 145);

-- Insert a test user (password is 'password123' hashed)
INSERT INTO users (email, password, first_name, last_name, role) VALUES
('demo@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj8NqKzfLjNO', 'Demo', 'User', 'user');

