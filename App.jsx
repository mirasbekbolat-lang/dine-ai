import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, Bot, CalendarDays, Check, ChevronDown, Clock3, Globe2,
  Leaf, Menu as MenuIcon, MessageCircle, Plus, Send, ShoppingBag,
  Sparkles, Utensils, X
} from "lucide-react";

const copy = {
  kk: {
    navHome:"Басты бет", navMenu:"Смарт-мәзір", navAI:"AI-официант", navRecommend:"Ұсыныстар", navBooking:"Брондау",
    eyebrow:"НЕЙРОГАСТРОНОМИЯ · АЛМАТЫ", titleA:"Болашақтың дәмі.", titleB:"Интеллект тәжірибесі.",
    intro:"DINE AI авторлық асхананы жасанды интеллектпен біріктіреді: талғамыңызды, бюджетіңізді және көңіл-күйіңізді түсінетін мәзір.",
    explore:"Мәзірді ашу", book:"Үстел брондау", dishes:"мәзірдегі тағам", rating:"қонақтар рейтингі",
    menuTitle:"Смарт-мәзір", menuSub:"Әр тағам — жаңа әсер. Өзіңізге ұнағанын таңдаңыз.",
    all:"Барлығы", main:"Негізгі тағам", salad:"Салат", dessert:"Десерт", add:"Себетке қосу",
    aiTitle:"AI-официант", aiSub:"Сұрағыңызды жазыңыз — DINE AI мәзірден жауап береді.",
    placeholder:"Мысалы: 7000 теңгеге не ұсынасың?", send:"Жіберу",
    recommendTitle:"Сізге арналған ұсыныс", recommendSub:"Бюджет пен қалауыңызды енгізіңіз.",
    budget:"Бюджет (₸)", preference:"Қалауыңыз", prefPlaceholder:"Мысалы: етсіз, жеңіл тағам",
    get:"Ұсыныс алу", analyzeTitle:"Мәзірді талдау", analyzeSub:"Баға, калория және тағам түрлері туралы сұраңыз.",
    analyzePlaceholder:"Мысалы: ең арзан және калориясы төмен тағамдар қайсы?", analyze:"Мәзірді талдау",
    bookingTitle:"Үстел брондау", bookingSub:"Кездесуіңізге ыңғайлы уақыт таңдаңыз.",
    name:"Атыңыз", date:"Күні", time:"Уақыты", guests:"Қонақ саны", reserve:"Брондау",
    bookingSuccess:"Сұраныс қабылданды! Бұл демо брондау — дерекқорға әлі сақталмайды.",
    cart:"Себет", empty:"Себет әзірге бос.", total:"Барлығы", checkout:"Тапсырысты рәсімдеу",
    footer:"Ақылды асхана тәжірибесі.", modeAI:"AI режимі", modeDemo:"Демо режимі",
    welcome:"Сәлем! Мен DINE AI көмекшісімін. Бюджетіңізді немесе тағам талғамыңызды айтыңыз.",
    close:"Жабу"
  },
  ru: {
    navHome:"Главная", navMenu:"Смарт-меню", navAI:"AI-официант", navRecommend:"Рекомендации", navBooking:"Бронирование",
    eyebrow:"НЕЙРОГАСТРОНОМИЯ · АЛМАТЫ", titleA:"Вкус будущего.", titleB:"Опыт интеллекта.",
    intro:"DINE AI объединяет авторскую кухню и искусственный интеллект: меню, которое учитывает ваш вкус, бюджет и настроение.",
    explore:"Открыть меню", book:"Забронировать стол", dishes:"блюд в меню", rating:"рейтинг гостей",
    menuTitle:"Смарт-меню", menuSub:"Каждое блюдо — новое впечатление. Выберите то, что вам нравится.",
    all:"Все", main:"Основные блюда", salad:"Салаты", dessert:"Десерты", add:"В корзину",
    aiTitle:"AI-официант", aiSub:"Задайте вопрос — DINE AI ответит на основе меню.",
    placeholder:"Например: что посоветуешь до 7000 тенге?", send:"Отправить",
    recommendTitle:"Рекомендации для вас", recommendSub:"Укажите бюджет и предпочтения.",
    budget:"Бюджет (₸)", preference:"Предпочтения", prefPlaceholder:"Например: без мяса, лёгкая еда",
    get:"Подобрать", analyzeTitle:"Анализ меню", analyzeSub:"Спросите о ценах, калорийности и категориях блюд.",
    analyzePlaceholder:"Например: какие блюда самые недорогие и низкокалорийные?", analyze:"Анализировать меню",
    bookingTitle:"Бронирование стола", bookingSub:"Выберите удобное время для визита.",
    name:"Ваше имя", date:"Дата", time:"Время", guests:"Количество гостей", reserve:"Забронировать",
    bookingSuccess:"Запрос принят! Это демо-бронирование — пока оно не сохраняется в базе данных.",
    cart:"Корзина", empty:"Корзина пока пуста.", total:"Итого", checkout:"Оформить заказ",
    footer:"Умный ресторанный опыт.", modeAI:"Режим AI", modeDemo:"Демо-режим",
    welcome:"Здравствуйте! Я помощник DINE AI. Расскажите о бюджете или предпочтениях.",
    close:"Закрыть"
  },
  en: {
    navHome:"Home", navMenu:"Smart Menu", navAI:"AI Waiter", navRecommend:"Recommendations", navBooking:"Booking",
    eyebrow:"NEUROGASTRONOMY · ALMATY", titleA:"Taste the future.", titleB:"Experience intelligence.",
    intro:"DINE AI combines signature cuisine with artificial intelligence: a menu that understands your taste, budget and mood.",
    explore:"Explore menu", book:"Book a table", dishes:"dishes on menu", rating:"guest rating",
    menuTitle:"Smart Menu", menuSub:"Every dish is a new experience. Find something you love.",
    all:"All", main:"Main dishes", salad:"Salads", dessert:"Desserts", add:"Add to cart",
    aiTitle:"AI Waiter", aiSub:"Ask a question — DINE AI will answer using the menu.",
    placeholder:"For example: what can I get for 7000 tenge?", send:"Send",
    recommendTitle:"Made for your taste", recommendSub:"Enter your budget and preferences.",
    budget:"Budget (₸)", preference:"Preferences", prefPlaceholder:"For example: vegetarian, light food",
    get:"Get recommendations", analyzeTitle:"Menu Analysis", analyzeSub:"Ask about prices, calories and food categories.",
    analyzePlaceholder:"For example: which dishes are cheapest and lowest in calories?", analyze:"Analyze menu",
    bookingTitle:"Book a table", bookingSub:"Choose a convenient time for your visit.",
    name:"Your name", date:"Date", time:"Time", guests:"Number of guests", reserve:"Reserve table",
    bookingSuccess:"Request received! This is a demo booking and is not saved to a database yet.",
    cart:"Your cart", empty:"Your cart is empty.", total:"Total", checkout:"Continue",
    footer:"A smarter dining experience.", modeAI:"AI mode", modeDemo:"Demo mode",
    welcome:"Hello! I'm the DINE AI assistant. Tell me your budget or food preferences.",
    close:"Close"
  }
};

const money = (n) => new Intl.NumberFormat("kk-KZ").format(n) + " ₸";

function App() {
  const [lang, setLang] = useState("ru");
  const t = copy[lang];
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("all");
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("demo");
  const [budget, setBudget] = useState("7000");
  const [preference, setPreference] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recommendNote, setRecommendNote] = useState("");
  const [analysisQuestion, setAnalysisQuestion] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [booking, setBooking] = useState({ name:"", date:"", time:"19:00", guests:"2" });
  const [bookingMessage, setBookingMessage] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    fetch("/api/menu").then(r => r.json()).then(setMenu).catch(() => setMenu([]));
    fetch("/api/health").then(r => r.json()).then(d => setMode(d.mode)).catch(() => {});
    setMessages([{ role:"assistant", content:t.welcome }]);
  }, []);

  useEffect(() => {
    setMessages([{ role:"assistant", content:t.welcome }]);
  }, [lang]);

  // Reveal sections as they enter the viewport. The animation is disabled
  // automatically for visitors who prefer reduced motion.
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach(node => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const filteredMenu = useMemo(() => category === "all" ? menu : menu.filter(x => x.category === category), [menu, category]);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  function addToCart(item) {
    setCart(current => {
      const found = current.find(x => x.id === item.id);
      return found ? current.map(x => x.id === item.id ? { ...x, qty:x.qty+1 } : x) : [...current, { ...item, qty:1 }];
    });
    setCartOpen(true);
  }

  async function sendChat(e) {
    e?.preventDefault();
    if (!message.trim()) return;
    const current = message.trim();
    const next = [...messages, { role:"user", content:current }];
    setMessages(next);
    setMessage("");
    try {
      const response = await fetch("/api/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ message:current, history:messages.slice(-8), language:lang })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Request failed");
      setMessages(old => [...old, { role:"assistant", content:data.answer }]);
      setMode(data.mode);
    } catch {
      setMessages(old => [...old, { role:"assistant", content:"Could not reach the local server. Please check that the server is running." }]);
    }
  }

  async function getRecommendations(e) {
    e.preventDefault();
    const response = await fetch("/api/recommend", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ budget:Number(budget), preference, language:lang })
    });
    const data = await response.json();
    setRecommendations(data.suggestions || []);
    setRecommendNote(data.explanation || data.error || "");
  }

  async function analyzeMenu(e) {
    e.preventDefault();
    const response = await fetch("/api/analyze", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ question:analysisQuestion, language:lang })
    });
    const data = await response.json();
    setAnalysis(data.answer || data.error || "No result.");
    setMode(data.mode || mode);
  }

  async function submitBooking(e) {
    e.preventDefault();
    const response = await fetch("/api/bookings", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body:JSON.stringify(booking)
    });
    const data = await response.json();
    setBookingMessage(response.ok ? t.bookingSuccess : data.error);
  }

  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setMobileNav(false);
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" onClick={() => scrollTo("home")}>
          <span className="brand-mark"><Utensils size={19}/></span>
          <span><b>DINE AI</b><small>ALMATY · 24F</small></span>
        </a>
        <button className="mobile-menu icon-button" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu"><MenuIcon/></button>
        <nav className={mobileNav ? "nav-links open" : "nav-links"}>
          <button onClick={() => scrollTo("home")}>{t.navHome}</button>
          <button onClick={() => scrollTo("menu")}>{t.navMenu}</button>
          <button onClick={() => { setChatOpen(true); scrollTo("home"); }}>{t.navAI}</button>
          <button onClick={() => scrollTo("recommend")}>{t.navRecommend}</button>
          <button onClick={() => scrollTo("booking")}>{t.navBooking}</button>
        </nav>
        <div className="top-actions">
          <div className="language-switch"><Globe2 size={15}/><select value={lang} onChange={e => setLang(e.target.value)} aria-label="Language">
            <option value="kk">ҚАЗ</option><option value="ru">РУС</option><option value="en">ENG</option>
          </select><ChevronDown size={13}/></div>
          <button className="cart-button" onClick={() => setCartOpen(true)}><ShoppingBag size={17}/><span>{cartCount}</span></button>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot"/> {t.eyebrow}</div>
            <h1>{t.titleA}<br/><span>{t.titleB}</span></h1>
            <p>{t.intro}</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => scrollTo("menu")}>{t.explore}<ArrowRight size={17}/></button>
              <button className="secondary-button" onClick={() => scrollTo("booking")}>{t.book}</button>
            </div>
            <div className="hero-stats">
              <div><b>{menu.length || "48"}</b><span>{t.dishes}</span></div>
              <div><b>14</b><span>{lang === "kk" ? "орташа баға" : lang === "ru" ? "средний чек" : "average check"}</span></div>
              <div><b>4.9</b><span>{t.rating}</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-glow"></div>
            <div className="hero-orbit orbit-one"></div>
            <div className="hero-orbit orbit-two"></div>
            <div className="hero-image"></div>
            <div className="hero-dish-shadow"></div>
            <div className="floating-card">
              <div className="floating-label"><Sparkles size={14}/> AI PICK · 98%</div>
              <span className="floating-caption">{lang === "kk" ? "Дәм үйлесімі" : lang === "ru" ? "Совпадение вкуса" : "Taste match"}</span>
              <b>Wagyu A5-42</b>
              <small>18 900 ₸ · Chef's choice</small>
            </div>
            <div className="image-stamp">SIGNATURE<br/>DINING</div>
          </div>
        </section>

        <section className="section-wrap section-block reveal-on-scroll" id="menu">
          <div className="section-heading"><div><span className="eyebrow">01 / DINE COLLECTION</span><h2>{t.menuTitle}</h2><p>{t.menuSub}</p></div><span className="section-count">0{menu.length} ITEMS</span></div>
          <div className="filter-row">
            {[["all",t.all],["main",t.main],["salad",t.salad],["dessert",t.dessert]].map(([key,label]) => <button key={key} className={category===key?"filter active":"filter"} onClick={() => setCategory(key)}>{label}</button>)}
          </div>
          <div className="menu-grid">
            {filteredMenu.map(item => <article className="dish-card" key={item.id}>
              <div className="dish-image" style={{backgroundImage:`url("${item.image}")`}}>
                <span className="dish-cal">{item.calories} kcal</span>
                {item.vegetarian && <span className="veg-tag"><Leaf size={12}/> VEG</span>}
              </div>
              <div className="dish-content"><div className="dish-meta">{item.category.toUpperCase()} · DINE SIGNATURE</div><h3>{item.name}</h3><p>{lang==="kk" ? item.descriptionKk : lang==="ru" ? item.descriptionRu : item.description}</p>
                <div className="dish-bottom"><b>{money(item.price)}</b><button onClick={() => addToCart(item)} aria-label={t.add}><Plus size={17}/></button></div>
              </div>
            </article>)}
          </div>
        </section>

        <section className="ai-section section-wrap section-block reveal-on-scroll" id="assistant">
          <div className="section-heading"><div><span className="eyebrow">02 / PERSONAL INTELLIGENCE</span><h2>{t.aiTitle}</h2><p>{t.aiSub}</p></div><div className="ai-status"><span className="live-dot"/>{mode==="ai" ? t.modeAI : t.modeDemo}</div></div>
          <div className="assistant-panel">
            <div className="assistant-intro"><div className="bot-orb"><Bot size={30}/></div><div><b>DINE AI Concierge</b><span>Always ready to help</span></div><Sparkles className="assistant-spark"/></div>
            <div className="chat-messages">{messages.map((m,i) => <div className={`chat-line ${m.role}`} key={i}><div className="chat-avatar">{m.role==="assistant" ? <Bot size={15}/> : "YOU"}</div><p>{m.content}</p></div>)}</div>
            <form className="chat-input" onSubmit={sendChat}><input value={message} onChange={e=>setMessage(e.target.value)} placeholder={t.placeholder}/><button aria-label={t.send}><Send size={17}/></button></form>
          </div>
        </section>

        <section className="section-wrap section-block reveal-on-scroll" id="recommend">
          <div className="section-heading"><div><span className="eyebrow">03 / SMART MATCH</span><h2>{t.recommendTitle}</h2><p>{t.recommendSub}</p></div><Sparkles className="gold-icon"/></div>
          <form className="recommend-form" onSubmit={getRecommendations}>
            <label>{t.budget}<input type="number" min="0" value={budget} onChange={e=>setBudget(e.target.value)}/></label>
            <label>{t.preference}<input value={preference} onChange={e=>setPreference(e.target.value)} placeholder={t.prefPlaceholder}/></label>
            <button className="primary-button">{t.get}<ArrowRight size={16}/></button>
          </form>
          {recommendNote && <p className="result-note">{recommendNote}</p>}
          <div className="recommend-grid">{recommendations.map(item => <div className="recommend-card" key={item.id}><img src={item.image} alt={item.name}/><div><b>{item.name}</b><span>{money(item.price)}</span></div><button onClick={()=>addToCart(item)}><Plus size={16}/></button></div>)}</div>
        </section>

        <section className="analysis-section section-wrap section-block reveal-on-scroll" id="analysis">
          <div className="analysis-copy"><span className="eyebrow">04 / MENU INTELLIGENCE</span><h2>{t.analyzeTitle}</h2><p>{t.analyzeSub}</p></div>
          <form className="analysis-form" onSubmit={analyzeMenu}><input value={analysisQuestion} onChange={e=>setAnalysisQuestion(e.target.value)} placeholder={t.analyzePlaceholder}/><button className="primary-button">{t.analyze}<ArrowRight size={16}/></button></form>
          {analysis && <div className="analysis-result"><Sparkles size={18}/><p>{analysis}</p></div>}
        </section>

        <section className="booking-section section-wrap section-block reveal-on-scroll" id="booking">
          <div className="booking-copy"><span className="eyebrow">05 / YOUR TABLE</span><h2>{t.bookingTitle}</h2><p>{t.bookingSub}</p><div className="booking-detail"><Clock3 size={16}/> Daily · 12:00 — 23:00</div></div>
          <form className="booking-form" onSubmit={submitBooking}>
            <label>{t.name}<input required value={booking.name} onChange={e=>setBooking({...booking,name:e.target.value})} placeholder="Name"/></label>
            <label>{t.date}<input required type="date" min={new Date().toISOString().slice(0,10)} value={booking.date} onChange={e=>setBooking({...booking,date:e.target.value})}/></label>
            <label>{t.time}<select value={booking.time} onChange={e=>setBooking({...booking,time:e.target.value})}>{["12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"].map(x=><option key={x}>{x}</option>)}</select></label>
            <label>{t.guests}<select value={booking.guests} onChange={e=>setBooking({...booking,guests:e.target.value})}>{["1","2","3","4","5","6","7","8"].map(x=><option key={x}>{x}</option>)}</select></label>
            <button className="primary-button booking-submit">{t.reserve}<CalendarDays size={17}/></button>
            {bookingMessage && <p className="booking-message"><Check size={16}/>{bookingMessage}</p>}
          </form>
        </section>
      </main>

      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark"><Utensils size={18}/></span><span><b>DINE AI</b><small>ALMATY · 24F</small></span></a><p>{t.footer}</p><span>© 2026 DINE AI</span></footer>

      {cartOpen && <div className="overlay" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h3>{t.cart}</h3><button className="icon-button" onClick={()=>setCartOpen(false)}><X/></button></div>
        {!cart.length ? <p className="empty-cart">{t.empty}</p> : <div className="cart-items">{cart.map(item=><div className="cart-item" key={item.id}><img src={item.image} alt=""/><div><b>{item.name}</b><span>{item.qty} × {money(item.price)}</span></div><button onClick={()=>setCart(cart.filter(x=>x.id!==item.id))}><X size={15}/></button></div>)}</div>}
        <div className="cart-total"><span>{t.total}</span><b>{money(cartTotal)}</b></div><button className="primary-button full-button" onClick={()=>alert(lang==="kk"?"Бұл демо нұсқа. Төлем жүйесі қосылмаған.":lang==="ru"?"Это демо-версия. Оплата пока не подключена.":"Demo version. Payments are not connected.")}>{t.checkout}</button>
      </aside></div>}

      {chatOpen && <button className="floating-chat" onClick={()=>{setChatOpen(false);scrollTo("assistant")}}><MessageCircle size={20}/>{t.aiTitle}<X size={16}/></button>}
      {!chatOpen && <button className="chat-fab" onClick={()=>{setChatOpen(true);scrollTo("assistant")}}><MessageCircle size={22}/></button>}
    </div>
  );
}

export default App;
