import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowRight, Check, ChevronDown, Heart, Menu, Search, ShoppingBag, Sparkles, X } from 'lucide-react';

const API = 'http://localhost:5000/api';
const fallbackProducts = [
  { id: 1, name: 'Dew Drops Serum', category: 'Beauty', price: 1290, tag: 'BESTSELLER', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85', description: 'A luminous, lightweight daily serum.' },
  { id: 2, name: 'The Everyday Blush', category: 'Makeup', price: 890, tag: 'JUST IN', image: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=85', description: 'A soft flush with a second-skin finish.' },
  { id: 3, name: 'Silk Scrunchie Set', category: 'Accessories', price: 690, tag: '', image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=900&q=85', description: 'Little luxuries for your everyday hair ritual.' },
  { id: 4, name: 'Rosewater Mist', category: 'Skincare', price: 990, tag: 'CUSTOMER LOVE', image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85', description: 'A refreshing veil of hydration.' },
  { id: 5, name: 'Soft Form Knit', category: 'Clothing', price: 2490, tag: 'LIMITED EDITION', image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=900&q=85', description: 'An easy layer, made for slower mornings.' },
  { id: 6, name: 'Velvet Lip Tint', category: 'Makeup', price: 790, tag: '', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=85', description: 'A muted rose tint with a velvety finish.' },
  { id: 7, name: 'Cloud Nine Moisturiser', category: 'Skincare', price: 1490, tag: 'DAILY ESSENTIAL', image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85', description: 'Comforting moisture without the weight.' },
  { id: 8, name: 'The Mini Shoulder Bag', category: 'Accessories', price: 3290, tag: '', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85', description: 'A clean silhouette that goes everywhere.' }
];
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [toast, setToast] = useState('');
  const [email, setEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  useEffect(() => {
    fetch(`${API}/products`).then(r => r.ok ? r.json() : Promise.reject()).then(data => {
      if (Array.isArray(data) && data.length) setProducts(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const categories = ['All', 'Beauty', 'Skincare', 'Makeup', 'Clothing', 'Accessories'];
  const filtered = useMemo(() => products.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    `${p.name} ${p.category} ${p.description || ''}`.toLowerCase().includes(query.toLowerCase())
  ), [products, activeCategory, query]);
  const cartCount = cart.reduce((n, item) => n + item.qty, 0);
  const subtotal = cart.reduce((n, item) => n + item.price * item.qty, 0);

  function addToCart(product) {
    setCart(old => {
      const found = old.find(item => item.id === product.id);
      return found ? old.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item) : [...old, { ...product, qty: 1 }];
    });
    setToast(`${product.name} added to your bag`);
  }
  function changeQty(id, amount) {
    setCart(old => old.map(item => item.id === id ? { ...item, qty: item.qty + amount } : item).filter(item => item.qty > 0));
  }
  function toggleWishlist(id) {
    setWishlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id]);
    setToast(wishlist.includes(id) ? 'Removed from wishlist' : 'Saved to your wishlist');
  }
  async function checkout() {
    try {
      const response = await fetch(`${API}/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart.map(({ id, qty }) => ({ productId: id, quantity: qty })) }) });
      if (response.ok) {
        setCheckoutDone(true);
        setCart([]);
      } else setToast('Unable to place order. Please try again.');
    } catch {
      setCheckoutDone(true);
      setCart([]);
    }
  }
  async function subscribe(e) {
    e.preventDefault();
    if (!email.includes('@')) return setToast('Please enter a valid email address');
    try { await fetch(`${API}/newsletter`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); } catch {}
    setNewsletterDone(true);
  }

  return <div className="site-shell">
    <div className="announcement">A little something for you — complimentary shipping on orders over ₹2,500</div>
    <header className="header">
      <button className="icon-button mobile-toggle" aria-label="Open menu" onClick={() => setMobileMenu(!mobileMenu)}><Menu size={20}/></button>
      <nav className={`nav-left ${mobileMenu ? 'nav-open' : ''}`}>
        <a href="#shop" onClick={() => { setActiveCategory('All'); setMobileMenu(false); }}>Shop all</a>
        <a href="#shop" onClick={() => { setActiveCategory('Skincare'); setMobileMenu(false); }}>Skincare</a>
        <a href="#edit" onClick={() => setMobileMenu(false)}>The edit</a>
      </nav>
      <a className="wordmark" href="#" aria-label="Maison Lune home">maison lune<span>BEAUTY & STYLE</span></a>
      <div className="nav-right">
        <button className="icon-button search-toggle" aria-label="Search products" onClick={() => { setSearchOpen(!searchOpen); document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }); }}><Search size={19}/></button>
        <button className="icon-button wishlist-top" aria-label="Wishlist" onClick={() => { setToast(`${wishlist.length} saved ${wishlist.length === 1 ? 'piece' : 'pieces'} in your wishlist`); }}><Heart size={19}/></button>
        <button className="bag-button" onClick={() => { setDrawer(true); setCheckoutDone(false); }} aria-label={`Shopping bag with ${cartCount} items`}><ShoppingBag size={18}/><span>Bag ({cartCount})</span></button>
      </div>
    </header>

    {searchOpen && <div className="search-bar"><Search size={17}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search your next favourite..." /><button className="icon-button" onClick={() => { setQuery(''); setSearchOpen(false); }} aria-label="Close search"><X size={18}/></button></div>}

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line"/>THE ART OF EVERYDAY</div>
          <h1>Feel good.<br/><em>Look like you.</em></h1>
          <p>Thoughtful beauty and pieces you'll reach for, again and again. A softer kind of everyday luxury.</p>
          <a className="primary-button" href="#shop">Discover the collection <ArrowRight size={16}/></a>
          <div className="hero-note"><span>01 / 03</span><span className="note-rule"/><span>Made for your own kind of beautiful</span></div>
        </div>
        <div className="hero-visual">
          <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=90" alt="Editorial fashion portrait in warm neutral tones"/>
          <div className="image-stamp"><span>THE NEW</span><strong>Soft<br/>Season</strong><ArrowDownRight size={22}/></div>
          <div className="vertical-caption">A LITTLE MORE YOU, EVERY DAY</div>
        </div>
        <div className="hero-index">ML. / 2026</div>
      </section>

      <section className="category-strip" aria-label="Shop by category">
        <div className="section-kicker">A GOOD PLACE TO START</div>
        <div className="category-links">
          {[
            ['01','Beauty rituals','Beauty'], ['02','The wardrobe','Clothing'], ['03','Little details','Accessories'], ['04','Skin, softly','Skincare']
          ].map(([n, label, cat]) => <button key={cat} onClick={() => { setActiveCategory(cat); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }} className="category-link"><span>{n}</span><strong>{label}</strong><ArrowDownRight size={17}/></button>)}
        </div>
      </section>

      <section className="shop-section" id="shop">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-line"/>THE CONSIDERED COLLECTION</div><h2>Everyday <em>favourites.</em></h2><p>Good things, chosen with care.</p></div>
          <a className="text-link" href="#newsletter">A note from us <ArrowRight size={16}/></a>
        </div>
        <div className="shop-controls">
          <div className="filter-list">{categories.map(c => <button key={c} className={`filter-chip ${activeCategory === c ? 'selected' : ''}`} onClick={() => setActiveCategory(c)}>{c}</button>)}</div>
          <span className="result-count">{filtered.length} pieces</span>
        </div>
        <div className="product-grid">
          {filtered.map((product, index) => <article className="product-card" key={product.id}>
            <div className="product-image-wrap">
              <img src={product.image} alt={product.name} loading={index > 3 ? 'lazy' : 'eager'} onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85'; }}/>
              {product.tag && <span className="product-tag">{product.tag}</span>}
              <button className={`heart-button ${wishlist.includes(product.id) ? 'is-saved' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label={`Save ${product.name}`}><Heart size={17} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}/></button>
              <button className="quick-add" onClick={() => addToCart(product)}>Add to bag <span>+</span></button>
            </div>
            <div className="product-meta"><div><span className="product-category">{product.category}</span><h3>{product.name}</h3></div><span className="product-price">{money(product.price)}</span></div>
            <p className="product-description">{product.description}</p>
          </article>)}
        </div>
        {filtered.length === 0 && <div className="empty-state">Nothing here just yet. Try another category.</div>}
        <div className="center-action"><button className="outline-button" onClick={() => { setActiveCategory('All'); setQuery(''); }}>Explore everything <ArrowRight size={16}/></button></div>
      </section>

      <section className="manifesto" id="edit">
        <div className="manifesto-image"><img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85" alt="Fashion editorial with neutral styling" loading="lazy"/><span className="photo-credit">THE EVERYDAY EDIT — VOL. 01</span></div>
        <div className="manifesto-copy"><div className="eyebrow"><span className="eyebrow-line"/>A DIFFERENT KIND OF BEAUTY</div><h2>Less, but<br/><em>more meaningful.</em></h2><p>We believe the best things don't shout. They fit into your life, feel like you, and make the ordinary feel just a little more special.</p><p>Considered essentials. Easy rituals. Personal style, on your own terms.</p><a href="#shop" className="text-link">Get to know your new favourites <ArrowRight size={16}/></a><span className="manifesto-mark">m.</span></div>
      </section>

      <section className="promise-row">
        <div><span className="promise-number">01</span><Sparkles size={20}/><h3>Thoughtfully chosen</h3><p>Every piece earns its place.</p></div>
        <div><span className="promise-number">02</span><Heart size={20}/><h3>Made for real life</h3><p>Lovely things, easy to love.</p></div>
        <div><span className="promise-number">03</span><ShoppingBag size={20}/><h3>A softer footprint</h3><p>Less excess. More intention.</p></div>
      </section>

      <section className="newsletter" id="newsletter">
        <div className="newsletter-orbit">m.</div>
        <div className="eyebrow"><span className="eyebrow-line"/>A LETTER FROM MAISON LUNE</div>
        <h2>Good things, <em>in your inbox.</em></h2>
        <p>New arrivals, little rituals and notes on living beautifully. Only when we have something lovely to share.</p>
        {newsletterDone ? <div className="success-message"><Check size={18}/> You're on the list. Look out for a little note from us.</div> : <form className="newsletter-form" onSubmit={subscribe}><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required/><button type="submit" aria-label="Subscribe"><ArrowRight size={18}/></button></form>}
        <small>By subscribing, you agree to receive occasional notes from us.</small>
      </section>
    </main>

    <footer className="footer">
      <div className="footer-main"><div className="footer-brand"><a className="wordmark footer-wordmark" href="#">maison lune<span>BEAUTY & STYLE</span></a><p>Everyday things, a little more beautiful.</p></div><div className="footer-column"><span>EXPLORE</span><a href="#shop">Shop all</a><a href="#shop" onClick={() => setActiveCategory('Skincare')}>Skincare</a><a href="#edit">Our point of view</a></div><div className="footer-column"><span>HERE TO HELP</span><a href="mailto:hello@maisonlune.example">Contact us</a><a href="#newsletter">Newsletter</a><a href="#shop">Shipping & returns</a></div><div className="footer-note">A little everyday<br/><em>magic.</em></div></div>
      <div className="footer-bottom"><span>© 2026 MAISON LUNE</span><span>MADE WITH INTENTION</span><a href="#">BACK TO TOP ↑</a></div>
    </footer>

    {drawer && <div className="drawer-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setDrawer(false); }}>
      <aside className="cart-drawer" aria-label="Shopping bag">
        <div className="drawer-head"><div><span className="eyebrow">YOUR LITTLE FINDS</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setDrawer(false)} aria-label="Close bag"><X/></button></div>
        {checkoutDone ? <div className="checkout-success"><div className="success-icon"><Check size={26}/></div><h3>Lovely choice.</h3><p>Your demo order has been received. No payment was taken.</p><button className="primary-button" onClick={() => { setDrawer(false); setCheckoutDone(false); }}>Keep exploring <ArrowRight size={16}/></button></div> : cart.length === 0 ? <div className="cart-empty"><div className="empty-bag"><ShoppingBag size={27}/></div><h3>Your bag is taking a little break.</h3><p>Find something that feels like you.</p><button className="primary-button" onClick={() => setDrawer(false)}>Explore the collection <ArrowRight size={16}/></button></div> : <>
          <div className="shipping-progress"><p>{subtotal >= 2500 ? 'You’ve unlocked complimentary shipping.' : `You're ${money(2500 - subtotal)} away from complimentary shipping.`}</p><div><span style={{width: `${Math.min(100, subtotal / 2500 * 100)}%`}}/></div></div>
          <div className="cart-items">{cart.map(item => <div className="cart-item" key={item.id}><img src={item.image} alt={item.name}/><div className="cart-item-info"><span>{item.category}</span><h3>{item.name}</h3><strong>{money(item.price)}</strong><div className="quantity"><button onClick={() => changeQty(item.id, -1)} aria-label="Decrease quantity">−</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label="Increase quantity">+</button></div></div><button className="remove-item" onClick={() => setCart(old => old.filter(x => x.id !== item.id))} aria-label={`Remove ${item.name}`}><X size={15}/></button></div>)}</div>
          <div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes calculated at checkout.</p><button className="checkout-button" onClick={checkout}>Continue to checkout <ArrowRight size={17}/></button><span className="demo-note">DEMO CHECKOUT · NO PAYMENT WILL BE TAKEN</span></div>
        </>}
      </aside>
    </div>}
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </div>;
}
export default App;