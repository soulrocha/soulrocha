// Mural do perfil (bento): os blocos SVG animados do README.
//   node scripts/gerar-perfil.mjs   (da raiz deste repositório; gera assets/perfil/*.svg)
// Só usa o que o GitHub renderiza num <img>: SVG com CSS próprio, sem fonte nem imagem externa.
// Os personagens vêm dos SVGs de assets/ e são aninhados dentro de cada bloco.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')
const SAIDA = join(ASSETS, 'perfil')
mkdirSync(SAIDA, { recursive: true })

const C = {
  ceu1: '#141a2d', ceu2: '#262d4a', ouro: '#d9b26a', ouroClaro: '#f2c14e', laranja: '#d97757',
  teal: '#5fe3cf', roxo: '#a78bfa', texto: '#e6edf3', apagado: '#9aa4bf', li: '#0A66C2', painel: '#1b2138',
}
const SANS = "font-family:'Segoe UI',system-ui,-apple-system,sans-serif"
const MONO = "font-family:ui-monospace,'Cascadia Code',Consolas,monospace"
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Aninha um SVG de assets/ dentro de outro, na posição e no tamanho pedidos. */
const aninhar = (arquivo, x, y, w, h) => {
  const src = readFileSync(join(ASSETS, arquivo), 'utf8')
  const vb = src.match(/viewBox="([^"]+)"/)[1]
  return src.replace(/<svg[^>]*>/, `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${vb}" overflow="visible">`)
}

/** Estrelas determinísticas (mesma semente, mesmo céu). */
const estrelas = (w, h, n, semente = 7) => {
  let s = semente
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280)
  let out = ''
  for (let i = 0; i < n; i++) {
    out += `<circle class="tw" style="animation-duration:${(3 + rnd() * 4).toFixed(1)}s;animation-delay:-${(rnd() * 4).toFixed(1)}s" cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h).toFixed(0)}" r="${(0.6 + rnd() * 0.9).toFixed(1)}" fill="#cfe0ff"/>`
  }
  return out
}

/** Quebra texto em linhas de até `max` caracteres. */
const quebrar = (texto, max) => {
  const linhas = []
  let atual = ''
  for (const p of texto.split(' ')) {
    if ((atual + ' ' + p).trim().length > max) { linhas.push(atual.trim()); atual = p } else atual += ' ' + p
  }
  if (atual.trim()) linhas.push(atual.trim())
  return linhas
}

const CSS_BASE =
  `text{${SANS}}.mono{${MONO}}` +
  '.tw{transform-box:fill-box;transform-origin:center;animation:tw 4s ease-in-out infinite}@keyframes tw{0%,100%{opacity:.1;transform:scale(.5)}50%{opacity:1;transform:scale(1.2)}}' +
  '.shimmer{animation:shimmer 6s linear infinite}@keyframes shimmer{to{stroke-dashoffset:-1000}}' +
  '.pulse{transform-box:fill-box;transform-origin:center;animation:pulse 2s ease-out infinite}@keyframes pulse{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.6)}}' +
  '.shine{animation:shine 4.5s ease-in-out infinite}@keyframes shine{0%,55%{transform:translateX(-300px) skewX(-20deg)}100%{transform:translateX(1300px) skewX(-20deg)}}' +
  '.float{animation:float 3.4s ease-in-out infinite}@keyframes float{50%{transform:translateY(-5px)}}'
const REDUZIR = '@media (prefers-reduced-motion:reduce){*{animation:none!important}.tw{opacity:.7}.shine{display:none}}'

/** Moldura padrão: céu noturno, estrelas, borda dourada com um brilho que corre. */
const moldura = (w, h, miolo, { titulo, css = '', semEstrelas = false, fundo } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">` +
  `<title>${esc(titulo)}</title><style>${CSS_BASE}${css}${REDUZIR}</style>` +
  `<defs><linearGradient id="ceu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.ceu1}"/><stop offset="1" stop-color="${C.ceu2}"/></linearGradient>` +
  `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
  `<clipPath id="r"><rect width="${w}" height="${h}" rx="14"/></clipPath></defs>` +
  `<g clip-path="url(#r)"><rect width="${w}" height="${h}" fill="${fundo ?? 'url(#ceu)'}"/>${semEstrelas ? '' : estrelas(w, h, Math.round((w * h) / 9000))}${miolo}</g>` +
  `<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="13" fill="none" stroke="${C.ouro}" stroke-opacity=".35" stroke-width="1.5"/>` +
  `<rect class="shimmer" x="1" y="1" width="${w - 2}" height="${h - 2}" rx="13" fill="none" stroke="${C.ouroClaro}" stroke-width="2" pathLength="1000" stroke-dasharray="70 930" filter="url(#glow)"/>` +
  `</svg>`

/** Ícone "in" do LinkedIn em pixel: fundo azul, letras brancas onde há ".". */
const pixelIn = (x, y, t = 4) => {
  const g = ['############', '############', '##..########', '##..########', '############', '##..#.....##', '##..#..##..#', '##..#..##..#', '##..#..##..#', '##..#..##..#', '############', '############']
  let out = `<rect x="${x}" y="${y}" width="${12 * t}" height="${12 * t}" rx="${t * 1.5}" fill="${C.li}"/>`
  g.forEach((row, ry) => [...row].forEach((ch, rx) => { if (ch === '.') out += `<rect x="${x + rx * t}" y="${y + ry * t}" width="${t + 0.2}" height="${t + 0.2}" fill="#fff"/>` }))
  return out
}

const chips = (lista, x, y, cor = C.teal) => {
  let out = ''
  let cx = x
  for (const c of lista) {
    const w = c.length * 7.2 + 20
    out += `<rect x="${cx}" y="${y}" width="${w}" height="22" rx="11" fill="${cor}" fill-opacity=".12" stroke="${cor}" stroke-opacity=".45"/><text x="${cx + w / 2}" y="${y + 15}" text-anchor="middle" font-size="12" fill="${cor}" class="mono">${esc(c)}</text>`
    cx += w + 8
  }
  return out
}

/** Selo de status com um ponto pulsando, alinhado à direita em `x`. */
const pilula = (x, y, texto, cor) => {
  const w = texto.length * 7.5 + 34
  return `<rect x="${x - w}" y="${y}" width="${w}" height="24" rx="12" fill="${cor}" fill-opacity=".14" stroke="${cor}" stroke-opacity=".6"/>` +
    `<circle class="pulse" cx="${x - w + 14}" cy="${y + 12}" r="4" fill="${cor}"/><circle cx="${x - w + 14}" cy="${y + 12}" r="4" fill="${cor}"/>` +
    `<text x="${x - w + 26}" y="${y + 16.5}" font-size="12.5" font-weight="600" fill="${cor}">${esc(texto)}</text>`
}

const salvar = (nome, svg) => writeFileSync(join(SAIDA, nome), svg, 'utf8')

// ---------- Herói: o Líder de Guilda ----------
salvar('heroi.svg', moldura(640, 300,
  `<ellipse cx="155" cy="236" rx="90" ry="10" fill="#000" fill-opacity=".35"/>` +
  `<g class="float">${aninhar('personagens/lider.svg', 30, 60, 250, 180)}</g>` +
  `<text x="300" y="86" font-size="13" font-weight="700" letter-spacing="3" fill="${C.ouro}">LÍDER DE GUILDA</text>` +
  `<text x="300" y="126" font-size="36" font-weight="800" fill="${C.texto}">Saulo Rocha</text>` +
  `<text x="300" y="158" font-size="16" fill="${C.texto}" fill-opacity=".85">Coordenador de Tecnologia e</text>` +
  `<text x="300" y="180" font-size="16" fill="${C.texto}" fill-opacity=".85">Desenvolvimento · LUZA Group</text>` +
  chips(['liderança', 'integrações', 'agentes de IA'], 300, 204, C.ouro) +
  `<text x="300" y="256" font-size="13" fill="${C.apagado}">Belo Horizonte, Brasil · Ciência da Computação (UFOP)</text>`,
  { titulo: 'Saulo Rocha, Líder de Guilda: Coordenador de Tecnologia e Desenvolvimento na LUZA Group' }))

// ---------- LinkedIn ----------
salvar('linkedin.svg', moldura(340, 300,
  `<rect width="340" height="300" fill="${C.li}" fill-opacity=".25"/>` +
  `<circle class="pulse" cx="170" cy="110" r="34" fill="${C.li}" fill-opacity=".6"/>` +
  `<g class="float">${pixelIn(146, 86)}</g>` +
  `<text x="170" y="198" text-anchor="middle" font-size="21" font-weight="700" fill="${C.texto}">Vamos conversar</text>` +
  `<text x="170" y="222" text-anchor="middle" font-size="14" fill="${C.apagado}">liderança, engenharia e IA</text>` +
  `<rect x="80" y="240" width="180" height="36" rx="18" fill="${C.ouro}"/><text x="170" y="263" text-anchor="middle" font-size="15" font-weight="700" fill="${C.ceu1}">in/soulrocha →</text>` +
  `<rect class="shine" x="0" y="-20" width="70" height="340" fill="#fff" fill-opacity=".08"/>`,
  { titulo: 'Saulo Rocha no LinkedIn: in/soulrocha', semEstrelas: true }))

// ---------- Jornada: cargo, empresa e cliente, com a trilha se acendendo ----------
{
  const MARCOS = [
    { periodo: '2021 – 2023', cargo: 'Dev full stack', org: 'DTI Digital', cliente: 'Pottencial · Ânima' },
    { periodo: '2022 – 2025', cargo: 'Scrum Master', org: 'DTI Digital', cliente: 'Hermes Pardini · Grupo Fleury' },
    { periodo: '2025 – 2026', cargo: 'Squad Leader', org: 'DTI Digital', cliente: 'MRV&CO · 2 squads' },
    { periodo: '2026 – hoje', cargo: 'Coordenador de Tecnologia', org: 'LUZA Group', cliente: '' },
  ]
  const x0 = 130, x1 = 850, y = 96
  let m = `<text x="28" y="36" font-size="13" font-weight="700" letter-spacing="3" fill="${C.apagado}">A JORNADA</text>` +
    `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.ouro}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>` +
    `<line class="trilha" x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.ouro}" stroke-width="3" pathLength="100" stroke-dasharray="100 100"/>`
  MARCOS.forEach((mc, i) => {
    const x = x0 + (i * (x1 - x0)) / (MARCOS.length - 1)
    const ultimo = i === MARCOS.length - 1
    m += `<text x="${x}" y="${y - 22}" text-anchor="middle" font-size="12" class="mono" fill="${C.apagado}">${esc(mc.periodo)}</text>` +
      (ultimo ? `<circle class="pulse" cx="${x}" cy="${y}" r="9" fill="${C.ouroClaro}"/>` : '') +
      `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="3" transform="rotate(45 ${x} ${y})" fill="${ultimo ? C.ouroClaro : C.ceu2}" stroke="${C.ouro}" stroke-width="2"/>` +
      `<text x="${x}" y="${y + 38}" text-anchor="middle" font-size="15" font-weight="700" fill="${ultimo ? C.ouro : C.texto}">${esc(mc.cargo)}</text>` +
      `<text x="${x}" y="${y + 58}" text-anchor="middle" font-size="13" fill="${C.texto}" fill-opacity=".8">${esc(mc.org)}</text>` +
      (mc.cliente ? `<text x="${x}" y="${y + 78}" text-anchor="middle" font-size="12" fill="${C.teal}">${esc('cliente ' + mc.cliente)}</text>` : '')
  })
  salvar('jornada.svg', moldura(1000, 200, m, {
    titulo: 'Jornada: na DTI Digital, dev full stack (Pottencial, Ânima), Scrum Master (Hermes Pardini, Grupo Fleury) e Squad Leader (MRV&CO); hoje Coordenador de Tecnologia na LUZA Group',
    css: '.trilha{stroke-dashoffset:100;animation:trilha 6s ease-in-out infinite}@keyframes trilha{0%{stroke-dashoffset:100}60%,100%{stroke-dashoffset:0}}',
  }))
}

// ---------- Quests e contribuição ----------
const QUESTS = [
  { slug: 'hero', nome: 'Claude Code Hero Journey', status: 'beta', cor: C.laranja, sprite: ['aprendiz.svg', 168, 120],
    desc: 'HUD de RPG para o Claude Code: os Clawds mostram o que o agente está fazendo, um dragão barra os arquivos sensíveis e um grimório guarda o que você aprendeu.',
    chips: ['TypeScript', 'app desktop'] },
  { slug: 'snapmd', nome: 'snapmd', status: 'ativo', cor: C.teal, sprite: ['ladino.svg', 168, 120],
    desc: 'Extensão para Chrome e Edge que transforma a página viva (formulários, grids, modais, iframes) em Markdown pronto para LLM. 100% local.',
    chips: ['JavaScript', 'Chrome · Edge'] },
  { slug: 'cb', nome: 'CareerBounty', status: 'ativo', cor: C.ouro, sprite: ['careerbounty.svg', 64, 64],
    desc: 'Agente completo no Claude Code: CLI determinística em Node, subagentes e painel local. Só usa fatos com prova, e um hook barra o que você não aprovou.',
    chips: ['Node', '0 deps npm'] },
]
for (const q of QUESTS) {
  const [arq, vw, vh] = q.sprite
  const alt = q.slug === 'cb' ? 70 : 92, larg = alt * (vw / vh)
  salvar(`quest-${q.slug}.svg`, moldura(326, 300,
    `<rect width="326" height="128" fill="${q.cor}" fill-opacity=".1"/>` +
    `<g class="float">${aninhar(arq, (326 - larg) / 2, (128 - alt) / 2 + 4, larg, alt)}</g>` +
    pilula(312, 12, q.status, q.cor) +
    `<text x="18" y="160" font-size="18" font-weight="700" fill="${q.cor}">${esc(q.nome)}</text>` +
    quebrar(q.desc, 40).slice(0, 4).map((l, i) => `<text x="18" y="${184 + i * 18}" font-size="13" fill="${C.texto}" fill-opacity=".82">${esc(l)}</text>`).join('') +
    chips(q.chips, 18, 262, q.cor),
    { titulo: `${q.nome}: ${q.desc}`, semEstrelas: true, fundo: C.painel }))
}
{
  const desc = 'Contribuição open source: levei ao Windows a escolha de onde a ilha fica, em qualquer monitor.'
  salvar('contrib.svg', moldura(326, 300,
    `<text x="18" y="40" font-size="13" font-weight="700" letter-spacing="3" fill="${C.apagado}">CONTRIBUIÇÃO</text>` +
    pilula(312, 22, 'PR aberto', C.roxo) +
    `<text x="163" y="108" text-anchor="middle" font-size="54" fill="${C.roxo}" fill-opacity=".85" filter="url(#glow)" class="mono">&lt;/&gt;</text>` +
    `<text x="18" y="160" font-size="18" font-weight="700" fill="${C.roxo}">Coucou · PR #879</text>` +
    quebrar(desc, 40).map((l, i) => `<text x="18" y="${184 + i * 18}" font-size="13" fill="${C.texto}" fill-opacity=".82">${esc(l)}</text>`).join('') +
    chips(['open source', 'Windows'], 18, 262, C.roxo),
    { titulo: `Coucou, PR #879: ${desc}`, semEstrelas: true, fundo: C.painel }))
}

// ---------- A guilda ----------
salvar('guilda.svg', moldura(1000, 200,
  `<text x="28" y="36" font-size="13" font-weight="700" letter-spacing="3" fill="${C.apagado}">A GUILDA</text>` +
  [['aprendiz.svg', 'Claude Code', 168, 120], ['personagens/codex.svg', 'Codex', 140, 100], ['personagens/cursor.svg', 'Cursor', 140, 100], ['personagens/antigravity.svg', 'Antigravity', 140, 100]].map(([f, n, vw, vh], i) => {
    const alt = 114, larg = alt * (vw / vh), cx = 140 + i * 240
    return `<g class="float" style="animation-delay:-${i * 0.8}s">${aninhar(f, cx - larg / 2, 40, larg, alt)}</g>` +
      `<text x="${cx}" y="182" text-anchor="middle" font-size="14" font-weight="600" fill="${C.texto}">${n}</text>`
  }).join(''),
  { titulo: 'A guilda: Claude Code, Codex, Cursor e Antigravity' }))

console.log('Blocos gerados em', SAIDA)
