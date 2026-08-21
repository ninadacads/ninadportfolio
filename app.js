const { useEffect, useMemo, useRef, useState } = React;

const METRICS = [
  ["55,000+", "broadcast hours"],
  ["2,000+", "live events"],
  ["99.9%", "operational uptime"],
  ["1.2M+", "peak concurrent viewers"],
  ["80+", "PCR / MCR / OB systems"],
  ["10–30+", "simultaneous streams"]
];

const CATEGORY_LABELS = {
  "Esports national championships and publisher events": "Publisher esports",
  "Esports televised and major productions": "Major productions",
  "Live sports and motorsport events": "Live sports",
  "College festivals and institutional events": "Institutional",
  "Broadcast infrastructure, OTT, and production projects": "Infrastructure",
  "Global, government, and corporate-related projects": "Global & corporate"
};

const Icon = ({ name }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/></>,
    grid: <><rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/></>,
    timeline: <><path d="M6 3v18"/><circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><path d="M10 7h10M10 17h10"/></>
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

const Logo = ({ event, large = false }) => event.logo ? (
  <img className={`event-logo${large ? " event-logo--large" : ""}`} src={event.logo} alt={`${event.eventName} logo`} loading="lazy" />
) : (
  <div className={`logo-fallback${large ? " logo-fallback--large" : ""}`} aria-hidden="true">
    {event.normalizedEventName.split(/\s+/).slice(0, 3).map(word => word[0]).join("")}
  </div>
);

const Header = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label="Ninad Yadav, home"><span>NY</span><strong>NINAD YADAV</strong></a>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-nav">Menu</button>
      <nav id="site-nav" className={open ? "nav-open" : ""} aria-label="Primary navigation">
        <a href="#featured" onClick={() => setOpen(false)}>Featured</a>
        <a href="#portfolio" onClick={() => setOpen(false)}>Events</a>
        <a href="#timeline" onClick={() => setOpen(false)}>Timeline</a>
        <a href="#sources" onClick={() => setOpen(false)}>Sources</a>
        <a className="nav-contact" href="mailto:ninad.acads@gmail.com">Contact</a>
      </nav>
    </header>
  );
};

const Hero = () => (
  <section className="hero" id="top">
    <div className="hero-signal" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
    <div className="hero-copy">
      <p className="eyebrow">Events portfolio / verified from resume</p>
      <h1>Broadcast<br/><em>under pressure.</em></h1>
      <p className="hero-intro">Ninad Yadav is a Media Systems Engineer, Senior Live Director and broadcast infrastructure strategist with 10+ years across esports, live sports, OTT and post-production operations.</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#portfolio">Explore events <Icon name="arrow" /></a>
        <a className="button button-ghost" href="mailto:ninad.acads@gmail.com">Discuss a production</a>
      </div>
    </div>
    <div className="hero-console" aria-label="Career operating profile">
      <div className="console-top"><span>LIVE OPS PROFILE</span><span className="live-indicator">VERIFIED</span></div>
      <div className="console-screen">
        <div className="scope"><span>01</span><p>Esports national championships</p></div>
        <div className="scope"><span>02</span><p>Televised & major productions</p></div>
        <div className="scope"><span>03</span><p>Live sports & motorsport</p></div>
        <div className="scope"><span>04</span><p>Broadcast infrastructure & OTT</p></div>
      </div>
      <div className="console-foot"><span>SDI / NDI / ST 2110</span><span>AES67 / DANTE</span><span>HLS / SRT / WEBRTC</span></div>
    </div>
  </section>
);

const Metrics = () => (
  <section className="metrics" aria-label="Verified career metrics">
    {METRICS.map(([value, label]) => <div className="metric" key={label}><strong>{value}</strong><span>{label}</span></div>)}
  </section>
);

const EventCard = ({ event, onOpen, featured = false }) => (
  <article className={`event-card${featured ? " event-card--featured" : ""}`} id={event.id}>
    <div className="card-head">
      <Logo event={event} />
      <div><span className="category-tag">{CATEGORY_LABELS[event.category]}</span><span className="year-tag">{event.year}</span></div>
    </div>
    <div className="card-body">
      <h3>{event.eventName}</h3>
      <p>{event.eventDescription}</p>
    </div>
    <div className="card-meta">
      <span><small>ROLE</small>{event.role}</span>
      <span><small>SCALE</small>{event.audienceOrScale}</span>
    </div>
    <button className="card-action" onClick={() => onOpen(event)} aria-label={`View details for ${event.eventName}`}>View case record <Icon name="arrow" /></button>
  </article>
);

const Featured = ({ events, onOpen }) => (
  <section id="featured" className="section-shell featured-section">
    <div className="section-heading">
      <div><p className="eyebrow">Selected control-room records</p><h2>Featured events</h2></div>
      <p>High-stakes productions selected for their scale, technical complexity or place in India's esports broadcast history.</p>
    </div>
    <div className="featured-rail">{events.filter(event => event.featured).slice(0, 6).map(event => <EventCard key={event.id} event={event} onOpen={onOpen} featured />)}</div>
  </section>
);

const Filters = ({ search, setSearch, category, setCategory, categories, view, setView, count }) => (
  <div className="filter-panel">
    <label className="search-box"><Icon name="search"/><span className="sr-only">Search events</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search event, role, location…" /></label>
    <div className="filter-row">
      <div className="chips" aria-label="Filter events by category">
        <button className={category === "All" ? "active" : ""} onClick={() => setCategory("All")}>All <span>{count.all}</span></button>
        {categories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{CATEGORY_LABELS[item]} <span>{count[item]}</span></button>)}
      </div>
      <div className="view-switch" aria-label="Portfolio view">
        <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view"><Icon name="grid"/></button>
        <button className={view === "timeline" ? "active" : ""} onClick={() => setView("timeline")} aria-label="Timeline view"><Icon name="timeline"/></button>
      </div>
    </div>
  </div>
);

const Timeline = ({ events, onOpen }) => (
  <div className="timeline-list" id="timeline">
    {events.map(event => <button className="timeline-item" key={event.id} onClick={() => onOpen(event)}>
      <span className="timeline-year">{event.year}</span><span className="timeline-dot"></span>
      <span className="timeline-copy"><small>{CATEGORY_LABELS[event.category]}</small><strong>{event.eventName}</strong><em>{event.organization}</em></span>
      <Icon name="arrow"/>
    </button>)}
  </div>
);

const EmptyState = ({ clear }) => <div className="empty-state"><span>NO SIGNAL</span><h3>No matching event records</h3><p>Try a broader event name or reset the active category.</p><button className="button button-primary" onClick={clear}>Reset filters</button></div>;

const Portfolio = ({ events, onOpen }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [view, setView] = useState("grid");
  const categories = [...new Set(events.map(event => event.category))];
  const count = { all: events.length };
  categories.forEach(item => count[item] = events.filter(event => event.category === item).length);
  const filtered = useMemo(() => events.filter(event => {
    const matchesCategory = category === "All" || event.category === category;
    const haystack = `${event.eventName} ${event.normalizedEventName} ${event.role} ${event.location} ${event.organization}`.toLowerCase();
    return matchesCategory && haystack.includes(search.toLowerCase().trim());
  }), [events, search, category]);
  const clear = () => { setSearch(""); setCategory("All"); };
  return (
    <section id="portfolio" className="section-shell portfolio-section">
      <div className="section-heading portfolio-heading"><div><p className="eyebrow">Complete event index</p><h2>Transmission log</h2></div><p>{filtered.length} verified or clearly marked event records. Unresolved dates and role mappings remain visible instead of being guessed.</p></div>
      <Filters {...{search, setSearch, category, setCategory, categories, view, setView, count}} />
      <p className="sr-only" aria-live="polite">{filtered.length} event records shown</p>
      {filtered.length === 0 ? <EmptyState clear={clear}/> : view === "grid" ? <div className="event-grid">{filtered.map(event => <EventCard key={event.id} event={event} onOpen={onOpen}/>)}</div> : <Timeline events={filtered} onOpen={onOpen}/>} 
    </section>
  );
};

const MediaWall = ({ events }) => {
  const withLogos = events.filter(event => event.logo).slice(0, 15);
  return (
    <section className="media-section section-shell">
      <div className="section-heading"><div><p className="eyebrow">Resume-provided assets</p><h2>Event signal wall</h2></div><p>Logos are reproduced from the supplied resume and used only to identify documented work. Brand ownership remains with each rights holder.</p></div>
      <div className="logo-wall">{withLogos.map(event => <a key={event.id} href={`#${event.id}`} title={event.eventName}><Logo event={event} large/><span>{event.normalizedEventName}</span></a>)}</div>
    </section>
  );
};

const Sources = ({ sources }) => (
  <section id="sources" className="sources-section section-shell">
    <div className="section-heading"><div><p className="eyebrow">Attribution & rights</p><h2>Source desk</h2></div><p>The supplied resume is the source of truth for participation and performance claims. Public links corroborate event identities; they do not expand Ninad's role.</p></div>
    <div className="source-grid">
      {sources.map(source => <article key={source.name}><span>{source.type}</span><h3>{source.name}</h3><p>{source.notes || source.rightsStatus}</p>{source.url && <a href={source.url} target="_blank" rel="noreferrer">Open source <Icon name="link"/></a>}</article>)}
    </div>
    <div className="rights-note"><strong>Media policy</strong><p>No third-party photographs or downloaded video files are hosted. Official channels and articles are link-only unless an official embed is explicitly available.</p></div>
  </section>
);

const DetailModal = ({ event, onClose }) => {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!event) return;
    const handler = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const focusable = [...document.querySelectorAll(".event-modal button, .event-modal a[href]")];
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handler);
    document.body.classList.add("modal-open");
    setTimeout(() => closeRef.current?.focus(), 0);
    return () => { document.removeEventListener("keydown", handler); document.body.classList.remove("modal-open"); };
  }, [event, onClose]);
  if (!event) return null;
  return (
    <div className="modal-backdrop" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close event details"><Icon name="close"/></button>
        <div className="modal-identity"><Logo event={event} large/><div><span className="category-tag">{CATEGORY_LABELS[event.category]}</span><h2 id="modal-title">{event.eventName}</h2><p>{event.year} · {event.location}</p></div></div>
        <div className="modal-layout">
          <div className="modal-main"><p className="modal-description">{event.eventDescription}</p><h3>Responsibilities</h3><ul>{event.responsibilities.map(item => <li key={item}>{item}</li>)}</ul>{event.achievements.length > 0 && <><h3>Verified outcomes</h3><ul>{event.achievements.map(item => <li key={item}>{item}</li>)}</ul></>}</div>
          <aside className="modal-facts"><div><small>ROLE</small><strong>{event.role}</strong></div><div><small>ORGANIZATION</small><strong>{event.organization}</strong></div><div><small>SCALE</small><strong>{event.audienceOrScale}</strong></div>{event.prizePool && <div><small>PRIZE POOL</small><strong>{event.prizePool}</strong></div>}<div><small>SOURCE CONFIDENCE</small><strong>{event.sourceConfidence}</strong></div><div><small>RIGHTS</small><strong>{event.rightsStatus}</strong></div></aside>
        </div>
        {(event.videoLinks.length > 0 || event.articleLinks.length > 0) && <div className="modal-links">{[...event.videoLinks, ...event.articleLinks].map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label}<Icon name="link"/></a>)}</div>}
        <p className="attribution">{event.attributionText}</p>
      </section>
    </div>
  );
};

const Footer = () => (
  <footer><div><p className="eyebrow">Available for broadcast engineering, live direction and infrastructure strategy</p><h2>Keep the signal clean.</h2></div><div className="footer-links"><a href="mailto:ninad.acads@gmail.com">ninad.acads@gmail.com</a><a href="https://www.linkedin.com/in/ninad4hire" target="_blank" rel="noreferrer">LinkedIn</a><span>Mumbai, India</span></div><p className="copyright">© 2026 Ninad Yadav · Content sourced from the supplied professional resume.</p></footer>
);

const Loading = () => <main><div className="loading-hero"></div><div className="loading-grid">{[1,2,3,4,5,6].map(item => <div key={item}></div>)}</div></main>;
const ErrorState = ({ retry }) => <main className="load-error"><span>DATA LINK ERROR</span><h1>The event index did not load.</h1><p>Check the local data files and retry the request.</p><button className="button button-primary" onClick={retry}>Retry</button></main>;

const App = () => {
  const [events, setEvents] = useState([]);
  const [sources, setSources] = useState([]);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("loading");
  const load = () => {
    setStatus("loading");
    Promise.all([fetch("src/data/events.json").then(r => { if (!r.ok) throw new Error(); return r.json(); }), fetch("src/data/sources.json").then(r => { if (!r.ok) throw new Error(); return r.json(); })])
      .then(([eventData, sourceData]) => { setEvents(eventData); setSources(sourceData); setStatus("ready"); })
      .catch(() => setStatus("error"));
  };
  useEffect(load, []);
  if (status === "loading") return <Loading/>;
  if (status === "error") return <ErrorState retry={load}/>;
  return <><Header/><main><Hero/><Metrics/><Featured events={events} onOpen={setSelected}/><Portfolio events={events} onOpen={setSelected}/><MediaWall events={events}/><Sources sources={sources}/></main><Footer/><DetailModal event={selected} onClose={() => setSelected(null)}/></>;
};

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
