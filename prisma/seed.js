const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create default settings
  await prisma.setting.create({
    data: {
      store: {
        create: {
          name: 'متجر العطاوي',
          phone: '+966500000000',
          email: 'info@alatawi.com',
        },
      },
      theme: {
        create: {
          primary: '#2563eb',
          secondary: '#64748b',
          bg: '#ffffff',
          text: '#0f172a',
          btn: '#2563eb',
          discount: '#dc2626',
          radius: 12,
          font: 'Tajawal',
        },
      },
      seo: {
        create: {
          siteTitle: 'متجر العطاوي',
          metaDescription: 'متجر إلكتروني متكامل',
          keywords: 'متجر, تسوق, إلكترونيات',
        },
      },
      shipping: {
        create: {
          defaultFee: 15,
          freeShippingEnabled: true,
          freeShippingMin: 200,
          cities: {
            create: [
              { name: 'الرياض', fee: 15, duration: '1-2 يوم' },
              { name: 'جدة', fee: 20, duration: '2-3 أيام' },
              { name: 'الدمام', fee: 25, duration: '3-4 أيام' },
            ],
          },
        },
      },
      payments: {
        create: {
          cod: { enabled: true, label: 'الدفع عند الاستلام' },
          bank: { enabled: false, label: 'تحويل بنكي', details: '' },
          card: { enabled: false, label: 'بطاقة ائتمان' },
        },
      },
      social: {
        create: {},
      },
    },
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('Alatawi@123456', 12);
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@alatawi-store',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
