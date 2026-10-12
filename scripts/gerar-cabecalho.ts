// Cabeçalho do perfil: o Saulo em pixel art como Líder de Guilda, à frente da guilda (os agentes de IA e as ferramentas do dia a dia).
//   npx tsx scripts/gerar-cabecalho.ts   (da raiz deste repositório, com o Claude-code-hero-journey clonado ao lado)
import { mkdirSync, writeFileSync } from 'node:fs'
import { spriteInner, SPRITE_CSS } from '../../Claude-code-hero-journey/mods/hero-journey/hooks/core/sprites.ts'

const INK = '#1a1a1a'
const NAVY = '#2c3e73'
const GOLD = '#d9b26a'
const CSS =
  SPRITE_CSS +
  '.wave{transform-box:fill-box;transform-origin:0% 50%;animation:wave 2.4s ease-in-out infinite}@keyframes wave{50%{transform:skewY(-7deg) scaleX(.93)}}' +
  '.cape{transform-box:view-box;transform-origin:70px 44px;animation:cape 3.2s ease-in-out infinite}@keyframes cape{50%{transform:skewX(-3deg)}}' +
  '.kb{animation:kb 7s ease-in-out infinite}@keyframes kb{0%,18%{transform:none;opacity:1}30%,50%{transform:translateX(9px)}62%,88%{transform:translateX(18px);opacity:1}96%{transform:translateX(18px);opacity:0}100%{opacity:0}}' +
  '.pl{fill-opacity:.2;animation:pl 3s infinite}@keyframes pl{0%,100%{fill-opacity:.2}10%,30%{fill-opacity:1}}' +
  '.hover{animation:hover 3.4s ease-in-out infinite}@keyframes hover{50%{transform:translateY(-7px)}}' +
  '.shadow{transform-box:fill-box;transform-origin:center;animation:shadow 3.4s ease-in-out infinite}@keyframes shadow{50%{transform:scaleX(.7);opacity:.5}}' +
  '.cur{animation:cur 1s steps(1) infinite}@keyframes cur{50%{opacity:0}}' +
  '@media (prefers-reduced-motion:reduce){*{animation:none!important}}'

/** Desenha uma grade de pixels de 5 px a partir de uma legenda de cores. */
const pixels = (grid: string[], x0: number, y0: number, colors: Record<string, string>, eye = 'E') => {
  let out = ''
  grid.forEach((row, ry) =>
    [...row].forEach((ch, rx) => {
      if (ch === '.') return
      const x = x0 + rx * 5
      const y = y0 + ry * 5
      out += `<rect${ch === eye ? ' class="blink"' : ''} x="${x}" y="${y}" width="5.2" height="5.2" rx=".6" fill="${colors[ch]}"/>`
    }),
  )
  return out
}

// ---------- O líder: o Saulo, com capa, faixa dourada e o estandarte da guilda ----------
const SAULO = [
  '...HHHHHH...',
  '..HHHHHHHH..',
  '..HSSSSSSH..',
  '.SSESSSSESS.',
  '..SSSSSSSS..',
  '..SSSSSSSS..',
  '..SSSSSSSS..',
  '...SSSSSS...',
  '.TTTTTTTTTT.',
  'TTTTTTTTTTTT',
  'T.TTTTTTTT.T',
  'S.TTTTTTTT.S',
  '..PPPPPPPP..',
  '..PPP..PPP..',
  '..FFF..FFF..',
]
const SAULO_COLORS = { H: '#2b211d', S: '#e6b393', E: INK, B: '#3d2e27', M: '#33261f', T: '#2a2a31', P: '#39425c', F: '#1c1c20' }

const card = (x: number, y: number, c: string) => `<rect x="${x}" y="${y}" width="6.4" height="4.6" rx=".8" fill="${c}"/>`

/** O quadro de quests (Azure Boards e Jira) com a esteira de CI/CD acendendo embaixo. */
const board = (x: number) =>
  `<g transform="translate(${x} 0)">` +
  `<rect x="5" y="64" width="2.6" height="17" fill="#5a3d22"/><rect x="25.4" y="64" width="2.6" height="17" fill="#5a3d22"/>` +
  `<rect x="1" y="35" width="31" height="32" rx="2.2" fill="#7a5530"/><rect x="3" y="37" width="27" height="28" rx="1" fill="#d8b98a"/>` +
  `<rect x="3" y="37" width="13.5" height="3" fill="#0078d4"/><rect x="16.5" y="37" width="13.5" height="3" fill="#2684ff"/>` +
  `<line x1="12" y1="41" x2="12" y2="58" stroke="#a88456" stroke-width=".8"/><line x1="21" y1="41" x2="21" y2="58" stroke="#a88456" stroke-width=".8"/>` +
  card(4.3, 42, '#e6b450') + card(4.3, 48, '#b49cf0') + card(13.3, 42, '#5fc7b5') + card(22.3, 42, '#8fc46a') + card(22.3, 48, '#8fc46a') +
  `<path d="M23.6 44.3 l1.3 1.3 l2.4 -2.4 M23.6 50.3 l1.3 1.3 l2.4 -2.4" stroke="#2a4a22" stroke-width=".9" fill="none"/>` +
  `<g class="kb">${card(4.3, 53, '#ee9a7a')}</g>` +
  `<line x1="6" y1="61.5" x2="27" y2="61.5" stroke="#a88456" stroke-width="1"/>` +
  [7.5, 16.5, 25.5].map((cx, i) => `<circle class="pl" style="animation-delay:${i}s" cx="${cx}" cy="61.5" r="1.8" fill="#4caf50"/>`).join('') +
  `</g>`

export const lider = () => {
  const cape = `<g class="cape"><path d="M44 46 L96 46 L106 80 L34 80 Z" fill="${NAVY}"/><path d="M34 80 L106 80" stroke="${GOLD}" stroke-width="1.6"/></g>`
  const sash = `<path d="M46 47 L96 64" stroke="${GOLD}" stroke-width="2.6" stroke-linecap="round"/><circle cx="71" cy="55.5" r="2.2" fill="#f0c66c"/>`
  const banner =
    `<line x1="103" y1="78" x2="103" y2="6" stroke="#5a4636" stroke-width="2.6" stroke-linecap="round"/><circle cx="103" cy="4.5" r="2.6" fill="${GOLD}"/>` +
    `<g class="wave"><path d="M104 8 h26 l-6 11 l6 11 h-26 Z" fill="${NAVY}" stroke="${GOLD}" stroke-width="1.1"/>` +
    `<path d="M115 13 l1.7 3.5 l3.8 .5 l-2.8 2.6 l.7 3.8 l-3.4 -1.8 l-3.4 1.8 l.7 -3.8 l-2.8 -2.6 l3.8 -.5 Z" fill="${GOLD}"/></g>`
  const beard =
    `<path d="M50 30 v6 q0 6 6 8 h28 q6 -2 6 -8 v-6 h-3 v5 q0 4 -5 5 h-24 q-5 -1 -5 -5 v-5 Z" fill="#3d2e27" opacity=".55"/>` +
    `<path d="M60 33.2 q10 -3.4 20 0 v2.6 q-10 -2.6 -20 0 Z" fill="#2b211d"/>` +
    `<path d="M64.5 38.6 q5.5 2.4 11 0" stroke="#9a5a48" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
    `<path d="M65 41 h10 v3.2 q-5 2.6 -10 0 Z" fill="#2b211d" opacity=".85"/>`
  return `<style>${CSS}</style>` + board(-4) + cape + `<g class="bob">${pixels(SAULO, 40, 5, SAULO_COLORS)}${beard}${sash}</g>` + banner
}

// ---------- Codex: um espírito de terminal, preto e branco, com o prompt piscando ----------
export const codex = () =>
  `<style>${CSS}</style><ellipse class="shadow" cx="70" cy="82" rx="16" ry="3" fill="#000" opacity=".3"/>` +
  `<g class="hover"><path d="M50 72 V52 Q50 36 70 36 Q90 36 90 52 V72 l-5 5 l-5 -5 l-5 5 l-5 -5 l-5 5 l-5 -5 l-5 5 Z" fill="#f4f4f4"/>` +
  `<rect x="55" y="46" width="30" height="18" rx="4" fill="#111"/>` +
  `<path d="M60 51 l5 4 l-5 4" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<rect class="cur" x="68" y="58" width="9" height="2.2" rx=".6" fill="#fff"/></g>`

// ---------- Cursor: um golem-cubo escuro, com a faceta clara em forma de seta no topo ----------
export const cursor = () =>
  `<style>${CSS}</style>` +
  `<rect x="58" y="70" width="5" height="10" rx="1" fill="#26262c"/><rect x="77" y="68" width="5" height="12" rx="1" fill="#26262c"/>` +
  `<g class="bob"><g stroke="#7a7a86" stroke-width="1" stroke-linejoin="round">` +
  `<path d="M70 30 L91 42 L70 54 L49 42 Z" fill="#4a4a54"/><path d="M49 42 L70 54 L70 78 L49 66 Z" fill="#2c2c33"/><path d="M70 54 L91 42 L91 66 L70 78 Z" fill="#1c1c21"/></g>` +
  `<path d="M70 54 L91 42 L74 41 Z" fill="#f4f4f6"/><path d="M70 54 L70 78 L91 42 Z" fill="#fff" opacity=".08"/>` +
  `<rect class="blink" x="54" y="54" width="3.8" height="4.8" rx=".9" fill="#e9e9ef"/><rect class="blink" x="62" y="58.4" width="3.8" height="4.8" rx=".9" fill="#e9e9ef"/></g>`

// ---------- Antigravity: o arco em "A", colorido, flutuando com o orbe por baixo e o rastro de impulso ----------
export const antigravity = () =>
  `<style>${CSS}</style><defs><linearGradient id="agv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4285f4"/><stop offset=".38" stop-color="#ea4335"/><stop offset=".64" stop-color="#fbbc05"/><stop offset="1" stop-color="#34a853"/></linearGradient></defs>` +
  `<ellipse class="shadow" cx="70" cy="82" rx="13" ry="2.6" fill="#000" opacity=".3"/>` +
  `<g class="hover"><path d="M44 66 C46 44 56 25 70 20 C84 25 94 44 96 66 Q96 69 92 69 L88 69 Q85 69 85 66 C83 49 78 37 70 33.5 C62 37 57 49 55 66 Q55 69 52 69 L48 69 Q44 69 44 66 Z" fill="url(#agv)"/>` +
  `<circle cx="70" cy="55" r="10.5" fill="#eef3ff"/><rect class="blink" x="64.6" y="52" width="3.4" height="4.4" rx="1" fill="${INK}"/><rect class="blink" x="72" y="52" width="3.4" height="4.4" rx="1" fill="${INK}"/>` +
  [0, 1, 2].map(d => `<circle class="puff" style="animation-delay:${d * 0.7}s" cx="${50 + d * 20}" cy="72" r="1.5" fill="#8ab4f8"/>`).join('') +
  `</g>`

// ---------- Teams: o pássaro-correio roxo, trazendo a mensagem ----------
export const teams = () =>
  `<style>${CSS}</style><g class="flt">` +
  `<path d="M56 50 l-10 -5 l3 7 l-3 5 Z" fill="#464eb8"/><ellipse cx="68" cy="52" rx="14" ry="10" fill="#5b5fc7"/><circle cx="81" cy="45" r="7.5" fill="#7b83eb"/>` +
  `<circle cx="83.5" cy="44" r="1.5" fill="${INK}"/><path d="M88 45 l6 1.6 l-6 1.8 Z" fill="#f2c14e"/>` +
  `<path class="flap" d="M60 47 q8 -16 18 -3 Z" fill="#464eb8"/>` +
  `<rect x="61" y="60" width="15" height="10" rx="1" fill="#f4ead5" stroke="#c9b48a"/><path d="M61 60 l7.5 5.5 l7.5 -5.5" stroke="#c9b48a" fill="none"/></g>`

const SANS = "'Segoe UI',system-ui,-apple-system,sans-serif"
const MONO = "'Cascadia Code',Consolas,monospace"
const nest = (inner: string, x: number, groundY: number, w: number) => {
  const h = (w * 100) / 140
  return `<svg x="${x}" y="${(groundY - h * 0.8).toFixed(1)}" width="${w}" height="${h.toFixed(1)}" viewBox="0 0 140 100" overflow="visible">${inner}</svg>`
}

// Céu: estrelas de vários tamanhos, cada uma no seu ritmo, acendendo forte e sumindo; algumas viram brilho de quatro pontas.
let seed = 7
const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
const inText = (x: number, y: number) => x > 36 && x < 630 && y > 44 && y < 222
const stars = Array.from({ length: 90 }, (_, i) => {
  const x = Math.round(rnd() * 990 + 5)
  const y = Math.round(rnd() * 235 + 6)
  if (inText(x, y)) return ''
  const dur = (2.4 + rnd() * 4).toFixed(1)
  const delay = (rnd() * 6).toFixed(1)
  const anim = `animation-duration:${dur}s;animation-delay:-${delay}s`
  if (i % 7 === 0) {
    const k = (0.7 + rnd() * 0.6).toFixed(2)
    return `<g transform="translate(${x} ${y}) scale(${k})"><path class="tw" style="${anim}" filter="url(#glow)" d="M0 -7 Q1 -1 7 0 Q1 1 0 7 Q-1 1 -7 0 Q-1 -1 0 -7Z" fill="#fff6dc"/></g>`
  }
  const r = (0.6 + rnd() * 1.1).toFixed(1)
  return `<circle class="tw" style="${anim}" cx="${x}" cy="${y}" r="${r}" fill="${i % 3 ? '#ffffff' : '#cfe0ff'}"/>`
}).join('')

const G = 268 // o chão
export const header = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" width="1000" height="300">
<title>Saulo Rocha · Líder de Guilda</title>
<style>.tw{transform-box:fill-box;transform-origin:center;animation:tw 4s ease-in-out infinite}@keyframes tw{0%,100%{opacity:.08;transform:scale(.45)}45%,55%{opacity:1;transform:scale(1.25)}}
.shoot{opacity:0;animation:shoot 11s ease-in infinite}@keyframes shoot{0%{opacity:0;transform:translateX(0)}1%{opacity:1}7%{opacity:0;transform:translateX(330px)}100%{opacity:0;transform:translateX(330px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.tw{opacity:.7}}</style>
<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141a2d"/><stop offset="1" stop-color="#262d4a"/></linearGradient>
<filter id="glow" x="-1" y="-1" width="3" height="3"><feGaussianBlur stdDeviation="1.8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<linearGradient id="trail" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
<clipPath id="r"><rect width="1000" height="300" rx="16"/></clipPath></defs>
<g clip-path="url(#r)">
<rect width="1000" height="300" fill="url(#sky)"/>
${stars}
<g transform="translate(330 22) rotate(18)"><g class="shoot"><line x1="0" y1="0" x2="70" y2="0" stroke="url(#trail)" stroke-width="1.8" stroke-linecap="round"/><circle cx="70" cy="0" r="1.8" fill="#fff" filter="url(#glow)"/></g></g>
<circle cx="690" cy="58" r="16" fill="#f1e6c8"/><circle cx="698" cy="52" r="14" fill="#1a2036"/>
<path d="M0 300 V${G + 4} Q300 ${G - 6} 640 ${G} T1000 ${G - 2} V300 Z" fill="#1b2034"/>
<path d="M0 ${G + 4} Q300 ${G - 6} 640 ${G} T1000 ${G - 2}" stroke="#2f3756" stroke-width="2" fill="none"/>
</g>
<text x="52" y="92" font-family="${SANS}" font-size="46" font-weight="700" fill="#f4ead5" letter-spacing=".5">Saulo Rocha</text>
<text x="54" y="130" font-family="${SANS}" font-size="19" fill="#c8cee8">Liderança de engenharia · ferramentas de IA para times de dev</text>
<text x="54" y="160" font-family="${SANS}" font-size="15.5" fill="#8f98ba">Belo Horizonte · Ciência da Computação (UFOP)</text>
<rect x="52" y="182" width="238" height="30" rx="15" fill="${GOLD}" fill-opacity=".14" stroke="${GOLD}" stroke-opacity=".6"/>
<text x="171" y="202" text-anchor="middle" font-family="${MONO}" font-size="14" fill="#f0c66c">classe: Líder de Guilda</text>
${nest(teams(), 636, 150, 90)}
${nest(antigravity(), 311, G - 2, 108)}
${nest(cursor(), 402, G - 1, 106)}
${nest(codex(), 492, G, 106)}
${nest(spriteInner('invocador', 'work'), 589, G, 112)}
${nest(spriteInner('engenheiro', 'work'), 694, G, 112)}
${nest(lider(), 805, G, 190)}
</svg>`

const solo = (name: string, inner: string) =>
  writeFileSync(`assets/personagens/${name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 100" width="280" height="200" overflow="visible">${inner}</svg>`)
mkdirSync('assets/personagens', { recursive: true })
solo('lider', lider())
solo('codex', codex())
solo('cursor', cursor())
solo('antigravity', antigravity())
solo('teams', teams())
writeFileSync('assets/header.svg', header())
console.log('ok')
