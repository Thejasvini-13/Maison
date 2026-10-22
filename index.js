import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const products = [
  { id: 1, name: 'Dew Drops Serum', category: 'Beauty', price: 1290, tag: 'BESTSELLER', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85', description: 'A luminous, lightweight daily serum.' },
  { id: 2, name: 'The Everyday Blush', category: 'Makeup', price: 890, tag: 'JUST IN', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85', description: 'A soft flush with a second-skin finish.' },
  { id: 3, name: 'Silk Scrunchie Set', category: 'Accessories', price: 690, tag: '', image: 'https://cpimg.tistatic.com/10874586/b/4/satin-scrunchie-set.jpg', description: 'Little luxuries for your everyday hair ritual.' },
  { id: 4, name: 'Rosewater Mist', category: 'Skincare', price: 990, tag: 'CUSTOMER LOVE', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85', description: 'A refreshing veil of hydration.' },
  { id: 5, name: 'Soft Form Knit', category: 'Clothing', price: 2490, tag: 'LIMITED EDITION', image: 'https://i.pinimg.com/474x/8c/4e/be/8c4ebe70ec03d46a4aedfaa55673cdc2.jpg', description: 'An easy layer, made for slower mornings.' },
  { id: 6, name: 'Velvet Lip Tint', category: 'Makeup', price: 790, tag: '', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85', description: 'A muted rose tint with a velvety finish.' },
  { id: 7, name: 'Cloud Nine Moisturiser', category: 'Skincare', price: 1490, tag: 'DAILY ESSENTIAL', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85', description: 'Comforting moisture without the weight.' },
  { id: 8, name: 'The Mini Shoulder Bag', category: 'Accessories', price: 3290, tag: '', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', description: 'A clean silhouette that goes everywhere.' }
];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Maison Lune API' }));
app.get('/api/products', (req, res) => {
  const category = req.query.category?.toString().toLowerCase();
  const search = req.query.search?.toString().toLowerCase();
  let result = [...products];
  if (category && category !== 'all') result = result.filter(p => p.category.toLowerCase() === category);
  if (search) result = result.filter(p => `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(search));
  res.json(result);
});
app.get('/api/categories', (_req, res) => res.json(['Beauty', 'Skincare', 'Makeup', 'Clothing', 'Accessories']));

app.post('/api/checkout', (req, res) => {
  const items = req.body?.items;
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Your bag is empty.' });
  let total = 0;
  const orderItems = [];
  for (const item of items) {
    const product = products.find(p => p.id === Number(item.productId));
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
      return res.status(400).json({ error: 'One or more items are invalid.' });
    }
    total += product.price * quantity;
    orderItems.push({ productId: product.id, name: product.name, quantity, unitPrice: product.price });
  }
  // Demo only: no payment is collected and this order is not persisted.
  res.status(201).json({ message: 'Demo order received', orderId: `ML-${Date.now().toString().slice(-8)}`, items: orderItems, total, paymentStatus: 'not_processed' });
});

app.post('/api/newsletter', (req, res) => {
  const email = String(req.body?.email || '').trim();
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  // Demo only: connect an email marketing provider to persist subscriptions.
  res.status(201).json({ message: 'Subscription received', email });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});
app.listen(PORT, () => console.log(`Maison Lune API running at http://localhost:${PORT}`));