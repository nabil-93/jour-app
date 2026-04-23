// scenes.jsx — Jour promo video, 9:16, ~32s
// Composes HomeScreen/MealScreen/etc inside an iOS frame, with camera moves.

const VIDEO_W = 1080;
const VIDEO_H = 1920;
const DEVICE_W = 402;
const DEVICE_H = 874;

// Scene timing (seconds)
const T = {
  lock:       [0,    3.5],   // lockscreen notification
  home1:      [3.5,  8.5],   // morning home, 0 checked
  checkInteract: [6.0, 8.5], // checks animate within home1 tail
  meal:       [8.5,  13.0],  // meal logging
  sport:      [13.0, 18.0],  // workout screen
  journal:    [18.0, 22.5],  // journal typing
  diagnostic: [22.5, 28.0],  // score reveal
  dashboard:  [28.0, 33.0],  // weekly dashboard
};
const DURATION = 33.5;

// ─── Stage backdrop: soft paper with animated blur blobs ───────────────────

function Backdrop() {
  const t = useTime();
  const hueShift = Math.sin(t * 0.2) * 10;
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `radial-gradient(ellipse 80% 60% at 50% 10%, oklch(94% 0.03 ${70 + hueShift}), oklch(90% 0.02 60) 60%, oklch(84% 0.02 50) 100%)`,
    }}>
      {/* Soft glow blobs, drifting */}
      <div style={{
        position: 'absolute',
        width: 700, height: 700, borderRadius: '50%',
        left: `${-150 + Math.sin(t * 0.3) * 60}px`,
        top: `${200 + Math.cos(t * 0.2) * 50}px`,
        background: 'radial-gradient(circle, oklch(80% 0.08 150 / 0.35), transparent 60%)',
        filter: 'blur(30px)',
      }} />
      <div style={{
        position: 'absolute',
        width: 600, height: 600, borderRadius: '50%',
        right: `${-100 + Math.cos(t * 0.25) * 50}px`,
        bottom: `${100 + Math.sin(t * 0.3) * 60}px`,
        background: 'radial-gradient(circle, oklch(78% 0.1 40 / 0.3), transparent 60%)',
        filter: 'blur(30px)',
      }} />
      {/* Grain texture - via svg feTurbulence */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35, mixBlendMode: 'multiply' }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.15 0 0 0 0 0.14 0 0 0 0 0.12 0 0 0 0.12 0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)"/>
      </svg>
    </div>
  );
}

// ─── Camera controller: scales + translates the phone per scene ────────────

function PhoneStage({ children, scene }) {
  const t = useTime();

  // Camera keyframes per scene (x, y offset from center, scale)
  // y offset > 0 means shifted DOWN (content higher visible)
  // scale > 1 zooms in
  const cam = computeCamera(t);

  // Global entry for phone
  const phoneIn = interpolate([0, 0.6, 1.0], [0, 0.6, 1], Easing.easeOutCubic);
  const entry = phoneIn(clamp(t, 0, 1));

  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      perspective: 2400,
    }}>
      <div style={{
        transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale * (0.9 + 0.1 * entry)}) rotateX(${cam.rx}deg) rotateY(${cam.ry}deg)`,
        transformOrigin: 'center center',
        transition: 'none',
        opacity: entry,
        willChange: 'transform',
        filter: `drop-shadow(0 ${40 * cam.scale}px ${80 * cam.scale}px rgba(30,20,10,0.35))`,
      }}>
        {children}
      </div>
    </div>
  );
}

function computeCamera(t) {
  // Per-scene camera targets
  const keys = [
    // [time, x, y, scale, rx, ry]
    [0,    0,   0,    1.25, 0, 0],    // lock, closer to feel intimate
    [3.0,  0,   0,    1.25, 0, 0],
    [3.5,  0,   30,   1.18, 0, 0],    // reveal home from below
    [5.5,  0,   0,    1.3,  0, 0],    // zoom into checklist
    [6.0,  -40, -120, 1.75, 0, 5],    // tilt to checklist items
    [8.0,  -40, -120, 1.75, 0, 5],
    [8.5,  60, 80,    1.25, 0, -3],   // meal screen tilt in
    [10.0, 0,   -40,  1.5,  0, 0],    // focus on food rows
    [12.8, 0,   -40,  1.5,  0, 0],
    [13.0, 0,   20,   1.3,  0, 0],    // sport enters
    [14.5, 0,   -50,  1.6,  0, 0],    // focus timer
    [17.8, 0,   -50,  1.6,  0, 0],
    [18.0, -30, 50,   1.2,  0, 3],    // journal
    [20.0, -30, 0,    1.45, 0, 3],
    [22.3, -30, 0,    1.45, 0, 3],
    [22.5, 0,   0,    1.1,  0, 0],    // diagnostic — pull back for hero
    [24.0, 0,   -20,  1.35, 0, 0],
    [27.8, 0,   -20,  1.35, 0, 0],
    [28.0, 0,   60,   1.15, 0, 0],    // dashboard enter
    [30.0, 0,   -10,  1.4,  0, 0],    // focus chart
    [32.0, 0,   0,    1.15, 0, 0],    // pull back for outro
    [DURATION, 0, 0, 1.15, 0, 0],
  ];

  // Find surrounding keys
  let a = keys[0], b = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i][0] && t <= keys[i+1][0]) {
      a = keys[i]; b = keys[i+1]; break;
    }
  }
  const span = b[0] - a[0];
  const local = span > 0 ? (t - a[0]) / span : 0;
  const e = Easing.easeInOutCubic(clamp(local, 0, 1));
  return {
    x: a[1] + (b[1] - a[1]) * e,
    y: a[2] + (b[2] - a[2]) * e,
    scale: a[3] + (b[3] - a[3]) * e,
    rx: a[4] + (b[4] - a[4]) * e,
    ry: a[5] + (b[5] - a[5]) * e,
  };
}

// ─── Scene pickers: swap iOS-frame content per time window ─────────────────

function PhoneContent() {
  const t = useTime();

  if (t < T.lock[1]) {
    return <LockScreen showNotif={t > 0.9} />;
  }
  if (t < T.home1[1]) {
    // home with interactive check-off during tail
    const tLocal = t - T.home1[0];
    const checkT = t - T.checkInteract[0];
    const progress = checkStateAt(checkT);
    const ringProgress = progress.done / 6;
    return (
      <HomeScreen
        checklist={progress.list}
        ringProgress={ringProgress}
        ringLabel={`${Math.round(ringProgress * 100)}%`}
        mealCount={progress.done >= 2 ? 1 : 0}
        workoutMinutes={progress.done >= 4 ? 45 : 0}
        stepsCount={Math.round(1200 + 800 * progress.done)}
        subLine={tLocal < 1.5 ? 'Bonjour — voici tes 6 priorités' : 'Bonne journée — 6 choses pour toi'}
      />
    );
  }
  if (t < T.meal[1]) {
    const tl = t - T.meal[0];
    // Progressively select meals + type note
    const selected = [];
    if (tl > 0.6) selected.push(2);
    if (tl > 1.3) selected.push(3);
    const note = typeText('Bien portionné.', Math.max(0, tl - 2.0), 12);
    return <MealScreen selected={selected} note={note} />;
  }
  if (t < T.sport[1]) {
    const tl = t - T.sport[0];
    const startSec = 24 * 60 + 18 + Math.floor(tl * 3);
    const mm = String(Math.floor(startSec / 60)).padStart(2, '0');
    const ss = String(startSec % 60).padStart(2, '0');
    const hr = Math.round(138 + Math.sin(tl * 2.5) * 5);
    const cal = Math.round(280 + tl * 4);
    const pulse = 1 + 0.3 * Math.abs(Math.sin(tl * 3));
    return <SportScreen
      elapsed={`${mm}:${ss}`} heartRate={hr} calories={cal}
      sets={tl > 2.5 ? 4 : 3} pulseScale={pulse}
    />;
  }
  if (t < T.journal[1]) {
    const tl = t - T.journal[0];
    const full = 'Séance muscu au top.\nBonne énergie. Plus de sommeil demain.';
    const text = typeText(full, tl, 28);
    const mood = tl > 3.4 ? 0 : null;
    return <JournalScreen text={text} cursor={tl < 3.2} mood={mood} />;
  }
  if (t < T.diagnostic[1]) {
    const tl = t - T.diagnostic[0];
    // ring fills 0 -> 0.83 over first 1.8s
    const prog = 0.83 * Easing.easeOutCubic(clamp(tl / 1.8, 0, 1));
    const label = Math.round(prog * 100).toString();
    const verdict = tl > 2.0 ? 'Belle journée' : '\u00a0';
    return <DiagnosticScreen progress={prog} label={label} verdict={verdict} />;
  }
  // Dashboard
  const tl = t - T.dashboard[0];
  const grow = Easing.easeOutCubic(clamp(tl / 1.2, 0, 1));
  const baseWeek = [62, 74, 55, 81, 90, 70, 83];
  const week = baseWeek.map(v => v * grow);
  const avg = Math.round(74 * grow);
  return <DashboardScreen week={week} avg={avg} streak={tl > 2 ? 12 : Math.round(12 * grow)} />;
}

function checkStateAt(checkT) {
  // Starts checking items one by one
  const labels = [
    'Courir 5 km',
    'Petit-déjeuner équilibré',
    'Boire 2 L d\u2019eau',
    'Séance muscu (45 min)',
    '15 min de lecture',
    'Dormir avant 23h',
  ];
  const doneAt = [0.4, 0.9, 1.4, 1.8, 2.2, 2.5]; // we'll only get through ~2-3 within the window
  const list = labels.map((label, i) => ({
    label,
    done: checkT > doneAt[i] && checkT > 0,
  }));
  // only allow first 3 during home1 window for realism
  for (let i = 3; i < list.length; i++) list[i].done = false;
  const done = list.filter(c => c.done).length;
  return { list, done };
}

function typeText(full, localT, charsPerSec) {
  if (localT <= 0) return '';
  const n = Math.min(full.length, Math.floor(localT * charsPerSec));
  return full.slice(0, n);
}

// ─── Scene caption pills (top-of-frame, French) ────────────────────────────

const CAPTIONS = [
  { start: 0,    end: 3.5,  kicker: '01',  line: 'Ta journée commence' },
  { start: 3.5,  end: 8.5,  kicker: '02',  line: 'Six priorités, une journée' },
  { start: 8.5,  end: 13.0, kicker: '03',  line: 'Logue tes repas' },
  { start: 13.0, end: 18.0, kicker: '04',  line: 'Bouge, mesure' },
  { start: 18.0, end: 22.5, kicker: '05',  line: 'Raconte ta journée' },
  { start: 22.5, end: 28.0, kicker: '06',  line: 'Reçois ton diagnostic' },
  { start: 28.0, end: 33.5, kicker: '07',  line: 'Vois ton progrès' },
];

function Captions() {
  const t = useTime();
  const cap = CAPTIONS.find(c => t >= c.start && t < c.end);
  if (!cap) return null;
  const local = t - cap.start;
  const end = cap.end - cap.start;
  const fade =
    local < 0.4 ? local / 0.4 :
    local > end - 0.4 ? Math.max(0, 1 - (local - (end - 0.4)) / 0.4) :
    1;
  return (
    <div style={{
      position: 'absolute', top: 64, left: 0, right: 0,
      display: 'flex', justifyContent: 'center',
      fontFamily: FONT_BODY, pointerEvents: 'none',
      opacity: fade,
      transform: `translateY(${(1 - fade) * -12}px)`,
    }}>
      <div style={{
        background: 'rgba(26,24,21,0.88)',
        backdropFilter: 'blur(12px)',
        color: '#f5f1ea',
        padding: '14px 26px',
        borderRadius: 999,
        display: 'flex', alignItems: 'center', gap: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 14, letterSpacing: '0.18em',
          color: 'oklch(80% 0.12 145)',
        }}>{cap.kicker}</span>
        <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.22)' }}/>
        <span style={{
          fontFamily: FONT_DISPLAY, fontSize: 30, letterSpacing: '-0.01em',
        }}>{cap.line}</span>
      </div>
    </div>
  );
}

// ─── Wordmark and outro ────────────────────────────────────────────────────

function WordmarkIntro() {
  const t = useTime();
  if (t > 3.6) return null;
  const fade = t < 2.5 ? 1 : Math.max(0, 1 - (t - 2.5) / 1.0);
  const slide = t < 0.6 ? (1 - t / 0.6) * 30 : 0;
  return (
    <div style={{
      position: 'absolute', bottom: 160, left: 0, right: 0,
      textAlign: 'center', pointerEvents: 'none', opacity: fade,
      transform: `translateY(${slide}px)`,
    }}>
      <div style={{
        fontFamily: FONT_MONO, fontSize: 15, letterSpacing: '0.22em',
        color: 'oklch(35% 0.04 60)', textTransform: 'uppercase',
      }}>présente</div>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 180, lineHeight: 1,
        color: '#1a1815', letterSpacing: '-0.04em', marginTop: 12,
      }}>Jour</div>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 22, color: 'oklch(35% 0.04 60)',
        marginTop: 4, fontStyle: 'italic',
      }}>ta journée, notée.</div>
    </div>
  );
}

function Outro() {
  const t = useTime();
  if (t < 31.8) return null;
  const local = t - 31.8;
  const fade = Math.min(1, local / 0.6);
  return (
    <div style={{
      position: 'absolute', bottom: 140, left: 0, right: 0,
      textAlign: 'center', pointerEvents: 'none', opacity: fade,
      transform: `translateY(${(1 - fade) * 20}px)`,
    }}>
      <div style={{
        fontFamily: FONT_DISPLAY, fontSize: 120, lineHeight: 1,
        color: '#1a1815', letterSpacing: '-0.03em',
      }}>Jour</div>
      <div style={{
        fontFamily: FONT_BODY, fontSize: 22, color: 'oklch(35% 0.04 60)',
        marginTop: 6,
      }}>Disponible sur iOS · Bientôt</div>
    </div>
  );
}

// ─── Timestamp label (for comment context) ─────────────────────────────────

function TimestampLabel() {
  const t = useTime();
  React.useEffect(() => {
    const el = document.querySelector('[data-video-root]');
    if (el) el.setAttribute('data-screen-label', `t=${Math.floor(t)}s`);
  }, [Math.floor(t)]);
  return null;
}

// ─── Main root ─────────────────────────────────────────────────────────────

function VideoRoot() {
  return (
    <div data-video-root style={{ position: 'absolute', inset: 0 }}>
      <Backdrop />
      <PhoneStage>
        <div style={{
          width: DEVICE_W, height: DEVICE_H,
        }}>
          <IOSDevice width={DEVICE_W} height={DEVICE_H}>
            <PhoneContent />
          </IOSDevice>
        </div>
      </PhoneStage>
      <Captions />
      <WordmarkIntro />
      <Outro />
      <TimestampLabel />
    </div>
  );
}

Object.assign(window, { VideoRoot, VIDEO_W, VIDEO_H, DURATION });
