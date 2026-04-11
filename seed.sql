-- 1. الفئات (Categories)
INSERT INTO categories (id, name, slug) VALUES 
(1, 'هدايا خشبية', 'wooden-gifts'),
(2, 'إكسسوارات', 'accessories'),
(3, 'لوحات فنية', 'art-panels');

-- 2. المنتجات (Products)
INSERT INTO products (name, description, price, category_id, image_url, stock_quantity, sku) VALUES 
('صندوق خشبي فاخر', 'صندوق مصنوع يدويًا من الخشب الطبيعي مع تفاصيل دقيقة', 180.0, 1, 'https://images.unsplash.com/photo-1590076215667-875d45300439?q=80&w=800&auto=format&fit=crop', 15, 'WD-001'),
('ساعة مكتب كلاسيكية', 'ساعة خشبية محفورة بالليزر بتصميم عصري', 250.0, 1, 'https://images.unsplash.com/photo-1509033330977-2234193309f3?q=80&w=800&auto=format&fit=crop', 8, 'WD-002'),
('قلادة هندسية', 'إكسسوار فريد مطلي بالذهب', 320.0, 2, 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=800&auto=format&fit=crop', 12, 'AC-001');

-- 3. معرض الأعمال (Portfolio)
INSERT INTO portfolio (title, image_url, completion_date) VALUES 
('تجهيز هدايا مؤتمر الابتكار', 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=800&auto=format&fit=crop', '2024-02-10'),
('لوحة جدارية مخصصة', 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop', '2023-11-05');

-- 4. طلبات الهدايا الخاصة (Custom Gift Orders)
INSERT INTO custom_gift_orders (description, image_url, whatsapp_link) VALUES 
('تصميم درع تذكاري لمناسبة تخرج', 'https://images.unsplash.com/photo-1579546671231-998817290533?q=80&w=800&auto=format&fit=crop', 'https://wa.me/249123456789');
