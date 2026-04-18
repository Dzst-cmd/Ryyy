import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'ساعة ذكية فاخرة',
    price: 1200,
    image: 'https://picsum.photos/seed/watch/400/400',
    description: 'ساعة ذكية متطورة تتبع نشاطك البدني وتتصل بهاتفك بسلاسة مع تصميم راقٍ.',
    category: 'إلكترونيات',
    rating: 4.8,
    reviewsCount: 128
  },
  {
    id: '2',
    name: 'سماعات إلغاء الضجيج',
    price: 850,
    image: 'https://picsum.photos/seed/headphones/400/400',
    description: 'استمتع بصوت نقي وعزلة تامة عن الضجيج الخارجي مع بطارية تدوم طويلاً.',
    category: 'إلكترونيات',
    rating: 4.9,
    reviewsCount: 256
  },
  {
    id: '3',
    name: 'قميص قطني عصري',
    price: 150,
    image: 'https://picsum.photos/seed/shirt/400/400',
    description: 'قميص قطني 100% مريح جداً ومناسب لجميع المناسبات اليومية.',
    category: 'أزياء',
    rating: 4.5,
    reviewsCount: 89
  },
  {
    id: '4',
    name: 'طقم عطري رجالي',
    price: 450,
    image: 'https://picsum.photos/seed/perfume/400/400',
    description: 'مجموعة من الروائح الشرقية والغربية المميزة التي تدوم طويلاً.',
    category: 'جمال',
    rating: 4.7,
    reviewsCount: 154
  },
  {
    id: '5',
    name: 'حقيبة يد جلدية',
    price: 600,
    image: 'https://picsum.photos/seed/bag/400/400',
    description: 'حقيبة مصنوعة من الجلد الطبيعي بتصميم كلاسيكي يتناسب مع ذوقك الرفيع.',
    category: 'أزياء',
    rating: 4.6,
    reviewsCount: 72
  },
  {
    id: '6',
    name: 'آلة صنع القهوة',
    price: 900,
    image: 'https://picsum.photos/seed/coffee/400/400',
    description: 'ابدأ يومك بكوب قهوة احترافي في منزلك مع آلتنا الحديثة.',
    category: 'منزل',
    rating: 4.8,
    reviewsCount: 210
  }
];
