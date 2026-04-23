import React from 'react';

export const JOUR_COLORS = {
  paper: '#f5f1ea',
  ink: '#1a1815',
  sub: '#6b6458',
  line: 'rgba(26,24,21,0.08)',
  card: '#ffffff',
  accent: 'oklch(66% 0.16 145)',
  accentSoft: 'oklch(92% 0.05 145)',
  coral: 'oklch(72% 0.15 40)',
  coralSoft: 'oklch(94% 0.04 40)',
  lilac: 'oklch(70% 0.11 280)',
  lilacSoft: 'oklch(94% 0.03 280)',
  amber: 'oklch(80% 0.13 75)',
};

export const FONT_DISPLAY = '"Instrument Serif", "Times New Roman", serif';
export const FONT_BODY = '"Geist", -apple-system, system-ui, sans-serif';
export const FONT_MONO = '"Geist Mono", "JetBrains Mono", ui-monospace, monospace';

// ── Atome ────────────────────────────────────────────────────

export function TagHeader({ date, greeting = 'Guten Morgen' }) {
  const displayDate = date || new Intl.DateTimeFormat('de-DE', { weekday: 'short', day: '2-digit', month: 'long' }).format(new Date());
  return (
    <div style={{ padding: '70px 22px 18px', fontFamily: FONT_BODY }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
        textTransform: 'uppercase', color: JOUR_COLORS.sub }}>{displayDate}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, lineHeight: 1,
        color: JOUR_COLORS.ink, marginTop: 10, letterSpacing: '-0.01em' }}>{greeting}</div>
    </div>
  );
}

export function Card({ children, style = {}, pad = 18 }) {
  return (
    <div style={{
      background: JOUR_COLORS.card, borderRadius: 22, padding: pad,
      boxShadow: '0 1px 0 rgba(26,24,21,0.04), 0 6px 24px -10px rgba(26,24,21,0.12)',
      ...style,
    }}>{children}</div>
  );
}

export function SectionLabel({ children, accent }) {
  return (
    <div style={{
      fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: accent || JOUR_COLORS.sub, marginBottom: 10,
    }}>{children}</div>
  );
}

export function Ring({ size = 120, stroke = 10, progress = 0.7, color = JOUR_COLORS.accent, track = JOUR_COLORS.line, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${dash} ${c}`} strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

export function Check({ on, color = JOUR_COLORS.accent, size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size/2,
      border: on ? `1.5px solid ${color}` : `1.5px solid ${JOUR_COLORS.line}`,
      background: on ? color : 'transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'all 220ms cubic-bezier(.2,.7,.2,1)', flexShrink: 0,
    }}>
      {on && (
        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
          <path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

export function Pill({ children, color, text }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '5px 10px', borderRadius: 999,
      background: color, color: text,
      fontSize: 12, fontWeight: 500, fontFamily: FONT_BODY,
    }}>{children}</div>
  );
}

export function Flame() {
  return (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
      <path d="M5 1c0 2-3 3-3 6a3 3 0 106 0c0-1-.5-1.5-1-2 .5 2-1 2.5-1.5 1.5C5 5 5 3 5 1z" fill="currentColor"/>
    </svg>
  );
}

export function MiniMetric({ label, value, accent, small }) {
  return (
    <div style={{
      background: JOUR_COLORS.card, borderRadius: 18, padding: '12px 12px',
      boxShadow: '0 1px 0 rgba(26,24,21,0.04)', fontFamily: FONT_BODY,
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em',
        color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>{label}</div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: small ? 22 : 26, lineHeight: 1.1,
        color: JOUR_COLORS.ink, marginTop: 4, letterSpacing: '-0.01em',
      }}>{value}</div>
      <div style={{ height: 3, width: 24, borderRadius: 2, background: accent, marginTop: 8 }} />
    </div>
  );
}

export function ChecklistRow({ label, done, isLast }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: isLast ? 'none' : `1px solid ${JOUR_COLORS.line}`,
      fontFamily: FONT_BODY,
    }}>
      <Check on={done} />
      <div style={{
        flex: 1, fontSize: 15,
        color: done ? JOUR_COLORS.sub : JOUR_COLORS.ink,
        textDecoration: done ? 'line-through' : 'none',
        textDecorationColor: JOUR_COLORS.sub,
      }}>{label}</div>
    </div>
  );
}

export function StatBlock({ label, value, color }) {
  return (
    <div style={{
      flex: 1, padding: '10px 6px', borderRadius: 14,
      background: JOUR_COLORS.paper, fontFamily: FONT_BODY,
    }}>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em',
        color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: JOUR_COLORS.ink, marginTop: 4 }}>
        {value}
      </div>
    </div>
  );
}

export function HeartLine() {
  return (
    <svg width="100%" height="56" viewBox="0 0 300 56" preserveAspectRatio="none" style={{ marginTop: 4 }}>
      <path d="M0 28 L40 28 L50 28 L58 14 L66 42 L74 10 L82 28 L120 28 L128 22 L136 34 L144 28 L200 28 L208 16 L216 40 L224 28 L300 28"
        stroke={JOUR_COLORS.coral} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ── 1) Startseite ─────────────────────────────────────────

export function HomeScreen({
  checklist = [
    { label: '5 km laufen', done: false },
    { label: 'Ausgewogenes Frühstück', done: false },
    { label: '2 L Wasser trinken', done: false },
    { label: 'Krafttraining (45 Min.)', done: false },
    { label: '15 Min. lesen', done: false },
    { label: 'Vor 23 Uhr schlafen', done: false },
  ],
  ringProgress = 0, ringLabel = '0%',
  mealCount = 0, workoutMinutes = 0, stepsCount = 0, streak = 12,
  subLine = 'Guten Tag — 6 Dinge für dich',
}) {
  const done = checklist.filter(c => c.done).length;
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 100 }}>
      <JourHeader />
      <div style={{ padding: '0 22px', fontFamily: FONT_BODY }}>
        <div style={{ color: JOUR_COLORS.sub, fontSize: 15, marginTop: -8, marginBottom: 18 }}>{subLine}</div>

        <Card pad={20} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Ring size={108} stroke={10} progress={ringProgress} color={JOUR_COLORS.accent}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, color: JOUR_COLORS.ink }}>
                  {ringLabel}
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 9, letterSpacing: '0.14em',
                  color: JOUR_COLORS.sub, textTransform: 'uppercase', marginTop: 4 }}>score</div>
              </div>
            </Ring>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, lineHeight: 1.1, color: JOUR_COLORS.ink }}>
                {done} / {checklist.length}
              </div>
              <div style={{ fontSize: 13, color: JOUR_COLORS.sub, marginTop: 4, lineHeight: 1.35 }}>
                Ziele heute erreicht
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                <Pill color={JOUR_COLORS.accentSoft} text={JOUR_COLORS.accent}>
                  <Flame /> {streak} T. Serie
                </Pill>
              </div>
            </div>
          </div>
        </Card>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          <MiniMetric label="Essen" value={mealCount} accent={JOUR_COLORS.coral} />
          <MiniMetric label="Sport" value={`${workoutMinutes}\u2032`} accent={JOUR_COLORS.accent} />
          <MiniMetric label="Schritte" value={stepsCount.toLocaleString('de-DE')} accent={JOUR_COLORS.lilac} small />
        </div>

        <SectionLabel>Heute abhaken</SectionLabel>
        <Card pad={0}>
          {checklist.map((c, i) => (
            <ChecklistRow key={i} label={c.label} done={c.done} isLast={i === checklist.length - 1} />
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── 2) Mahlzeiten ─────────────────────────────────────────

export function MealScreen({ selected = [], note = '' }) {
  const foods = [
    { name: 'Avocado-Toast', kcal: 320, tag: 'Frühstück', color: JOUR_COLORS.accentSoft },
    { name: '3-Eier-Omelett', kcal: 290, tag: 'Protein', color: JOUR_COLORS.coralSoft },
    { name: 'Quinoa-Salat', kcal: 420, tag: 'Mittagessen', color: JOUR_COLORS.lilacSoft },
    { name: 'Hähnchen + Reis', kcal: 560, tag: 'Mittagessen', color: JOUR_COLORS.accentSoft },
    { name: 'Joghurt + Früchte', kcal: 180, tag: 'Snack', color: JOUR_COLORS.coralSoft },
  ];
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 80 }}>
      <div style={{ padding: '70px 22px 14px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>Mittagessen · 13:24</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 8,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>Was hast du gegessen?</div>
      </div>
      <div style={{ padding: '0 22px' }}>
        <Card pad={0}>
          {foods.map((f, i) => {
            const isOn = selected.includes(i);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
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
              </div>
            );
          })}
        </Card>
        <div style={{ marginTop: 14 }}>
          <SectionLabel>Schnelle Notiz</SectionLabel>
          <Card pad={14}>
            <div style={{ fontFamily: FONT_BODY, fontSize: 14, color: JOUR_COLORS.ink, minHeight: 38, lineHeight: 1.4 }}>
              {note || <span style={{ color: JOUR_COLORS.sub }}>Ein paar Worte zum Essen…</span>}
              {note && <span style={{ display: 'inline-block', width: 2, height: 15,
                background: JOUR_COLORS.ink, marginLeft: 1, verticalAlign: 'middle' }}/>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── 3) Sport ──────────────────────────────────────────────

export function SportScreen({ elapsed = '24:18', heartRate = 142, calories = 285, sets = 3, currentExercise = 'Bankdrücken', pulseScale = 1 }) {
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 60 }}>
      <div style={{ padding: '70px 22px 14px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 3, background: JOUR_COLORS.coral,
            transform: `scale(${pulseScale})`, boxShadow: `0 0 0 4px oklch(72% 0.15 40 / ${0.25 * (2 - pulseScale)})` }} />
          läuft
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
          }}>{elapsed}</div>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 10 }}>
            <StatBlock label="♥ bpm" value={heartRate} color={JOUR_COLORS.coral} />
            <StatBlock label="kcal" value={calories} color={JOUR_COLORS.amber} />
            <StatBlock label="Sätze" value={sets} color={JOUR_COLORS.accent} />
          </div>
        </Card>
        <SectionLabel>Aktuelle Übung</SectionLabel>
        <Card pad={16}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 14,
              background: JOUR_COLORS.accentSoft,
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
              <div style={{ fontSize: 16, color: JOUR_COLORS.ink }}>{currentExercise}</div>
              <div style={{ fontSize: 12, color: JOUR_COLORS.sub, marginTop: 2 }}>
                Satz {sets} · 10 Wdh. · 60 kg
              </div>
            </div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 28, color: JOUR_COLORS.ink }}>10</div>
          </div>
        </Card>
        <div style={{ marginTop: 14 }}>
          <Card pad={16}>
            <SectionLabel>Herzfrequenz</SectionLabel>
            <HeartLine />
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── 4) Tagebuch ───────────────────────────────────────────

export function JournalScreen({ text = '', cursor = true, mood = null }) {
  const moods = [
    { emoji: '🙂', label: 'gut' },
    { emoji: '😌', label: 'ruhig' },
    { emoji: '😤', label: 'stark' },
    { emoji: '😴', label: 'müde' },
  ];
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 80 }}>
      <div style={{ padding: '70px 22px 14px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>Do. 23. April · 22:14</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1, marginTop: 8,
          color: JOUR_COLORS.ink, letterSpacing: '-0.01em' }}>Was hast du heute gemacht?</div>
      </div>
      <div style={{ padding: '0 22px' }}>
        <Card pad={18} style={{ minHeight: 180 }}>
          <div style={{
            fontFamily: FONT_DISPLAY, fontSize: 22, lineHeight: 1.35,
            color: JOUR_COLORS.ink, letterSpacing: '-0.005em', whiteSpace: 'pre-wrap',
          }}>
            {text}
            {cursor && (
              <span style={{
                display: 'inline-block', width: 2, height: 22,
                background: JOUR_COLORS.accent, marginLeft: 2, verticalAlign: 'text-bottom',
                animation: 'jourBlink 1s steps(1) infinite',
              }}/>
            )}
            {!text && !cursor && (
              <span style={{ color: JOUR_COLORS.sub }}>Fang mit einem Wort an…</span>
            )}
          </div>
        </Card>
        <div style={{ marginTop: 18 }}>
          <SectionLabel>Abendstimmung</SectionLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            {moods.map((m, i) => (
              <div key={i} style={{
                flex: 1,
                background: mood === i ? JOUR_COLORS.accentSoft : JOUR_COLORS.card,
                border: mood === i ? `1.5px solid ${JOUR_COLORS.accent}` : `1px solid ${JOUR_COLORS.line}`,
                borderRadius: 16, padding: '14px 4px', textAlign: 'center',
                fontFamily: FONT_BODY, transition: 'all 200ms',
              }}>
                <div style={{ fontSize: 22 }}>{m.emoji}</div>
                <div style={{ fontSize: 11, color: JOUR_COLORS.sub, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 5) Diagnose ───────────────────────────────────────────

export function DiagnosticScreen({ progress = 0.83, label = '83', verdict = 'Schöner Tag', categories = [
  { name: 'Ernährung', pct: 0.9, color: 'oklch(72% 0.15 40)' },
  { name: 'Sport', pct: 0.95, color: 'oklch(66% 0.16 145)' },
  { name: 'Mental', pct: 0.7, color: 'oklch(70% 0.11 280)' },
  { name: 'Schlaf', pct: 0.65, color: 'oklch(80% 0.13 75)' },
]}) {
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 80 }}>
      <div style={{ padding: '70px 22px 8px', fontFamily: FONT_BODY, textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>Tagesdiagnose</div>
      </div>
      <div style={{ padding: '18px 22px 0', display: 'flex', justifyContent: 'center' }}>
        <Ring size={236} stroke={14} progress={progress} color={JOUR_COLORS.accent}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 96, lineHeight: 1,
              color: JOUR_COLORS.ink, letterSpacing: '-0.03em' }}>{label}</div>
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
          Du hast 5 / 6 Ziele erreicht.<br/>Es fehlte nur etwas Schlaf.
        </div>
      </div>
      <div style={{ padding: '22px 22px 0' }}>
        <Card pad={18}>
          {categories.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', fontFamily: FONT_BODY,
            }}>
              <div style={{ width: 72, fontSize: 12, color: JOUR_COLORS.sub }}>{c.name}</div>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: JOUR_COLORS.line,
                position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${c.pct * 100}%`, background: c.color, borderRadius: 3,
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

// ── 6) Fortschritt ────────────────────────────────────────

export function DashboardScreen({ 
  week = [0, 0, 0, 0, 0, 0, 0], 
  avg = 0, 
  streak = 0,
  bestDay = 'Noch keine Daten',
  bestDayLabel = 'Starte heute',
  insight = 'Erfasse deine Gewohnheiten, um Trends zu sehen.',
  weekLabel = 'Diese Woche'
}) {
  const max = 100;
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  return (
    <div style={{ background: JOUR_COLORS.paper, minHeight: '100%', paddingBottom: 80 }}>
      <div style={{ padding: '70px 22px 10px', fontFamily: FONT_BODY }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: JOUR_COLORS.sub }}>{weekLabel}</div>
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
            {avg > 0 && <Pill color={JOUR_COLORS.accentSoft} text={JOUR_COLORS.accent}>In Bewegung</Pill>}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 140, padding: '0 4px' }}>
            {week.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, height: '100%' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div style={{
                    width: '100%', height: `${Math.max(2, (v / max) * 100)}%`,
                    background: i === (new Date().getDay() + 6) % 7 ? JOUR_COLORS.accent : 'oklch(66% 0.16 145 / 0.35)',
                    borderRadius: '6px 6px 2px 2px',
                    opacity: v === 0 ? 0.2 : 1
                  }}/>
                </div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 10,
                  color: i === (new Date().getDay() + 6) % 7 ? JOUR_COLORS.ink : JOUR_COLORS.sub }}>
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
                letterSpacing: '-0.02em' }}>{streak}</div>
              <div style={{ fontSize: 13, color: JOUR_COLORS.sub, fontFamily: FONT_BODY }}>Tage</div>
            </div>
            <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
              {Array.from({length: 12}).map((_, i) => (
                <div key={i} style={{ flex: 1, height: 14, borderRadius: 3,
                  background: JOUR_COLORS.accent, opacity: streak > i ? 1 : 0.15 }}/>
              ))}
            </div>
          </Card>
          <Card pad={16}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em',
              color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>Bester Tag</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, color: JOUR_COLORS.ink,
              marginTop: 6, letterSpacing: '-0.01em' }}>{bestDay}</div>
            <div style={{ fontFamily: FONT_BODY, fontSize: 12, color: JOUR_COLORS.sub, marginTop: 4 }}>
              {bestDayLabel}
            </div>
          </Card>
        </div>
        <div style={{ marginTop: 12 }}>
          <Card pad={16}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 10, letterSpacing: '0.14em',
              color: JOUR_COLORS.sub, textTransform: 'uppercase' }}>Insights</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, lineHeight: 1.3,
              color: JOUR_COLORS.ink, marginTop: 8, letterSpacing: '-0.005em' }}>
              {insight}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── 7) Sperrbildschirm ────────────────────────────────────

export function LockScreen({ showNotif = true }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, oklch(30% 0.04 60) 0%, oklch(18% 0.02 30) 100%)',
      minHeight: '100%', color: '#fff', fontFamily: FONT_BODY, position: 'relative',
    }}>
      <div style={{ padding: '110px 0 0', textAlign: 'center' }}>
        <div style={{ fontFamily: FONT_MONO, fontSize: 13, letterSpacing: '0.16em',
          textTransform: 'uppercase', opacity: 0.7 }}>Donnerstag, 23. April</div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 96, lineHeight: 1, letterSpacing: '-0.03em',
          marginTop: 4, fontWeight: 300 }}>8:02</div>
      </div>
      {showNotif && (
        <div style={{ padding: '60px 14px 0' }}>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            borderRadius: 22, padding: 14,
            border: '0.5px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6, background: JOUR_COLORS.paper,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_DISPLAY, fontSize: 14, color: JOUR_COLORS.ink,
              }}>J</div>
              <div style={{ fontSize: 12, opacity: 0.8, letterSpacing: '0.02em' }}>JOUR</div>
              <div style={{ flex: 1 }}/>
              <div style={{ fontSize: 11, opacity: 0.6 }}>jetzt</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Guten Morgen — dein Tag wartet</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 2, lineHeight: 1.35 }}>
              6 Ziele heute. Fangen wir mit einem Glas Wasser an?
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
