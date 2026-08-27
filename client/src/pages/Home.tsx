/*
 * Cantina Editorial — page-level composition.
 * Maintain the chosen visual language: warm Mexican editorial, asymmetric rhythm,
 * oversized food photography, agave green actions, and tactile micro-interactions.
 */
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Flame,
  Instagram,
  Leaf,
  MapPin,
  Menu as MenuIcon,
  MessageCircle,
  Minus,
  Navigation,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";

const RESTAURANT_WHATSAPP = "5584999999999"; // Substitua pelo número oficial, com DDI e DDD.

const assets = {
  hero: "/manus-storage/sabor-mexico-hero_d649af50.png",
  ambiente: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85",
  detalhe: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=1000&q=85",
  bebida: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1000&q=85",
  logo: "/manus-storage/sabor-mexico-logo_4b934c96.png",
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  badge?: string;
};

type CartItem = MenuItem & { quantity: number };

const menuItems: MenuItem[] = [
  {
    id: "taco-carne",
    name: "Taco de carne",
    description: "Carne desfiada, cebola roxa, coentro e salsa da casa.",
    price: 24,
    category: "Tacos",
    image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?auto=format&fit=crop&w=900&q=85",
    badge: "Clássico",
  },
  {
    id: "taco-frango",
    name: "Taco de frango",
    description: "Frango marinado, abacate cremoso e pico de gallo fresco.",
    price: 22,
    category: "Tacos",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "taco-casa",
    name: "Taco especial da casa",
    description: "A receita assinatura com crocante de milho e molho de pimenta.",
    price: 29,
    category: "Tacos",
    image: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?auto=format&fit=crop&w=900&q=85",
    badge: "Assinatura",
  },
  {
    id: "burrito-carne",
    name: "Burrito de carne",
    description: "Carne grelhada, arroz mexicano, feijão e queijo derretido.",
    price: 34,
    category: "Burritos",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "burrito-frango",
    name: "Burrito de frango",
    description: "Frango defumado, arroz, guacamole e creme azedo.",
    price: 31,
    category: "Burritos",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "burrito-mexicano",
    name: "Burrito mexicano",
    description: "Feijão-preto, queijo, milho tostado e molho de tomatillo.",
    price: 28,
    category: "Burritos",
    image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85",
    badge: "Vegetariano",
  },
  {
    id: "quesadilla-carne",
    name: "Quesadilla de carne",
    description: "Tortilla dourada, queijo Oaxaca e carne na brasa.",
    price: 32,
    category: "Quesadillas",
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "quesadilla-frango",
    name: "Quesadilla de frango",
    description: "Queijo derretido, frango temperado e salsa verde.",
    price: 29,
    category: "Quesadillas",
    image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "quesadilla-veg",
    name: "Quesadilla vegetariana",
    description: "Abobrinha grelhada, cogumelos, queijo e ervas frescas.",
    price: 27,
    category: "Quesadillas",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
    badge: "Leve",
  },
  {
    id: "nachos",
    name: "Nachos da casa",
    description: "Totopos crocantes, queijo, feijão, jalapeño e pico de gallo.",
    price: 26,
    category: "Entradas",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "guacamole",
    name: "Guacamole",
    description: "Abacate amassado na hora, limão, coentro e tomate.",
    price: 19,
    category: "Entradas",
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "totopos",
    name: "Totopos",
    description: "Chips de milho artesanais com três molhos da casa.",
    price: 17,
    category: "Entradas",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "refrigerante",
    name: "Refrigerantes",
    description: "Opções tradicionais em lata, sempre bem geladas.",
    price: 7,
    category: "Bebidas",
    image: assets.bebida,
  },
  {
    id: "sucos",
    name: "Sucos naturais",
    description: "Limão, maracujá ou hibisco preparados na hora.",
    price: 12,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "bebida-mexicana",
    name: "Bebida mexicana",
    description: "Água fresca de hibisco com limão e toque de agave.",
    price: 15,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=900&q=85",
    badge: "Refrescante",
  },
];

const featured = [menuItems[0], menuItems[2], menuItems[3], menuItems[9], menuItems[13], menuItems[6]];
const categoryOrder = ["Tacos", "Burritos", "Quesadillas", "Entradas", "Bebidas"];

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function openWhatsApp(message: string) {
  const cleanedNumber = RESTAURANT_WHATSAPP.replace(/\D/g, "");
  if (cleanedNumber.length < 12) {
    toast.error("Configure o número oficial do WhatsApp no código do site.");
    return;
  }
  window.open(`https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

function buildOrderMessage(cart: CartItem[]) {
  const lines = cart.map((item) => `* ${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return `Olá! Gostaria de fazer um pedido:\n\n${lines.join("\n")}\n\nTotal: ${formatPrice(total)}\n\nGostaria de confirmar meu pedido.`;
}

function SectionKicker({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <div className={`section-kicker ${light ? "section-kicker--light" : ""}`}>
      <span className="section-kicker__line" />
      <span>{children}</span>
    </div>
  );
}

function ProductCard({ item, onAdd, compact = false }: { item: MenuItem; onAdd: (item: MenuItem) => void; compact?: boolean }) {
  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""}`}>
      <div className="product-card__image-wrap">
        <img src={item.image} alt={item.name} className="product-card__image" loading="lazy" />
        {item.badge && <span className="product-card__badge">{item.badge}</span>}
        <button className="product-card__quick-add" onClick={() => onAdd(item)} aria-label={`Adicionar ${item.name}`}>
          <Plus size={18} strokeWidth={2.5} />
        </button>
      </div>
      <div className="product-card__content">
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <div className="product-card__footer">
          <strong>{formatPrice(item.price)}</strong>
          <button className="text-action" onClick={() => onAdd(item)}>
            Adicionar <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.1, rootMargin: "0px 0px -40px" },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const visibleItems = activeCategory === "Todos" ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart((previous) => {
      const found = previous.find((cartItem) => cartItem.id === item.id);
      if (found) return previous.map((cartItem) => (cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem));
      return [...previous, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} adicionado ao pedido.`, { action: { label: "Ver pedido", onClick: () => setIsCartOpen(true) } });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((previous) =>
      previous
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id: string) => setCart((previous) => previous.filter((item) => item.id !== id));
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };
  const orderOnWhatsApp = () => {
    if (!cart.length) {
      toast.info("Seu pedido ainda está vazio. Escolha seus favoritos no cardápio.");
      return;
    }
    openWhatsApp(buildOrderMessage(cart));
  };
  const directWhatsApp = () => openWhatsApp("Olá! Gostaria de conhecer o cardápio do Sabor do México.");

  const renderFeaturedGroup = (ariaHidden = false) => (
    <div className="carousel__group" aria-hidden={ariaHidden}>
      {featured.map((item) => (
        <ProductCard key={`${ariaHidden ? "copy" : "original"}-${item.id}`} item={item} onAdd={addToCart} compact />
      ))}
    </div>
  );

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <div className="container site-header__inner">
          <button className="brand-lockup" onClick={() => scrollTo("inicio")} aria-label="Voltar ao início">
            <img src={assets.logo} alt="" className="brand-lockup__mark" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling?.classList.add("is-visible"); }} /><span className="brand-lockup__fallback" aria-hidden="true"><Leaf size={21} /></span>
            <span className="brand-lockup__wordmark">Sabor <em>do</em> México</span>
          </button>
          <nav className={`site-nav ${isMenuOpen ? "site-nav--open" : ""}`}>
            <button onClick={() => scrollTo("inicio")}>Início</button>
            <button onClick={() => scrollTo("cardapio")}>Cardápio</button>
            <button onClick={() => scrollTo("sobre")}>Sobre nós</button>
            <button onClick={() => scrollTo("localizacao")}>Localização</button>
            <button className="site-nav__mobile-order" onClick={directWhatsApp}>Pedir agora</button>
          </nav>
          <div className="site-header__actions">
            <button className="cart-trigger" onClick={() => setIsCartOpen(true)} aria-label={`Abrir pedido com ${cartCount} itens`}>
              <ShoppingBag size={18} />
              <span>Pedido</span>
              {cartCount > 0 && <b>{cartCount}</b>}
            </button>
            <button className="header-order" onClick={directWhatsApp}>Pedir agora <ArrowRight size={16} /></button>
            <button className="menu-trigger" onClick={() => setIsMenuOpen((value) => !value)} aria-label="Abrir menu">
              {isMenuOpen ? <X size={23} /> : <MenuIcon size={23} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero" style={{ backgroundImage: `url(${assets.hero})` }}>
          <div className="hero__overlay" />
          <div className="hero__grain" />
          <div className="container hero__content">
            <div className="hero__eyebrow"><span /> Restaurante mexicano em Natal <span /></div>
            <h1>Sabores do<br /><i>México</i> em Natal</h1>
            <p>Uma experiência mexicana de verdade, preparada para você.</p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={() => scrollTo("cardapio")}>Conheça nosso cardápio <ArrowDownRight size={17} /></button>
              <button className="button button--ghost" onClick={directWhatsApp}><MessageCircle size={17} /> Pedir pelo WhatsApp</button>
            </div>
          </div>
          <div className="hero__side-note"><span>01</span><span className="hero__side-rule" /><span>Do fogo para a mesa</span></div>
          <button className="hero__scroll" onClick={() => scrollTo("destaques")}><span>deslize para descobrir</span><ChevronDown size={17} /></button>
        </section>

        <section id="destaques" className="highlights-section">
          <div className="container highlights-section__top reveal">
            <SectionKicker>os favoritos da casa</SectionKicker>
            <div className="highlights-section__heading">
              <h2>Feito para <i>compartilhar.</i></h2>
              <p>Receitas vibrantes, ingredientes frescos e aquele toque de brasa que faz cada mordida pedir a próxima.</p>
            </div>
            <div className="highlights-section__stamp"><Leaf size={18} /><span>Autêntico<br />desde a primeira<br />mordida</span></div>
          </div>
          <div className="carousel" aria-label="Pratos em destaque">
            {renderFeaturedGroup()}
            {renderFeaturedGroup(true)}
          </div>
        </section>

        <section id="cardapio" className="menu-section">
          <div className="container">
            <div className="menu-section__intro reveal">
              <div><SectionKicker>o cardápio</SectionKicker><h2>Escolha seu<br /><i>ritual.</i></h2></div>
              <div className="menu-section__intro-copy"><p>Do crocante ao cremoso, do fresco ao defumado. Tudo chega à mesa com personalidade mexicana e ingredientes que a gente reconhece.</p><div className="menu-section__legend"><span><Flame size={15} /> feito na brasa</span><span><Leaf size={15} /> ingredientes frescos</span></div></div>
            </div>
            <div className="menu-tabs" role="tablist" aria-label="Categorias do cardápio">
              {["Todos", ...categoryOrder].map((category) => <button key={category} role="tab" aria-selected={activeCategory === category} className={activeCategory === category ? "is-active" : ""} onClick={() => setActiveCategory(category)}>{category}</button>)}
            </div>
            <div className="menu-grid">
              {visibleItems.map((item, index) => <div className="reveal" style={{ transitionDelay: `${Math.min(index, 5) * 55}ms` }} key={item.id}><ProductCard item={item} onAdd={addToCart} /></div>)}
            </div>
          </div>
        </section>

        <section id="sobre" className="story-section">
          <div className="container story-section__grid">
            <div className="story-section__media reveal"><img src={assets.ambiente} alt="Ambiente acolhedor do restaurante" /><div className="story-section__media-note"><span>feito com tempo</span><strong>e intenção.</strong></div></div>
            <div className="story-section__copy reveal">
              <SectionKicker>sobre o restaurante</SectionKicker>
              <h2>Uma mesa com<br /><i>história.</i></h2>
              <p className="story-section__lead">O Sabor do México nasceu para trazer a Natal o calor de uma cozinha que reúne, sem pressa, pessoas, cores e boas histórias.</p>
              <p>A gente acredita em ingredientes frescos, preparo cuidadoso e receitas que respeitam a origem sem deixar de conversar com a cidade. Entre uma tortilla aquecida, um molho feito na casa e uma mesa cheia, criamos uma experiência mexicana acolhedora, do nosso jeito.</p>
              <div className="story-section__facts"><div><strong>100%</strong><span>feito na casa</span></div><div><strong>RN</strong><span>com alma mexicana</span></div><div><strong>∞</strong><span>bons encontros</span></div></div>
              <button className="text-action text-action--large" onClick={() => scrollTo("localizacao")}>Venha conhecer <ArrowRight size={17} /></button>
            </div>
          </div>
        </section>

        <section className="visual-section">
          <div className="container visual-section__header reveal"><SectionKicker>uma experiência para todos os sentidos</SectionKicker><p>Cor, textura, perfume de limão e o som da chapa. <i>O México acontece aqui.</i></p></div>
          <div className="container visual-gallery">
            <figure className="visual-gallery__item visual-gallery__item--tall reveal"><img src={assets.detalhe} alt="Fajitas servidas na chapa" /><figcaption><span>01 — na brasa</span><strong>Calor que<br />chega à mesa</strong></figcaption></figure>
            <figure className="visual-gallery__item visual-gallery__item--wide reveal"><img src={assets.bebida} alt="Bebida mexicana refrescante" /><figcaption><span>02 — refresco</span><strong>Um gole de<br />sol</strong></figcaption></figure>
            <div className="visual-gallery__quote reveal"><Sparkles size={21} /><p>“A mesa fica melhor quando chega com pimenta.”</p><span>— um jeito Sabor do México de ver a vida</span></div>
          </div>
        </section>

        <section className="reviews-section">
          <div className="container reviews-section__head reveal"><div><SectionKicker>palavra de quem prova</SectionKicker><h2>Deixe a sua<br /><i>história aqui.</i></h2></div><p className="reviews-section__notice">Textos demonstrativos — substitua por avaliações reais do restaurante.</p></div>
          <div className="container reviews-grid">
            {[{ name: "Cliente demonstrativo", text: "Comida incrível, ambiente muito agradável e atendimento excelente. Voltarei com certeza!" }, { name: "Sua próxima avaliação", text: "Um espaço reservado para a voz de quem viveu essa experiência à mesa." }, { name: "Avaliação em destaque", text: "Troque este texto por uma avaliação real e conte a história do seu cliente." }].map((review, index) => <article className="review-card reveal" key={review.name} style={{ transitionDelay: `${index * 80}ms` }}><div className="review-card__top"><span>Texto demonstrativo</span><div>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={14} fill="currentColor" />)}</div></div><p>“{review.text}”</p><strong>{review.name}</strong><small>Aguardando conteúdo real</small></article>)}
          </div>
        </section>

        <section id="localizacao" className="location-section">
          <div className="container location-section__grid">
            <div className="location-section__copy reveal"><SectionKicker>onde a gente se encontra</SectionKicker><h2>Venha viver<br />essa <i>experiência</i><br />mexicana.</h2><div className="location-details"><div><MapPin size={19} /><div><span>Endereço</span><strong>Av. Exemplo, 000 — Tirol<br />Natal / RN</strong></div></div><div><Clock3 size={19} /><div><span>Horário de funcionamento</span><strong>Terça a domingo<br />18h às 23h</strong></div></div></div><button className="button button--dark" onClick={() => window.open("https://www.google.com/maps/search/?api=1&query=Natal+RN", "_blank", "noopener,noreferrer")}><Navigation size={16} /> Como chegar</button></div>
            <div className="map-card reveal" aria-label="Mapa ilustrativo de Natal, Rio Grande do Norte"><div className="map-card__top"><span><MapPin size={15} /> Natal, RN</span><span className="map-card__live"><i /> área do restaurante</span></div><div className="map-card__canvas"><div className="map-road map-road--one" /><div className="map-road map-road--two" /><div className="map-road map-road--three" /><div className="map-road map-road--four" /><div className="map-water" /><div className="map-pin"><span><UtensilsCrossed size={18} /></span><b>Sabor do<br />México</b></div><small>Mapa ilustrativo · endereço editável</small></div><div className="map-card__bottom"><span>Espaço preparado para Google Maps</span><ArrowRight size={17} /></div></div>
          </div>
        </section>

        <section className="final-cta">
          <div className="final-cta__pattern" /><div className="container final-cta__content reveal"><SectionKicker light>o próximo encontro</SectionKicker><h2>Seu próximo sabor<br /><i>favorito está aqui.</i></h2><p>Chame seus amigos, escolha seus favoritos e venha experimentar o México em Natal.</p><button className="button button--light" onClick={directWhatsApp}>Pedir pelo WhatsApp <MessageCircle size={17} /></button></div><div className="final-cta__side">Sabor<br />do<br />México</div>
        </section>
      </main>

      <footer className="site-footer"><div className="container site-footer__grid"><div className="site-footer__brand"><button className="brand-lockup brand-lockup--footer" onClick={() => scrollTo("inicio")}><img src={assets.logo} alt="" className="brand-lockup__mark" onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling?.classList.add("is-visible"); }} /><span className="brand-lockup__fallback" aria-hidden="true"><Leaf size={21} /></span><span className="brand-lockup__wordmark">Sabor <em>do</em> México</span></button><p>Comida mexicana com alma potiguar.</p></div><div className="site-footer__column"><span className="site-footer__label">Navegue</span><button onClick={() => scrollTo("cardapio")}>Cardápio</button><button onClick={() => scrollTo("sobre")}>Sobre nós</button><button onClick={() => scrollTo("localizacao")}>Localização</button></div><div className="site-footer__column"><span className="site-footer__label">Fale com a gente</span><button onClick={directWhatsApp}><MessageCircle size={15} /> WhatsApp</button><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={15} /> Instagram</a><span><MapPin size={15} /> Natal / RN</span></div><div className="site-footer__column"><span className="site-footer__label">Funcionamento</span><span>Terça a domingo</span><span>18h às 23h</span><span className="site-footer__status"><i /> Aberto para encontros</span></div></div><div className="container site-footer__bottom"><span>© 2026 Sabor do México Natal</span><span>feito com afeto, pimenta e limão</span></div></footer>

      {cart.length > 0 && <button className="floating-cart" onClick={() => setIsCartOpen(true)}><span><ShoppingBag size={17} /> Seu pedido</span><b>{cartCount} {cartCount === 1 ? "item" : "itens"} · {formatPrice(cartTotal)}</b></button>}

      {isCartOpen && <div className="cart-layer"><button className="cart-layer__backdrop" onClick={() => setIsCartOpen(false)} aria-label="Fechar pedido" /><aside className="cart-drawer" aria-label="Seu pedido"><div className="cart-drawer__header"><div><SectionKicker>seu pedido</SectionKicker><h2>A mesa<br /><i>começa aqui.</i></h2></div><button onClick={() => setIsCartOpen(false)} aria-label="Fechar"><X size={21} /></button></div>{cart.length === 0 ? <div className="cart-empty"><ShoppingBag size={34} /><p>Seu carrinho está esperando por algo delicioso.</p><button className="button button--dark" onClick={() => { setIsCartOpen(false); scrollTo("cardapio"); }}>Ver cardápio</button></div> : <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><img src={item.image} alt="" /><div className="cart-item__info"><h3>{item.name}</h3><span>{formatPrice(item.price)} cada</span><div className="quantity-control"><button onClick={() => updateQuantity(item.id, -1)} aria-label="Diminuir quantidade"><Minus size={13} /></button><b>{item.quantity}</b><button onClick={() => updateQuantity(item.id, 1)} aria-label="Aumentar quantidade"><Plus size={13} /></button></div></div><div className="cart-item__right"><strong>{formatPrice(item.price * item.quantity)}</strong><button onClick={() => removeFromCart(item.id)} aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button></div></div>)}</div><div className="cart-drawer__summary"><div><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div><small>O pagamento e a confirmação são feitos diretamente pelo WhatsApp.</small><button className="button button--primary button--full" onClick={orderOnWhatsApp}>Pedir pelo WhatsApp <MessageCircle size={17} /></button></div></>}</aside></div>}
    </div>
  );
}
