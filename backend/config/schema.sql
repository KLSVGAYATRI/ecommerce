-- E-Commerce Database Schema
-- Run this file to set up the database: psql -U postgres -d ecommerce_db -f schema.sql

CREATE DATABASE ecommerce_db;
\c ecommerce_db;

CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'upi', 'cash_on_delivery');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user',
  phone VARCHAR(20),
  address TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  stock INTEGER DEFAULT 0,
  image_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  amount DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  product_id INTEGER REFERENCES products(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE wishlist (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_user_id ON carts(user_id);

-- Sample Data
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@shop.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Doe', 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

INSERT INTO products (name, description, price, category, stock, image_url, rating, review_count, is_featured) VALUES
('Premium Wireless Headphones', 'High-quality noise-cancelling wireless headphones with 30-hour battery life', 299.99, 'Electronics', 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 4.8, 124, true),
('Minimalist Watch', 'Elegant stainless steel watch with sapphire crystal glass', 189.99, 'Accessories', 30, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', 4.6, 89, true),
('Running Sneakers', 'Lightweight performance running shoes with advanced cushioning', 129.99, 'Footwear', 75, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 4.7, 210, true),
('Leather Backpack', 'Premium genuine leather backpack with laptop compartment', 149.99, 'Bags', 40, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 4.5, 67, false),
('Sunglasses', 'UV400 polarized sunglasses with titanium frame', 89.99, 'Accessories', 60, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500', 4.4, 45, false),
('Smart Fitness Band', 'Track your health metrics with heart rate and sleep monitoring', 79.99, 'Electronics', 100, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', 4.3, 156, true),
('Ceramic Coffee Mug', 'Handcrafted ceramic mug with double-wall insulation', 34.99, 'Home', 200, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500', 4.6, 78, false),
('Yoga Mat', 'Non-slip eco-friendly yoga mat with alignment lines', 59.99, 'Sports', 80, 'https://images.unsplash.com/photo-1601925228000-9e0d8291d8e6?w=500', 4.7, 93, false),
('Portable Charger', '20000mAh fast charging power bank with USB-C', 49.99, 'Electronics', 120, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 4.5, 201, false),
('Desk Lamp', 'LED desk lamp with wireless charging pad and touch control', 69.99, 'Home', 45, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 4.4, 54, false),
('Canvas Sneakers', 'Classic canvas sneakers available in multiple colors', 69.99, 'Footwear', 90, 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500', 4.3, 167, false),
('Bluetooth Speaker', 'Waterproof portable speaker with 360-degree sound', 119.99, 'Electronics', 55, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500', 4.6, 112, true);

-- 100 Additional Products across diverse categories
INSERT INTO products (name, description, price, category, stock, image_url, rating, review_count, is_featured) VALUES

-- Electronics (14 more)
('4K Ultra HD Smart TV 55"', 'OLED 4K display with HDR10+, Dolby Atmos and built-in streaming apps', 899.99, 'Electronics', 25, 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500', 4.7, 342, true),
('Mechanical Gaming Keyboard', 'RGB backlit mechanical keyboard with Cherry MX switches and wrist rest', 149.99, 'Electronics', 60, 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500', 4.6, 218, false),
('Wireless Gaming Mouse', 'Ergonomic wireless mouse with 25600 DPI sensor and 70-hour battery', 89.99, 'Electronics', 80, 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500', 4.5, 175, false),
('Laptop Stand Aluminium', 'Adjustable aluminium laptop stand with heat dissipation design', 49.99, 'Electronics', 150, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', 4.4, 89, false),
('Noise Cancelling Earbuds', 'True wireless earbuds with active noise cancellation and 36-hour total battery', 199.99, 'Electronics', 70, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 4.8, 512, true),
('USB-C Hub 7-in-1', 'Multiport USB-C hub with HDMI 4K, SD card reader, USB 3.0 ports', 59.99, 'Electronics', 200, 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=500', 4.3, 134, false),
('Smart Home Hub', 'Central smart home controller compatible with Alexa, Google Home and HomeKit', 129.99, 'Electronics', 40, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4.5, 98, false),
('Mirrorless Camera Kit', 'APS-C mirrorless camera with 18-55mm kit lens and 24.2MP sensor', 1299.99, 'Electronics', 15, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', 4.9, 267, true),
('Tablet 10.9 inch', '2K display tablet with stylus support, 256GB storage and all-day battery', 549.99, 'Electronics', 30, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 4.7, 189, true),
('Smart Doorbell Camera', 'HD video doorbell with motion detection, two-way audio and night vision', 179.99, 'Electronics', 55, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4.4, 156, false),
('Wireless Charging Pad', 'Fast 15W Qi wireless charger compatible with all Qi-enabled devices', 39.99, 'Electronics', 300, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500', 4.2, 445, false),
('VR Headset', 'Standalone virtual reality headset with 6DOF tracking and 128GB storage', 399.99, 'Electronics', 20, 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500', 4.6, 201, true),
('Dashcam 4K', 'Front and rear 4K dashcam with GPS, night vision and parking mode', 129.99, 'Electronics', 65, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4.3, 87, false),
('Electric Toothbrush', 'Sonic electric toothbrush with 5 modes, UV sanitizer and 3-month battery', 79.99, 'Electronics', 110, 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=500', 4.7, 334, false),

-- Fashion / Clothing (12)
('Classic White Oxford Shirt', 'Premium 100% Egyptian cotton Oxford shirt with mother-of-pearl buttons', 79.99, 'Clothing', 120, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 4.5, 156, false),
('Slim Fit Chinos', 'Stretch cotton chinos with modern slim fit and wrinkle-resistant finish', 69.99, 'Clothing', 90, 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500', 4.4, 203, false),
('Cashmere Sweater', '100% pure Mongolian cashmere crewneck sweater in 8 classic colours', 189.99, 'Clothing', 45, 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', 4.8, 312, true),
('Merino Wool Hoodie', 'Lightweight merino wool zip-up hoodie — temperature regulating and odour-resistant', 139.99, 'Clothing', 60, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=500', 4.6, 178, false),
('Linen Blazer', 'Unstructured summer linen blazer perfect for smart-casual occasions', 159.99, 'Clothing', 35, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500', 4.5, 91, true),
('Athletic Performance Shorts', 'Quick-dry 4-way stretch shorts with zip pocket and liner', 44.99, 'Clothing', 180, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500', 4.3, 267, false),
('Wool Peacoat', 'Double-breasted 80% wool peacoat with notch lapel and anchor buttons', 249.99, 'Clothing', 25, 'https://images.unsplash.com/photo-1539533018257-1b52f3dc0dfe?w=500', 4.7, 134, true),
('Slim Denim Jeans', 'Premium Japanese selvedge denim slim-cut jeans with sanforized finish', 119.99, 'Clothing', 100, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 4.6, 389, false),
('Silk Tie', 'Hand-rolled 100% silk jacquard tie with matching pocket square', 59.99, 'Clothing', 200, 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=500', 4.5, 78, false),
('Trench Coat', 'Classic double-breasted trench coat in water-resistant cotton gabardine', 299.99, 'Clothing', 20, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500', 4.8, 145, true),
('Graphic Tee', 'Premium 100% organic cotton graphic tee with artwork print', 34.99, 'Clothing', 250, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 4.2, 512, false),
('Compression Leggings', 'High-waist compression leggings with phone pocket and seamless waistband', 54.99, 'Clothing', 140, 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500', 4.6, 421, false),

-- Footwear (8 more)
('Leather Oxford Shoes', 'Goodyear-welted full-grain leather Oxford shoes with leather sole', 249.99, 'Footwear', 30, 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500', 4.8, 156, true),
('Chelsea Boots', 'Side-elastic Chelsea boots in pull-up leather with rubber sole', 199.99, 'Footwear', 40, 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500', 4.7, 213, true),
('Slip-On Loafers', 'Penny loafers in supple calfskin with leather-lined interior', 169.99, 'Footwear', 55, 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500', 4.5, 98, false),
('Trail Running Shoes', 'Waterproof trail running shoes with Vibram outsole and rock plate', 159.99, 'Footwear', 65, 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500', 4.6, 287, false),
('Espadrilles', 'Hand-stitched jute-sole espadrilles in premium canvas', 79.99, 'Footwear', 80, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500', 4.3, 134, false),
('Hiking Boots', 'Waterproof Gore-Tex hiking boots with ankle support and Vibram sole', 189.99, 'Footwear', 45, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 4.7, 321, true),
('Sandals', 'Handcrafted genuine leather sandals with cushioned footbed', 89.99, 'Footwear', 100, 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500', 4.4, 167, false),
('Sneaker Boots', 'Chunky sneaker boots with lug sole and premium suede upper', 149.99, 'Footwear', 50, 'https://images.unsplash.com/photo-1520256862855-398228c41684?w=500', 4.5, 201, false),

-- Bags (8 more)
('Briefcase Leather', 'Full-grain leather briefcase with padded 15" laptop compartment', 299.99, 'Bags', 25, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', 4.8, 134, true),
('Canvas Tote Bag', 'Heavy-duty canvas tote with leather handles and interior zip pocket', 59.99, 'Bags', 200, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500', 4.4, 456, false),
('Travel Duffel Bag', 'Weekender duffel in waxed canvas with leather accents and trolley sleeve', 179.99, 'Bags', 35, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 4.6, 189, true),
('Crossbody Bag', 'Compact crossbody in pebbled leather with adjustable strap', 129.99, 'Bags', 60, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', 4.5, 212, false),
('Laptop Bag 15"', 'Slim messenger bag with padded laptop sleeve and organiser pockets', 99.99, 'Bags', 80, 'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500', 4.3, 167, false),
('Gym Duffel', 'Ventilated gym bag with wet/dry separation and shoe compartment', 69.99, 'Bags', 120, 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=500', 4.4, 298, false),
('Passport Wallet', 'RFID-blocking passport holder in full-grain leather', 49.99, 'Bags', 300, 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500', 4.6, 534, false),
('Fanny Pack', 'Adjustable waist pack in recycled nylon with multiple compartments', 44.99, 'Bags', 150, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', 4.2, 321, false),

-- Home & Living (12)
('Linen Duvet Set', '100% stone-washed French linen duvet cover and pillow cases — King size', 189.99, 'Home', 40, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 4.8, 234, true),
('Cast Iron Skillet', 'Pre-seasoned 12" cast iron skillet oven safe to 500°F', 79.99, 'Home', 75, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 4.9, 567, true),
('Scented Candle Set', 'Set of 6 hand-poured soy wax candles with premium fragrance oils', 59.99, 'Home', 180, 'https://images.unsplash.com/photo-1602607544169-cd66ec37f2d7?w=500', 4.6, 389, false),
('Bamboo Cutting Board', 'Extra-large end-grain bamboo cutting board with juice groove', 54.99, 'Home', 120, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 4.7, 312, false),
('French Press Coffee Maker', '34oz borosilicate glass French press with double-wall stainless plunger', 44.99, 'Home', 90, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500', 4.7, 478, true),
('Throw Blanket Merino', 'Chunky-knit merino wool throw blanket — warm and lightweight', 129.99, 'Home', 55, 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500', 4.8, 201, true),
('Ceramic Plant Pot Set', 'Set of 3 hand-painted ceramic pots with bamboo saucers', 49.99, 'Home', 160, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', 4.5, 267, false),
('Essential Oil Diffuser', 'Ultrasonic aroma diffuser with 7 LED mood lights and auto shut-off', 39.99, 'Home', 200, 'https://images.unsplash.com/photo-1601978901716-adcf7d0c0ddf?w=500', 4.4, 412, false),
('Wall Clock Minimalist', 'Solid walnut silent wall clock with matte dial — 30cm diameter', 89.99, 'Home', 45, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', 4.6, 123, false),
('Turkish Bath Towel Set', 'Set of 4 quick-dry Turkish cotton hammam towels — 600GSM', 79.99, 'Home', 100, 'https://images.unsplash.com/photo-1580820267682-426da823b514?w=500', 4.7, 198, false),
('Spice Rack Organiser', 'Rotating bamboo spice rack with 24 labelled glass jars', 69.99, 'Home', 85, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 4.5, 287, false),
('Moroccan Rug 5x8', 'Hand-woven Berber-style wool rug with geometric pattern — 5x8 ft', 349.99, 'Home', 15, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', 4.9, 98, true),

-- Beauty & Skincare (10)
('Vitamin C Serum', 'Clinical-strength 20% Vitamin C serum with hyaluronic acid and niacinamide', 49.99, 'Beauty', 200, 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', 4.7, 623, true),
('Retinol Night Cream', 'Encapsulated retinol 0.5% night cream with peptides and ceramides', 59.99, 'Beauty', 150, 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=500', 4.6, 412, true),
('Gua Sha Stone Set', 'Rose quartz gua sha facial tool with jade roller and storage pouch', 34.99, 'Beauty', 300, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', 4.5, 534, false),
('Micellar Cleansing Water', 'Gentle micellar water with prebiotics — removes waterproof makeup', 24.99, 'Beauty', 400, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 4.4, 789, false),
('Lip Balm Set', 'Set of 5 tinted SPF30 lip balms with shea butter and vitamin E', 29.99, 'Beauty', 500, 'https://images.unsplash.com/photo-1586495777744-4e6232bf2b05?w=500', 4.3, 345, false),
('Jade Face Roller', 'Natural jade facial roller with stainless steel handle and gift box', 27.99, 'Beauty', 250, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', 4.5, 412, false),
('Perfume Unisex 100ml', 'Niche woody-citrus fragrance with oud, bergamot and vetiver', 149.99, 'Beauty', 60, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', 4.8, 234, true),
('SPF50 Sunscreen', 'Lightweight invisible SPF50 PA++++ sunscreen with antioxidant complex', 34.99, 'Beauty', 350, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 4.6, 567, false),
('Makeup Brush Set 12pc', 'Professional 12-piece makeup brush set with vegan bristles and roll pouch', 54.99, 'Beauty', 180, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500', 4.5, 456, false),
('Sheet Mask Bundle 10pk', 'Korean essence-soaked sheet masks — 10 variety pack for hydration, glow and firming', 24.99, 'Beauty', 600, 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500', 4.4, 712, false),

-- Sports & Fitness (10)
('Adjustable Dumbbell Set', 'Space-saving adjustable dumbbell set from 5–52.5 lbs each', 399.99, 'Sports', 20, 'https://images.unsplash.com/photo-1585713181350-b00a0b4c8a2b?w=500', 4.8, 189, true),
('Resistance Bands Kit', '11-piece resistance band set with door anchor, handles and ankle straps', 34.99, 'Sports', 300, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', 4.6, 534, false),
('Jump Rope Speed Cable', 'Ball-bearing speed jump rope with adjustable steel cable and foam handles', 24.99, 'Sports', 400, 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=500', 4.5, 312, false),
('Pull-Up Bar Doorframe', 'Multi-grip pull-up bar — no screws needed, fits 24–36" doorframes', 49.99, 'Sports', 150, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500', 4.4, 267, false),
('Foam Roller Deep Tissue', 'High-density 36" foam roller with textured surface for trigger point therapy', 39.99, 'Sports', 200, 'https://images.unsplash.com/photo-1601925228000-9e0d8291d8e6?w=500', 4.7, 423, false),
('Cycling Helmet', 'MIPS-certified road cycling helmet with 22 aerodynamic vents', 119.99, 'Sports', 45, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4.7, 198, true),
('Tennis Racket Pro', 'Tournament-spec graphite tennis racket — 300g, 100sq in head', 159.99, 'Sports', 35, 'https://images.unsplash.com/photo-1617366838689-3f56bb64b0c5?w=500', 4.6, 145, false),
('Swimming Goggles', 'UV-blocking anti-fog triathlon swim goggles with wide-angle lens', 29.99, 'Sports', 250, 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500', 4.5, 389, false),
('Protein Shaker Bottle', 'Leak-proof 28oz stainless steel shaker with whisk ball and measurement marks', 34.99, 'Sports', 350, 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500', 4.3, 567, false),
('Weightlifting Belt', 'Genuine leather 4" tapered weightlifting belt with double-prong buckle', 69.99, 'Sports', 80, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500', 4.6, 234, false),

-- Books & Stationery (8)
('Leather Journal A5', 'Hand-stitched refillable A5 leather journal with 240 ivory pages', 49.99, 'Stationery', 200, 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?w=500', 4.8, 456, true),
('Fountain Pen Set', 'Brass fountain pen with converter, ink cartridges and leather case', 79.99, 'Stationery', 80, 'https://images.unsplash.com/photo-1587467512961-120760940315?w=500', 4.7, 289, true),
('Desk Organiser Bamboo', 'Modular bamboo desk organiser with 7 compartments', 44.99, 'Stationery', 120, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500', 4.5, 312, false),
('Sticky Notes Bundle', 'Set of 10 pads in assorted sizes and pastel colours — 1000 sheets total', 19.99, 'Stationery', 500, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500', 4.3, 678, false),
('Watercolour Paint Set', 'Professional 48-colour watercolour pan set with two kolinsky brushes', 54.99, 'Stationery', 90, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500', 4.7, 234, false),
('Planner 2025 Hardcover', 'Weekly planner with goal tracker, habit builder and monthly reviews', 34.99, 'Stationery', 300, 'https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?w=500', 4.6, 512, false),
('Gel Pen Set 36 Colors', 'Vibrant gel ink pens with glitter, metallic and neon colours', 24.99, 'Stationery', 400, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500', 4.4, 389, false),
('Cork Board XL', 'Self-healing cork board 36x24" with natural wood frame and mounting kit', 59.99, 'Stationery', 60, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500', 4.5, 167, false),

-- Food & Beverages (8)
('Specialty Coffee Beans 500g', 'Single-origin Ethiopian Yirgacheffe beans — light roast, cupping score 90', 24.99, 'Food', 500, 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500', 4.9, 678, true),
('Matcha Powder Premium', 'Ceremonial grade organic matcha from Uji, Japan — 100g tin', 39.99, 'Food', 300, 'https://images.unsplash.com/photo-1582793988951-9aed5509eb97?w=500', 4.8, 456, true),
('Artisan Hot Sauce Set', 'Collection of 6 small-batch hot sauces — mild to extra-hot', 44.99, 'Food', 200, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500', 4.6, 312, false),
('Manuka Honey 500g', 'Certified UMF 20+ New Zealand Manuka honey in glass jar', 59.99, 'Food', 150, 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500', 4.8, 289, false),
('Herbal Tea Collection', 'Assorted loose-leaf tea in 12 varieties — 240g total', 34.99, 'Food', 400, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500', 4.7, 534, false),
('Dark Chocolate Box', 'Single-origin dark chocolate collection — 70%, 80%, 90% cacao', 29.99, 'Food', 350, 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500', 4.6, 412, false),
('Truffle Infused Olive Oil', 'Italian black truffle extra-virgin olive oil — 250ml gift bottle', 34.99, 'Food', 180, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', 4.7, 198, false),
('Gourmet Spice Set', 'World spice journey — 18 exotic spices and blends from 10 countries', 49.99, 'Food', 250, 'https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=500', 4.5, 267, false),

-- Kids & Toys (8)
('STEM Building Kit', '500-piece magnetic tile building set for ages 3+ with activity book', 59.99, 'Kids', 100, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', 4.8, 423, true),
('Wooden Puzzle 200pc', 'Illustrated wooden jigsaw puzzle with unique-shaped pieces — ages 8+', 34.99, 'Kids', 150, 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=500', 4.6, 312, false),
('Art Supply Kit Kids', '120-piece mega art kit with coloured pencils, markers, watercolours and clay', 44.99, 'Kids', 120, 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500', 4.7, 534, true),
('Remote Control Car', '1:16 scale RC car with 4WD, LED lights and 40km/h top speed', 79.99, 'Kids', 60, 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=500', 4.5, 267, false),
('Board Game Strategy', 'Award-winning strategy board game for 2–6 players ages 10+', 49.99, 'Kids', 80, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500', 4.8, 456, true),
('Kids Science Lab Kit', '30-experiment science kit with real lab equipment and instruction book', 54.99, 'Kids', 70, 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500', 4.7, 312, false),
('Plush Animal Set', 'Set of 5 ultra-soft plush animals made from recycled fibres', 39.99, 'Kids', 200, 'https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=500', 4.6, 389, false),
('Learning Tablet Kids', 'Android 10 kids tablet with parental controls, educational apps and bumper case', 149.99, 'Kids', 35, 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500', 4.5, 198, true),

-- Pet Supplies (8)
('Orthopedic Dog Bed', 'Memory foam orthopedic dog bed with waterproof cover — Large 40"x30"', 89.99, 'Pets', 50, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500', 4.8, 234, true),
('Interactive Cat Toy Set', 'Set of 5 electronic and feather wand toys to keep cats mentally stimulated', 34.99, 'Pets', 200, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500', 4.6, 412, false),
('Stainless Steel Pet Bowls', 'Non-slip elevated stainless steel food and water bowl set', 29.99, 'Pets', 300, 'https://images.unsplash.com/photo-1601758177266-bc599de87707?w=500', 4.5, 534, false),
('Dog Harness No-Pull', 'Reflective no-pull dog harness with front and back clip — sizes XS–XL', 39.99, 'Pets', 150, 'https://images.unsplash.com/photo-1558929996-da64ba858215?w=500', 4.7, 389, false),
('Automatic Pet Feeder', 'Programmable 6-meal automatic cat/dog feeder with voice recorder', 79.99, 'Pets', 60, 'https://images.unsplash.com/photo-1601758177266-bc599de87707?w=500', 4.5, 267, true),
('Cat Tree Condo', 'Multi-level cat tree with sisal scratch posts, hammock and hiding condo', 129.99, 'Pets', 30, 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500', 4.7, 198, true),
('Pet Grooming Kit', 'Professional 5-piece grooming set with slicker brush, deshedder and nail clipper', 44.99, 'Pets', 180, 'https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=500', 4.4, 312, false),
('Aquarium Starter Kit', '20-gallon fish tank with LED lighting, filter, heater and gravel', 149.99, 'Pets', 20, 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=500', 4.6, 145, false),

-- Travel (6)
('Packing Cubes Set 6pc', '6-piece compression packing cube set in 3 sizes — lightweight nylon', 34.99, 'Travel', 400, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500', 4.7, 789, true),
('Travel Pillow Memory Foam', 'Ergonomic memory foam neck pillow with hood and washable cover', 39.99, 'Travel', 300, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500', 4.6, 567, false),
('Luggage Hard Shell 24"', 'Lightweight polycarbonate spinner luggage with TSA lock and USB port', 199.99, 'Travel', 30, 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500', 4.8, 312, true),
('Travel Adapter Universal', 'All-in-one universal travel adapter with 4 USB-A and 1 USB-C port', 44.99, 'Travel', 500, 'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=500', 4.5, 678, false),
('Noise Cancelling Earplanes', 'Ceramic pressure-regulating earplugs for ear pain relief during flights', 19.99, 'Travel', 600, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', 4.4, 456, false),
('Waterproof Phone Case', 'IPX8 waterproof phone pouch with lanyard — fits phones up to 7"', 24.99, 'Travel', 400, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4.3, 389, false),

-- Garden & Outdoor (6)
('Solar Fairy Lights 100m', '100-metre solar-powered LED fairy lights with 8 lighting modes', 29.99, 'Garden', 300, 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=500', 4.6, 512, true),
('Succulent Gift Box 12pk', 'Curated collection of 12 rare succulents in terracotta mini pots', 59.99, 'Garden', 80, 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500', 4.8, 234, true),
('Garden Tool Set 8pc', 'Ergonomic 8-piece stainless steel garden tool set with storage bag', 69.99, 'Garden', 90, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 4.6, 198, false),
('Composting Bin 37L', 'Tumbling dual-chamber composter with aeration system', 89.99, 'Garden', 40, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 4.5, 145, false),
('Hanging Hammock Chair', 'Handwoven cotton rope hammock swing chair with wooden spreader bar', 99.99, 'Garden', 35, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 4.7, 267, true),
('Raised Garden Bed Kit', 'Cedar wood raised garden bed 8x4x11" — easy assembly, no tools needed', 119.99, 'Garden', 25, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500', 4.8, 178, true);
