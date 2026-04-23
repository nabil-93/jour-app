import React from 'react';
import { 
  JOUR_COLORS, FONT_DISPLAY, FONT_BODY, FONT_MONO,
  JourHeader, Card, SectionLabel, Ring, Check, Pill, StatBlock
} from './screens';
import { IOSDevice } from './ios-frame';

const LS_KEY = 'tag-app-v3';

const DEFAULT_STATE = {
  userName: '',
  currentDate: new Date().toISOString().split('T')[0],
  history: {}, 
  checklist: [
    { label: '5 km laufen', done: false },
    { label: 'Ausgewogenes Frühstück', done: false },
    { label: '2 L Wasser trinken', done: false },
    { label: 'Krafttraining (45 Min.)', done: false },
    { label: '15 Min. lesen', done: false },
    { label: 'Vor 23 Uhr schlafen', done: false },
  ],
  selectedMeals: [],
  mealNote: '',
  journalText: '',
  mood: null,
  streak: 12,
};

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if (!s) return DEFAULT_STATE;
    
    const today = new Date().toISOString().split('T')[0];
    if (s.currentDate !== today) {
      const done = (s.checklist || []).filter(c => c.done).length;
      const score = Math.round((done / (s.checklist?.length || 6)) * 100);
      const newHistory = { ...(s.history || {}), [s.currentDate]: score };
      const newStreak = score > 50 ? (s.streak || 0) + 1 : s.streak;

      return { 
        ...DEFAULT_STATE, 
        history: newHistory, 
        currentDate: today,
        streak: newStreak
      };
    }
    
    return { ...DEFAULT_STATE, ...s };
  } catch { return DEFAULT_STATE; }
}
function saveState(s) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {}
}

// ─── Bottom nav ────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: 'home',     label: 'Start',       icon: 'home' },
  { id: 'meal',     label: 'Essen',       icon: 'meal' },
  { id: 'sport',    label: 'Sport',       icon: 'sport' },
  { id: 'journal',  label: 'Journal',     icon: 'journal' },
  { id: 'diagnostic', label: 'Score',     icon: 'score' },
  { id: 'dashboard', label: 'Progrès',    icon: 'chart' },
];

function NavIcon({ name, color }) {
  const sw = 1.8;
  const p = { stroke: color, strokeWidth: sw, fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':
      return <svg width="22" height="22" viewBox="0 0 22 22"><path {...p} d="M3 10l8-7 8 7v9a1 1 0 01-1 1h-4v-6H8v6H4a1 1 0 01-1-1v-9z"/></svg>;
    case 'meal':
      return <svg width="22" height="22" viewBox="0 0 22 22"><path {...p} d="M6 3v7a3 3 0 006 0V3M9 3v18M15 3c-1 2-1 4 0 7v11"/></svg>;
    case 'sport':
      return <svg width="22" height="22" viewBox="0 0 22 22"><path {...p} d="M3 9v4M5 8v6M19 8v6M17 9v4M5 11h14"/></svg>;
    case 'journal':
      return <svg width="22" height="22" viewBox="0 0 22 22"><path {...p} d="M5 3h10l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1zM8 9h7M8 13h7M8 17h5"/></svg>;
    case 'score':
      return <svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" {...p}/><path {...p} d="M7 11l3 3 5-6"/></svg>;
    case 'chart':
      return <svg width="22" height="22" viewBox="0 0 22 22"><path {...p} d="M3 19h16M6 15V9M10 15V5M14 15v-4M18 15V7"/></svg>;
    default:
      return null;
  }
}

function BottomNav({ active, onNav }) {
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      paddingBottom: 28, paddingTop: 10, paddingLeft: 8, paddingRight: 8,
      background: 'rgba(245,241,234,0.88)',
      backdropFilter: 'blur(16px) saturate(180%)',
      WebkitBackdropFilter: 'blur(16px) saturate(180%)',
      borderTop: `1px solid ${JOUR_COLORS.line}`,
      display: 'flex', justifyContent: 'space-around',
      zIndex: 100,
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = active === item.id;
        const color = isActive ? JOUR_COLORS.ink : JOUR_COLORS.sub;
        return (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            flex: 1, background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 4px', borderRadius: 12,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color, fontFamily: FONT_BODY,
          }}>
            <div style={{
              width: 36, height: 24, borderRadius: 12,
              background: isActive ? JOUR_COLORS.accentSoft : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 160ms',
            }}>
              <NavIcon name={item.icon} color={isActive ? JOUR_COLORS.accent : color}/>
            </div>
            <span style={{ fontSize: 10, letterSpacing: 0.2 }}>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Interactive wrappers ──────────────────────────────────────────────────

function InteractiveHome({ state, setState, onNav }) {
  const toggle = (i) => {
    const list = state.checklist.map((c, j) => j === i ? { ...c, done: !c.done } : c);
    setState({ ...state, checklist: list });
  };
  const done = state.checklist.filter(c => c.done).length;
  const total = state.checklist.length;
  const prog = done / total;

  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%' }}>
      <TagHeader greeting={state.userName ? `Guten Morgen, ${state.userName}` : 'Guten Morgen'} />
      <div style={{ padding: '0 22px 120px', fontFamily: FONT_BODY }}>
        <div style={{
          color: JOUR_COLORS.sub, fontSize: 15, marginTop: -8, marginBottom: 18,
        }}>Guten Tag — {total} Dinge für dich</div>

        <Card pad={20} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring size={108} stroke={10} progress={prog} color={JOUR_COLORS.accent}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, color: JOUR_COLORS.ink }}>
                  {Math.round(prog * 100)}%
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em',
                  color: JOUR_COLORS.sub, textTransform: 'uppercase', marginTop: 4 }}>score</div>
              </div>
            </Ring>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, lineHeight: 1.1, color: JOUR_COLORS.ink }}>
                {done} / {total}
              </div>
              <div style={{ fontSize: 13, color: JOUR_COLORS.sub, marginTop: 4, lineHeight: 1.35 }}>
                Ziele heute erreicht
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <Pill color={JOUR_COLORS.accentSoft} text={JOUR_COLORS.accent}>
                  🔥 {state.streak} T. Serie
                </Pill>
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          <TapMetric label="Essen" value={state.selectedMeals.length} accent={JOUR_COLORS.coral}
            onClick={() => onNav('meal')} />
          <TapMetric label="Sport" value={done >= 4 ? '45\u2032' : '0\u2032'} accent={JOUR_COLORS.accent}
            onClick={() => onNav('sport')} />
          <TapMetric label="Score" value={`${Math.round(prog*100)}`} accent={JOUR_COLORS.lilac}
            onClick={() => onNav('diagnostic')} />
        </div>

        <SectionLabel>Heute abhaken</SectionLabel>
        <Card pad={0}>
          {state.checklist.map((c, i) => (
            <TapChecklistRow key={i} label={c.label} done={c.done}
              isLast={i === state.checklist.length - 1}
              onClick={() => toggle(i)}/>
          ))}
        </Card>
      </div>
    </div>
  );
}

function TapMetric({ label, value, accent, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: JOUR_COLORS.card, borderRadius: 18, padding: '12px 12px',
      boxShadow: '0 1px 0 rgba(26,24,21,0.04)',
      border: 'none', cursor: 'pointer', textAlign: 'left',
      fontFamily: FONT_BODY, transition: 'transform 120ms',
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em',
        color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 26, lineHeight: 1.1,
        color: JOUR_COLORS.ink, marginTop: 4, letterSpacing: '-0.01em',
      }}>{value}</div>
      <div style={{ height: 3, width: 24, borderRadius: 2, background: accent, marginTop: 8 }} />
    </button>
  );
}

function TapChecklistRow({ label, done, isLast, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '14px 16px', width: '100%',
      background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      borderBottom: isLast ? 'none' : `1px solid ${JOUR_COLORS.line}`,
      fontFamily: FONT_BODY,
    }}>
      <Check on={done} />
      <div style={{
        flex: 1, fontSize: 15,
        color: done ? JOUR_COLORS.sub : JOUR_COLORS.ink,
        textDecoration: done ? 'line-through' : 'none',
      }}>{label}</div>
    </button>
  );
}

function InteractiveMeal({ state, setState }) {
  const foods = [
    { name: 'Avocado-Toast', kcal: 320, tag: 'Frühstück', color: JOUR_COLORS.accentSoft },
    { name: '3-Eier-Omelett', kcal: 290, tag: 'Protein', color: JOUR_COLORS.coralSoft },
    { name: 'Quinoa-Salat', kcal: 420, tag: 'Mittagessen', color: JOUR_COLORS.lilacSoft },
    { name: 'Hähnchen + Reis', kcal: 560, tag: 'Mittagessen', color: JOUR_COLORS.accentSoft },
    { name: 'Joghurt + Früchte', kcal: 180, tag: 'Snack', color: JOUR_COLORS.coralSoft },
  ];
  const toggle = (i) => {
    const sel = state.selectedMeals.includes(i)
      ? state.selectedMeals.filter(x => x !== i)
      : [...state.selectedMeals, i];
    setState({ ...state, selectedMeals: sel });
  };
  const totalKcal = state.selectedMeals.reduce((a, i) => a + foods[i].kcal, 0);

  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 120 }}>
      <div style={{ padding: '70px 22px 14px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>Mittagessen · 13:24</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 8,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>Was hast du gegessen?</div>
        {totalKcal > 0 && (
          <div style={{ marginTop: 10, fontSize: 13, color: JOUR_COLORS.sub }}>
            <span style={{ color: JOUR_COLORS.coral, fontWeight: 500 }}>{totalKcal} kcal</span> ausgewählt
          </div>
        )}
      </div>
      <div style={{ padding: '0 22px' }}>
        <Card pad={0}>
          {foods.map((f, i) => {
            const isOn = state.selectedMeals.includes(i);
            return (
              <button key={i} onClick={() => toggle(i)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', width: '100%',
                background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                borderBottom: i === foods.length - 1 ? 'none' : `1px solid ${JOUR_COLORS.line}`,
                fontFamily: FONT_BODY,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12, background: f.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: FONT_DISPLAY, fontSize: 18, color: JOUR_COLORS.ink,
                }}>{f.name.charAt(0)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, color: JOUR_COLORS.ink }}>{f.name}</div>
                  <div style={{ fontSize: 12, color: JOUR_COLORS.sub, marginTop: 2 }}>
                    {f.kcal} kcal · {f.tag}
                  </div>
                </div>
                <Check on={isOn} color={JOUR_COLORS.coral} />
              </button>
            );
          })}
        </Card>

        <div style={{ marginTop: 14 }}>
          <SectionLabel>Schnelle Notiz</SectionLabel>
          <Card pad={14}>
            <textarea
              value={state.mealNote}
              onChange={e => setState({ ...state, mealNote: e.target.value })}
              placeholder="Ein paar Worte zum Essen…"
              style={{
                width: '100%', border: 'none', outline: 'none',
                background: 'transparent', resize: 'none',
                fontFamily: FONT_BODY, fontSize: 14, color: JOUR_COLORS.ink,
                minHeight: 50, lineHeight: 1.4,
              }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

function InteractiveSport({ state, setState }) {
  const [sec, setSec] = React.useState(() => {
    const raw = localStorage.getItem('jour-sport-sec');
    return raw ? parseInt(raw, 10) : 24 * 60 + 18;
  });
  const [running, setRunning] = React.useState(false);
  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setSec(s => {
        const n = s + 1;
        try { localStorage.setItem('jour-sport-sec', String(n)); } catch {}
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  const kcal = Math.round(sec * 0.2 + 180);

  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 120 }}>
      <div style={{ padding: '70px 22px 14px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3,
            background: running ? JOUR_COLORS.coral : JOUR_COLORS.sub,
            boxShadow: running ? `0 0 0 4px oklch(72% 0.15 40 / 0.25)` : 'none',
          }} />
          {running ? 'aktiv' : 'pause'}
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 8,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>Krafttraining</div>
      </div>

      <div style={{ padding: '0 22px' }}>
        <Card pad={22} style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.16em',
            color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>Dauer</div>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 68, lineHeight: 1,
            color: JOUR_COLORS.ink, marginTop: 6, letterSpacing: '-0.02em',
            fontVariantNumeric: 'tabular-nums',
          }}>{mm}:{ss}</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 10 }}>
            <StatBlock label="♥ bpm" value={142} color={JOUR_COLORS.coral} />
            <StatBlock label="kcal" value={kcal} color={JOUR_COLORS.amber} />
            <StatBlock label="Sätze" value={3} color={JOUR_COLORS.accent} />
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
            <button onClick={() => setRunning(r => !r)} style={{
              flex: 1, padding: '14px 0', borderRadius: 14, border: 'none',
              background: running ? JOUR_COLORS.ink : JOUR_COLORS.accent, color: '#fff',
              fontFamily: FONT_BODY, fontSize: 15, fontWeight: 500, cursor: 'pointer',
            }}>{running ? 'Pause' : 'Fortsetzen'}</button>
            <button onClick={() => { setSec(0); setRunning(false); }} style={{
              padding: '14px 18px', borderRadius: 14,
              border: `1px solid ${JOUR_COLORS.line}`, background: 'transparent',
              color: JOUR_COLORS.ink, fontFamily: FONT_BODY, fontSize: 15, cursor: 'pointer',
            }}>Reset</button>
          </div>
        </Card>

        <SectionLabel>Aktuelle Übung</SectionLabel>
        <Card pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14, background: JOUR_COLORS.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="1" y="8" width="2" height="4" rx="1" fill={JOUR_COLORS.accent}/>
                <rect x="4" y="6" width="2" height="8" rx="1" fill={JOUR_COLORS.accent}/>
                <rect x="7" y="9" width="6" height="2" rx="0.5" fill={JOUR_COLORS.accent}/>
                <rect x="14" y="6" width="2" height="8" rx="1" fill={JOUR_COLORS.accent}/>
                <rect x="17" y="8" width="2" height="4" rx="1" fill={JOUR_COLORS.accent}/>
              </svg>
            </div>
            <div style={{ flex: 1, fontFamily: FONT_BODY }}>
              <div style={{ fontSize: 16, color: JOUR_COLORS.ink }}>Bankdrücken</div>
              <div style={{ fontSize: 12, color: JOUR_COLORS.sub, marginTop: 2 }}>
                Satz 3 · 10 Wdh. · 60 kg
              </div>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: JOUR_COLORS.ink }}>10</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InteractiveJournal({ state, setState }) {
  const moods = [
    { emoji: '🙂', label: 'gut' },
    { emoji: '😌', label: 'ruhig' },
    { emoji: '😤', label: 'stark' },
    { emoji: '😴', label: 'müde' },
  ];
  const todayStr = new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: 'long' }).format(new Date());
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 120 }}>
      <div style={{ padding: '70px 22px 14px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>{todayStr} · Abend</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 8,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>Was hast du heute gemacht?</div>
      </div>
      <div style={{ padding: '0 22px' }}>
        <Card pad={18} style={{ minHeight: 180 }}>
          <textarea
            value={state.journalText}
            onChange={e => setState({ ...state, journalText: e.target.value })}
            placeholder="Fang mit einem Wort an…"
            style={{
              width: '100%', border: 'none', outline: 'none',
              background: 'transparent', resize: 'none',
              fontFamily: FONT_DISPLAY, fontSize: 22, color: JOUR_COLORS.ink,
              minHeight: 160, lineHeight: 1.35,
            }}
          />
        </Card>

        <div style={{ marginTop: 18 }}>
          <SectionLabel>Abendstimmung</SectionLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {moods.map((m, i) => (
              <button key={i} onClick={() => setState({ ...state, mood: i === state.mood ? null : i })} style={{
                flex: 1, background: state.mood === i ? JOUR_COLORS.accentSoft : JOUR_COLORS.card,
                border: state.mood === i ? `1.5px solid ${JOUR_COLORS.accent}` : `1px solid ${JOUR_COLORS.line}`,
                borderRadius: 16, padding: '14px 4px', textAlign: 'center', cursor: 'pointer',
                fontFamily: FONT_BODY, transition: 'all 160ms',
              }}>
                <div style={{ fontSize: 22 }}>{m.emoji}</div>
                <div style={{ fontSize: 11, color: JOUR_COLORS.sub, marginTop: 4 }}>{m.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractiveDiagnostic({ state }) {
  const done = state.checklist.filter(c => c.done).length;
  const total = state.checklist.length;
  const prog = done / total;
  const score = Math.round(prog * 100);
  const verdict =
    score >= 85 ? 'Schöner Tag' :
    score >= 60 ? 'Guter Tag' :
    score >= 30 ? 'In Ordnung' :
    'Morgen wird besser';
  const cats = [
    { name: 'Ernährung', pct: Math.min(1, state.selectedMeals.length / 3), color: JOUR_COLORS.coral },
    { name: 'Sport', pct: state.checklist[3]?.done ? 0.95 : 0.2, color: JOUR_COLORS.accent },
    { name: 'Mental', pct: state.journalText.length > 10 ? 0.9 : 0.4, color: JOUR_COLORS.lilac },
    { name: 'Schlaf', pct: state.checklist[5]?.done ? 0.9 : 0.5, color: JOUR_COLORS.amber },
  ];
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 120 }}>
      <div style={{ padding: '70px 22px 8px', fontFamily: FONT_BODY, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>Tagesdiagnose</div>
      </div>
      <div style={{ padding: '18px 22px 0', display: 'flex', justifyContent: 'center' }}>
        <Ring size={236} stroke={14} progress={prog} color={JOUR_COLORS.accent}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 96, lineHeight: 1,
              color: JOUR_COLORS.ink, letterSpacing: '-0.03em' }}>{score}</div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.2em',
              color: JOUR_COLORS.sub, textTransform: 'uppercase', marginTop: 6 }}>von 100</div>
          </div>
        </Ring>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14, padding: '0 32px' }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, lineHeight: 1.15,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>{verdict}</div>
        <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: JOUR_COLORS.sub,
          marginTop: 8, lineHeight: 1.45 }}>
          Du hast {done} / {total} Ziele erreicht.
        </div>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        <Card pad={18}>
          {cats.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', fontFamily: FONT_BODY }}>
              <div style={{ width: 72, fontSize: 12, color: JOUR_COLORS.sub }}>{c.name}</div>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: JOUR_COLORS.line,
                position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${c.pct * 100}%`, background: c.color, borderRadius: 3,
                  transition: 'width 400ms cubic-bezier(.2,.7,.2,1)',
                }}/>
              </div>
              <div style={{ width: 34, textAlign: 'right',
                fontFamily: FONT_DISPLAY, fontSize: 18, color: JOUR_COLORS.ink }}>
                {Math.round(c.pct * 100)}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function InteractiveDashboard({ state }) {
  const done = state.checklist.filter(c => c.done).length;
  const todayScore = Math.round((done / state.checklist.length) * 100);
  
  const now = new Date();
  const currentDayIdx = (now.getDay() + 6) % 7; 
  
  const week = Array.from({ length: 7 }).map((_, i) => {
    if (i === currentDayIdx) return todayScore;
    const d = new Date();
    d.setDate(now.getDate() - (currentDayIdx - i));
    const dStr = d.toISOString().split('T')[0];
    return state.history[dStr] || 0;
  });
  
  const avg = Math.round(week.reduce((a,b)=>a+b,0)/week.length);
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const monthStr = new Intl.DateTimeFormat('de-DE', { month: 'long' }).format(now);

  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 120 }}>
      <div style={{ padding: '70px 22px 10px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>Woche · {monthStr}</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 8,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>Dein Fortschritt</div>
      </div>
      <div style={{ padding: '0 22px' }}>
        <Card pad={18}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 18 }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 56, lineHeight: 1,
              color: JOUR_COLORS.ink, letterSpacing: '-0.02em' }}>{avg}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: JOUR_COLORS.sub }}>
              Durchschnitt<br/>diese Woche
            </div>
            <div style={{ flex: 1 }}/>
            <Pill color={JOUR_COLORS.accentSoft} text={JOUR_COLORS.accent}>+ 8 %</Pill>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, padding: '0 4px' }}>
            {week.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div style={{
                    width: '100%', height: `${Math.max(4,(v/100)*100)}%`,
                    background: i === currentDayIdx ? JOUR_COLORS.accent : 'oklch(66% 0.16 145 / 0.35)',
                    borderRadius: '6px 6px 2px 2px',
                    transition: 'height 400ms',
                  }}/>
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10,
                  color: i === currentDayIdx ? JOUR_COLORS.ink : JOUR_COLORS.sub }}>
                  {days[i]}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Card pad={16}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em',
              color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>Serie</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 36, color: JOUR_COLORS.ink,
                letterSpacing: '-0.02em' }}>{state.streak}</div>
              <div style={{ fontSize: 13, color: JOUR_COLORS.sub, fontFamily: FONT_BODY }}>Tage</div>
            </div>
            <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 14, borderRadius: 3,
                  background: JOUR_COLORS.accent, opacity: 0.35 + (i / 11) * 0.65 }}/>
              ))}
            </div>
          </Card>
          <Card pad={16}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em',
              color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>Bester Tag</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: JOUR_COLORS.ink,
              marginTop: 6, letterSpacing: '-0.01em' }}>Freitag</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: JOUR_COLORS.sub, marginTop: 4 }}>
              Alles erreicht · 90 / 100
            </div>
          </Card>
        </div>

        <div style={{ marginTop: 12 }}>
          <Card pad={16}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em',
              color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>Was wir bemerkt haben</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, lineHeight: 1.3,
              color: JOUR_COLORS.ink, marginTop: 8, letterSpacing: '-0.005em' }}>
              Deine Morgeneinheiten geben dir + 22 % Score.
            </div>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10, color: JOUR_COLORS.sub, opacity: 0.5 }}>
            Version 2.1 — Refreshed
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Phone shell with routing ──────────────────────────────────────────────

function WelcomeScreen({ onSave }) {
  const [name, setName] = React.useState('');
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: JOUR_COLORS.paper, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 40,
      textAlign: 'center', fontFamily: FONT_BODY
    }}>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 42, color: JOUR_COLORS.ink, marginBottom: 12 }}>Willkommen</div>
      <div style={{ fontSize: 16, color: JOUR_COLORS.sub, marginBottom: 32 }}>Wie dürfen wir dich nennen?</div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Dein Name"
        style={{
          width: '100%', padding: '16px 20px', borderRadius: 16,
          border: `1.5px solid ${JOUR_COLORS.line}`, background: JOUR_COLORS.card,
          fontSize: 18, fontFamily: FONT_BODY, textAlign: 'center',
          outline: 'none', color: JOUR_COLORS.ink, marginBottom: 24,
        }}
      />
      <button
        onClick={() => name.trim() && onSave(name.trim())}
        style={{
          width: '100%', padding: '16px', borderRadius: 16,
          background: name.trim() ? JOUR_COLORS.ink : JOUR_COLORS.line,
          color: '#fff', fontSize: 16, fontWeight: 500, border: 'none',
          cursor: name.trim() ? 'pointer' : 'default', transition: 'all 200ms'
        }}
      >
        Starten
      </button>
    </div>
  );
}

function InstallPrompt() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    // Detect if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    if (!isStandalone && window.innerWidth < 500) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 12, left: 12, right: 12, zIndex: 9999,
      background: 'rgba(26,24,21,0.95)', color: '#f5f1ea',
      padding: '12px 16px', borderRadius: 16, fontSize: 13,
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(8px)',
      fontFamily: FONT_BODY,
    }}>
      <div style={{ flex: 1 }}>
        <b>App installieren:</b> Klick auf <span style={{ color: JOUR_COLORS.accent }}>Teilen</span> und dann auf <span style={{ color: JOUR_COLORS.accent }}>„Zum Home-Bildschirm“</span>
      </div>
      <button onClick={() => setShow(false)} style={{
        background: 'none', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer'
      }}>×</button>
    </div>
  );
}

function PhoneApp({ initial = 'home', label }) {
  // Force refresh on new PWA version
  React.useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          });
        });
      });
    }
  }, []);

  const [state, setState] = React.useState(loadState);
  const [screen, setScreen] = React.useState(initial);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 500);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 500);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const update = (next) => {
    setState(next);
    saveState(next);
  };

  // State sync logic
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY && e.newValue) {
        try { setState(JSON.parse(e.newValue)); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    const id = setInterval(() => {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        setState(prev => JSON.stringify(prev) === raw ? prev : parsed);
      } catch {}
    }, 400);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(id);
    };
  }, []);

  let body;
  switch (screen) {
    case 'home': body = <InteractiveHome state={state} setState={update} onNav={setScreen}/>; break;
    case 'meal': body = <InteractiveMeal state={state} setState={update}/>; break;
    case 'sport': body = <InteractiveSport state={state} setState={update}/>; break;
    case 'journal': body = <InteractiveJournal state={state} setState={update}/>; break;
    case 'diagnostic': body = <InteractiveDiagnostic state={state}/>; break;
    case 'dashboard': body = <InteractiveDashboard state={state}/>; break;
    default: body = null;
  }

  const appContent = (
    <div style={{ height: '100%', position: 'relative', background: JOUR_COLORS.paper }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'auto' }}>
        {body}
      </div>
      <BottomNav active={screen} onNav={setScreen}/>
    </div>
  );

  if (isMobile) {
    return <div style={{ position: 'fixed', inset: 0 }}>{appContent}</div>;
  }

  return (
    <div style={{ position: 'relative' }} data-screen-label={label || screen}>
      {!state.userName && <WelcomeScreen onSave={(name) => update({ ...state, userName: name })} />}
      <InstallPrompt />
      <IOSDevice width={390} height={844}>
        {appContent}
      </IOSDevice>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(ellipse 100% 60% at 50% -10%, oklch(94% 0.02 70), oklch(88% 0.015 60) 60%, oklch(82% 0.015 50) 100%)'
    }}>
      <InstallPrompt />
      <PhoneApp />
    </div>
  );
}
