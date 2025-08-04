-- Update existing orders table to add missing columns
USE ownbeauty_db;

-- Add missing columns to orders table
ALTER TABLE orders 
ADD COLUMN subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER total_amount,
ADD COLUMN tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER subtotal,
ADD COLUMN shipping_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER tax_amount,
ADD COLUMN payment_method VARCHAR(50) AFTER shipping_address,
ADD COLUMN notes TEXT AFTER payment_method;

-- Add missing column to order_items table
ALTER TABLE order_items 
ADD COLUMN price_at_time DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER price;

-- Update existing orders to have proper values
UPDATE orders SET 
subtotal = total_amount * 0.9091, -- Assuming 10% tax
tax_amount = total_amount * 0.0909,
shipping_amount = CASE WHEN total_amount > 50 THEN 0 ELSE 5.99 END
WHERE subtotal = 0;

-- Update existing order_items to have price_at_time
UPDATE order_items SET price_at_time = price WHERE price_at_time = 0; 
