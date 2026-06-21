// ── variáveis globais ─────────────────────────────────
const MAX_OFFSET  = 13;
const EYE_SPEED   = 0.08;
const PUSH_RADIUS = 120;
const PUSH_FORCE  = 60;

let mouseX = 0, mouseY = 0;

const eyes = {
  left:  { wrapper: null, img: null, cx: 0, cy: 0 },
  right: { wrapper: null, img: null, cx: 0, cy: 0 },
};

const baseTransforms = [
  { x: 0,   y: 40,  r: -5 },
  { x: -20, y: 0,   r:  5 },
  { x: -30, y: 50,  r:  5 },
  { x: -10, y: 30,  r: -7 },
  { x: -20, y: 50,  r:  5 },
  { x: 0,   y: 40,  r: -5 },
  { x: -10, y: 50,  r:  5 },
];

// ── funções utilitárias ───────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

// ── olhos ─────────────────────────────────────────────
function getTarget(eyeWrapper) {
  const r    = eyeWrapper.getBoundingClientRect();
  const cx   = r.left + r.width  / 2;
  const cy   = r.top  + r.height / 2;
  const dx   = mouseX - cx;
  const dy   = mouseY - cy;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const ratio = Math.min(dist, MAX_OFFSET * 4) / (MAX_OFFSET * 4);
  return {
    x: (dx / dist) * MAX_OFFSET * ratio,
    y: (dy / dist) * MAX_OFFSET * ratio,
  };
}

// ── letras ────────────────────────────────────────────
const letters = document.querySelectorAll('.logo span');
const current = baseTransforms.map(b => ({ x: b.x, y: b.y }));

// ── loop único ────────────────────────────────────────
function animate() {
  // olhos
  for (const eye of Object.values(eyes)) {
    if (!eye.wrapper) continue;
    const target = getTarget(eye.wrapper);
    eye.cx = lerp(eye.cx, target.x, EYE_SPEED);
    eye.cy = lerp(eye.cy, target.y, EYE_SPEED);
    eye.img.style.transform = `translate(${eye.cx}px, ${eye.cy}px)`;
  }

  // letras
  letters.forEach((span, i) => {
    const r    = span.getBoundingClientRect();
    const cx   = r.left + r.width  / 2;
    const cy   = r.top  + r.height / 2;
    const dx   = cx - mouseX;
    const dy   = cy - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;

    let pushX = 0, pushY = 0;
    if (dist < PUSH_RADIUS) {
      const force = (1 - dist / PUSH_RADIUS) * PUSH_FORCE;
      pushX = (dx / dist) * force;
      pushY = (dy / dist) * force;
    }

    const base = baseTransforms[i];
    current[i].x = lerp(current[i].x, base.x + pushX, 0.12);
    current[i].y = lerp(current[i].y, base.y + pushY, 0.12);

    span.style.transform =
      `translateX(${current[i].x}px) translateY(${current[i].y}px) rotate(${base.r}deg)`;
  });

  requestAnimationFrame(animate);
}

// ── mouse ─────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// ── digitação ─────────────────────────────────────────
const palavras = ["Web Developer", "Designer", "Crafter", "Programmer", "Artist", "Hobby collector", "Music Lover", "Creative Mind"];
const elemento = document.getElementById("elemento-digitavel");
let indicePalavra = 0, indiceCaractere = 0, estaApagando = false;

function digitar() {
  const palavraAtual = palavras[indicePalavra];
  if (estaApagando) {
    elemento.textContent = palavraAtual.substring(0, indiceCaractere - 1);
    indiceCaractere--;
  } else {
    elemento.textContent = palavraAtual.substring(0, indiceCaractere + 1);
    indiceCaractere++;
  }
  let velocidade = 100;
  if (!estaApagando && indiceCaractere === palavraAtual.length) {
    velocidade = 1500;
    estaApagando = true;
  } else if (estaApagando && indiceCaractere === 0) {
    estaApagando = false;
    indicePalavra = (indicePalavra + 1) % palavras.length;
    velocidade = 500;
  }
  setTimeout(digitar, velocidade);
}

// ── posições dos ícones de desktop ───────────────────
const ICON_POSITIONS = {
  'icon-star':     { top:  '60%', left:  '24%' },
  'icon-cam':      { top: '50%', left:  '20%' },
  'icon-book':     { top: '73%', left:  '10%' },
  'icon-craft':    { top: '28%', left:  '2%' },
  'icon-design':   { top: '40%', left:  '0%' },
  'icon-folder':   { top: '78%', left:  '2%' },
  'icon-filme':    { top:  '10%', left: '13%' },
  'icon-draw':     { top:  '38%', left: '70%' },
  'icon-favo':     { top: '10%', left: '85%' },
  'icon-net':      { top: '33%', left: '80%' },
  'icon-musica':      { top: '48%', left: '95%' },
  'icon-game':     { top: '63%', left: '76%' },
  'icon-3d':       { top: '78%', left: '85%' },
  'icon-idea':     { top:  '3%', left: '74%' },
};

// ── inicialização ─────────────────────────────────────
window.addEventListener('load', () => {
  eyes.left.wrapper  = document.getElementById('eye-left');
  eyes.left.img      = document.getElementById('eye-l-img');
  eyes.right.wrapper = document.getElementById('eye-right');
  eyes.right.img     = document.getElementById('eye-r-img');

  Object.entries(ICON_POSITIONS).forEach(([id, pos]) => {
    const el = document.getElementById(id);
    if (el) { el.style.top = pos.top; el.style.left = pos.left; }
  });

  digitar();
  animate();
});