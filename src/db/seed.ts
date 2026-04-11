import { db } from './client'; 
import { categories, products, portfolio, customGiftOrders } from './schema';

async function seed() {
  console.log('جاري إدخال البيانات التجريبية...');

  // 1. الفئات
  const insertedCategories = await db.insert(categories).values([
    { name: 'هدايا خشبية', slug: 'wooden-gifts' },
    { name: 'إكسسوارات', slug: 'accessories' },
    { name: 'لوحات فنية', slug: 'art-panels' },
  ]).returning();

  // 2. المنتجات (روابط صور حقيقية من Unsplash)
  await db.insert(products).values([
    {
      name: 'صندوق خشبي فاخر',
      description: 'صندوق مصنوع يدويًا من الخشب الطبيعي مع تفاصيل دقيقة',
      price: 180.0,
      categoryId: insertedCategories[0].id,
      imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d45300439?q=80&w=800&auto=format&fit=crop',
      stockQuantity: 15,
      sku: 'WD-001',
    },
    {
      name: 'ساعة مكتب كلاسيكية',
      description: 'ساعة خشبية محفورة بالليزر بتصميم عصري',
      price: 250.0,
      categoryId: insertedCategories[0].id,
      imageUrl: 'https://images.unsplash.com/photo-1509033330977-2234193309f3?q=80&w=800&auto=format&fit=crop',
      stockQuantity: 8,
      sku: 'WD-002',
    },
    {
      name: 'قلادة هندسية',
      description: 'إكسسوار فريد مطلي بالذهب',
      price: 320.0,
      categoryId: insertedCategories[1].id,
      imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=800&auto=format&fit=crop',
      stockQuantity: 12,
      sku: 'AC-001',
    }
  ]);

  // 3. معرض الأعمال (Portfolio)
  await db.insert(portfolio).values([
    {
      title: 'تجهيز هدايا مؤتمر الابتكار',
      imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?q=80&w=800&auto=format&fit=crop',
      completionDate: '2024-02-10',
    },
    {
      title: 'لوحة جدارية مخصصة',
      imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?q=80&w=800&auto=format&fit=crop',
      completionDate: '2023-11-05',
    }
  ]);

  // 4. طلبات الهدايا الخاصة
  await db.insert(customGiftOrders).values([
    {
      description: 'تصميم درع تذكاري لمناسبة تخرج',
      imageUrl: 'https://images.unsplash.com/photo-1579546671231-998817290533?q=80&w=800&auto=format&fit=crop',
      whatsappLink: 'https://wa.me/249123456789',
    }
  ]);

  console.log('تم تحديث قاعدة البيانات بنجاح!');
}

seed().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});