"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Palette, FilePlus, FolderOpen, Save, Share2, Images, Maximize, Minimize, ChevronDown, Globe,
  Shuffle, ArrowDownAZ, Image as ImageIcon, Plus, Pencil, ChevronRight, ChevronLeft,
} from 'lucide-react';

const DEFAULT_ENTRIES = ['Ali', 'Beatriz', 'Charles', 'Diya', 'Eric', 'Fatima', 'Gabriel', 'Hanna'];

const COLORS = ['#3369e8', '#d50f25', '#eeb211', '#009925'];
const TEXT_COLORS = ['#ffffff', '#ffffff', '#000000', '#ffffff'];

const SPIN_DURATION = 10000;
const TAU = Math.PI * 2;

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

// Índices de las entradas favoritas (primer nombre "Ivan", con o sin tilde)
const favouredIndexes = (entries: string[]) =>
  entries.reduce<number[]>((acc, e, i) => (normalize(e).split(/\s+/)[0] === 'ivan' ? [...acc, i] : acc), []);

const segmentColor = (i: number, total: number) => {
  // Evita que el último segmento tenga el mismo color que el primero
  let c = i % COLORS.length;
  if (total > 1 && i === total - 1 && c === 0) c = 1;
  return c;
};

const lighten = (hex: string, amt: number) => {
  const n = parseInt(hex.slice(1), 16);
  const ch = (v: number) => Math.min(255, Math.round(v + (255 - v) * amt));
  return `rgb(${ch(n >> 16)}, ${ch((n >> 8) & 255)}, ${ch(n & 255)})`;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

type Confetto = { x: number; y: number; vx: number; vy: number; rot: number; vr: number; color: string; w: number; h: number };

const TOOLBAR = [
  { icon: Palette, label: 'Personalizar' },
  { icon: FilePlus, label: 'Nuevo', action: 'new' },
  { icon: FolderOpen, label: 'Abrir' },
  { icon: Save, label: 'Guardar' },
  { icon: Share2, label: 'Compartir' },
  { icon: Images, label: 'Galería' },
] as const;

export default function RuletaPage() {
  const [text, setText] = useState(DEFAULT_ENTRIES.join('\n'));
  const [tab, setTab] = useState<'entries' | 'results'>('entries');
  const [results, setResults] = useState<string[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [winner, setWinner] = useState<{ name: string; index: number; color: string; textColor: string } | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [advanced, setAdvanced] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const confettiRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const spinningRef = useRef(false);
  const audioRef = useRef<AudioContext | null>(null);
  const lastTickRef = useRef(-1);
  const confettiParts = useRef<Confetto[]>([]);

  const entries = useMemo(() => text.split('\n').map(e => e.trim()).filter(Boolean), [text]);
  const entriesRef = useRef(entries);
  const pausedRef = useRef(false);
  const hintRef = useRef(true);

  const playTick = useCallback(() => {
    const ctx = audioRef.current;
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = 1800;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }, []);

  const playFanfare = useCallback(() => {
    const ctx = audioRef.current;
    if (!ctx) return;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const t = ctx.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.15, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (i === 3 ? 0.6 : 0.2));
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.65);
    });
  }, []);

  const drawArcText = (ctx: CanvasRenderingContext2D, str: string, c: number, radius: number, centerAngle: number, top: boolean, fontSize: number) => {
    ctx.save();
    ctx.font = `700 ${fontSize}px Quicksand, Roboto, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = fontSize * 0.22;
    ctx.strokeStyle = 'rgba(0,0,0,0.85)';
    ctx.fillStyle = '#ffffff';
    const widths = [...str].map(ch => ctx.measureText(ch).width + fontSize * 0.08);
    const total = widths.reduce((a, b) => a + b, 0) / radius;
    let angle = top ? centerAngle - total / 2 : centerAngle + total / 2;
    [...str].forEach((ch, i) => {
      const w = widths[i] / radius;
      angle += top ? w / 2 : -w / 2;
      ctx.save();
      ctx.translate(c + radius * Math.cos(angle), c + radius * Math.sin(angle));
      ctx.rotate(angle + (top ? Math.PI / 2 : -Math.PI / 2));
      ctx.strokeText(ch, 0, 0);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      angle += top ? w / 2 : -w / 2;
    });
    ctx.restore();
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const size = canvas.width;
    const c = size / 2;
    const r = size * 0.47;
    const list = entriesRef.current;
    const rot = rotationRef.current;

    ctx.clearRect(0, 0, size, size);

    // Sombra exterior
    ctx.save();
    ctx.beginPath();
    ctx.arc(c, c, r, 0, TAU);
    ctx.shadowColor = 'rgba(0,0,0,0.45)';
    ctx.shadowBlur = size * 0.025;
    ctx.fillStyle = '#2a2a2a';
    ctx.fill();
    ctx.restore();

    if (list.length > 0) {
      const seg = TAU / list.length;
      const fontSize = Math.max(size * 0.016, Math.min(size * 0.062, (r * seg) * 0.6));
      list.forEach((name, i) => {
        const start = rot + i * seg;
        const ci = segmentColor(i, list.length);
        const base = COLORS[ci];
        const grad = ctx.createRadialGradient(c, c, r * 0.15, c, c, r);
        grad.addColorStop(0, base);
        grad.addColorStop(1, lighten(base, 0.06));
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, r, start, start + seg);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.save();
        ctx.translate(c, c);
        ctx.rotate(start + seg / 2);
        ctx.fillStyle = TEXT_COLORS[ci];
        ctx.font = `600 ${fontSize}px Quicksand, Roboto, system-ui, sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        const maxWidth = r * 0.7;
        let label = name;
        if (ctx.measureText(label).width > maxWidth) {
          while (label.length > 1 && ctx.measureText(label + '…').width > maxWidth) label = label.slice(0, -1);
          label += '…';
        }
        ctx.fillText(label, r - size * 0.035, 0);
        ctx.restore();
      });
    }

    // Círculo central
    ctx.beginPath();
    ctx.arc(c, c, r * 0.2, 0, TAU);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Texto curvo de ayuda antes del primer giro
    if (hintRef.current && list.length > 0) {
      const fs = size * 0.075;
      drawArcText(ctx, 'haz clic para girar', c, r * 0.5, -Math.PI / 2, true, fs);
      drawArcText(ctx, 'o pulsa ctrl+enter', c, r * 0.5, Math.PI / 2, false, fs * 0.8);
    }

    // Puntero a la derecha (posición de las 3 en punto)
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = size * 0.01;
    ctx.beginPath();
    ctx.moveTo(size - size * 0.005, c - size * 0.032);
    ctx.lineTo(size - size * 0.005, c + size * 0.032);
    ctx.lineTo(size - size * 0.07, c);
    ctx.closePath();
    ctx.fillStyle = '#9e9e9e';
    ctx.fill();
    ctx.restore();
  }, []);

  useEffect(() => {
    entriesRef.current = entries;
    pausedRef.current = winner !== null;
    hintRef.current = !hasSpun;
    draw();
  }, [entries, winner, hasSpun, draw]);

  // Tamaño del canvas según pantalla y DPR
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const cssSize = canvas.getBoundingClientRect().width;
      const px = Math.round(cssSize * (window.devicePixelRatio || 1));
      if (px > 0 && canvas.width !== px) {
        canvas.width = px;
        canvas.height = px;
      }
      const conf = confettiRef.current;
      if (conf) {
        conf.width = window.innerWidth;
        conf.height = window.innerHeight;
      }
      draw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw, panelOpen]);

  // Giro lento en reposo
  useEffect(() => {
    let raf: number;
    const loop = () => {
      if (!spinningRef.current && !pausedRef.current) {
        rotationRef.current = (rotationRef.current + 0.0025) % TAU;
      }
      if (!spinningRef.current) draw();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const launchConfetti = useCallback(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const palette = [...COLORS, '#ff8fab', '#ffffff'];
    confettiParts.current = Array.from({ length: 220 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.3,
      y: canvas.height * 0.45,
      vx: (Math.random() - 0.5) * 18,
      vy: -Math.random() * 18 - 6,
      rot: Math.random() * TAU,
      vr: (Math.random() - 0.5) * 0.3,
      color: palette[Math.floor(Math.random() * palette.length)],
      w: 6 + Math.random() * 6,
      h: 10 + Math.random() * 8,
    }));
    const start = performance.now();
    const step = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      confettiParts.current.forEach(p => {
        p.vy += 0.45;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (now - start < 4000) requestAnimationFrame(step);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    requestAnimationFrame(step);
  }, []);

  const spin = useCallback(() => {
    const list = entriesRef.current;
    if (spinningRef.current || list.length === 0 || pausedRef.current) return;

    if (!audioRef.current) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) audioRef.current = new AC();
    }
    audioRef.current?.resume();

    const seg = TAU / list.length;
    const favoured = favouredIndexes(list);
    const target = favoured.length > 0
      ? favoured[Math.floor(Math.random() * favoured.length)]
      : Math.floor(Math.random() * list.length);

    // Punto aleatorio dentro del segmento (sin pegarse a los bordes) para que parezca natural
    const point = target * seg + seg * (0.12 + Math.random() * 0.76);
    const startRot = rotationRef.current;
    const delta = (((-point - startRot) % TAU) + TAU) % TAU;
    const extraSpins = 9 + Math.floor(Math.random() * 3);
    const endRot = startRot + extraSpins * TAU + delta;

    spinningRef.current = true;
    hintRef.current = false;
    setIsSpinning(true);
    setHasSpun(true);
    lastTickRef.current = -1;
    const t0 = performance.now();

    const animate = (now: number) => {
      const t = Math.min(1, (now - t0) / SPIN_DURATION);
      rotationRef.current = startRot + (endRot - startRot) * easeOut(t);

      const pointerAngle = (((-rotationRef.current) % TAU) + TAU) % TAU;
      const idx = Math.floor(pointerAngle / seg);
      if (idx !== lastTickRef.current) {
        if (lastTickRef.current !== -1) playTick();
        lastTickRef.current = idx;
      }
      draw();

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        rotationRef.current = endRot % TAU;
        spinningRef.current = false;
        setIsSpinning(false);
        const name = list[target];
        const ci = segmentColor(target, list.length);
        setWinner({ name, index: target, color: COLORS[ci], textColor: TEXT_COLORS[ci] });
        setResults(r => [name, ...r]);
        playFanfare();
        launchConfetti();
      }
    };
    requestAnimationFrame(animate);
  }, [draw, playTick, playFanfare, launchConfetti]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        spin();
      }
      if (e.key === 'Escape') setWinner(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [spin]);

  const handleShuffle = () => {
    const arr = [...entries];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setText(arr.join('\n'));
  };

  const handleSort = () => setText([...entries].sort((a, b) => a.localeCompare(b, 'es')).join('\n'));

  const handleRemoveWinner = () => {
    if (!winner) return;
    setText(entries.filter((_, i) => i !== winner.index).join('\n'));
    setWinner(null);
  };

  const handleNew = () => {
    if (isSpinning) return;
    setText(DEFAULT_ENTRIES.join('\n'));
    setResults([]);
    setHasSpun(false);
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  };

  const toolbarBtn = 'flex items-center gap-1.5 px-2.5 h-[50px] text-[14px] text-white/90 hover:bg-white/10 transition-colors';

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[#121212] text-white" style={{ fontFamily: 'Roboto, -apple-system, "Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      {/* Barra superior */}
      <header className="sticky top-0 z-20 bg-[#212121] shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between h-[50px] pl-3 pr-1">
          <button onClick={handleNew} className="flex items-center gap-2.5 h-[50px] pr-3">
            <svg viewBox="0 0 32 32" className="w-[30px] h-[30px]">
              {COLORS.map((col, i) => (
                <path key={i} d={`M16 16 L${16 + 15 * Math.cos(i * Math.PI / 2)} ${16 + 15 * Math.sin(i * Math.PI / 2)} A15 15 0 0 1 ${16 + 15 * Math.cos((i + 1) * Math.PI / 2)} ${16 + 15 * Math.sin((i + 1) * Math.PI / 2)} Z`} fill={col} />
              ))}
              <circle cx="16" cy="16" r="3.5" fill="#fff" />
            </svg>
            <span className="text-[20px] font-medium tracking-tight">Ruleta</span>
          </button>
          <nav className="hidden md:flex items-center">
            {TOOLBAR.map(({ icon: Icon, label, ...rest }) => (
              <button key={label} onClick={'action' in rest ? handleNew : undefined} className={toolbarBtn}>
                <Icon size={18} strokeWidth={2} />
                <span className="hidden lg:inline">{label}</span>
              </button>
            ))}
            <button onClick={toggleFullscreen} className={toolbarBtn}>
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
              <span className="hidden lg:inline">Pantalla completa</span>
            </button>
            <button className={toolbarBtn}>
              <span>Más</span>
              <ChevronDown size={16} />
            </button>
            <button className={toolbarBtn}>
              <Globe size={18} />
              <span className="hidden lg:inline">Español</span>
            </button>
          </nav>
          <button onClick={toggleFullscreen} className={`md:hidden ${toolbarBtn}`}>
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </header>

      <div className={`flex flex-col lg:flex-row gap-4 px-3 sm:px-4 py-4 lg:h-[calc(100vh-50px)]`}>
        {/* Ruleta */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center gap-3 text-[13px] text-white/60 h-8">
            <Pencil size={15} />
          </div>
          <div className="flex-1 flex items-center justify-center min-h-0">
            <div className="relative aspect-square w-full max-w-[min(100%,calc(100vh-130px))]">
              <canvas
                ref={canvasRef}
                onClick={spin}
                className={`w-full h-full ${isSpinning || entries.length === 0 ? 'cursor-default' : 'cursor-pointer'}`}
              />
              {entries.length === 0 && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/60 font-medium text-lg">
                  Añade nombres
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="relative flex lg:h-full">
          <button
            onClick={() => setPanelOpen(o => !o)}
            className="hidden lg:flex absolute -left-7 top-1 w-6 h-6 items-center justify-center rounded-full text-white/70 hover:bg-white/10"
            title={panelOpen ? 'Ocultar editor' : 'Mostrar editor'}
          >
            {panelOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>

          {panelOpen && (
            <aside className="w-full lg:w-[350px] flex flex-col bg-[#1d1d1d] rounded shadow-[0_1px_5px_rgba(0,0,0,0.3)] overflow-hidden">
              <div className="flex border-b border-white/10">
                {(['entries', 'results'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 h-12 flex items-center justify-center gap-2 text-[14px] font-medium relative transition-colors ${tab === t ? 'text-white' : 'text-white/60 hover:text-white/90'}`}
                  >
                    {t === 'entries' ? 'Nombres' : 'Resultados'}
                    <span className="min-w-[20px] h-[18px] px-1.5 rounded-full bg-[#373a60] text-[#ebecf8] text-[11px] leading-[18px]">
                      {t === 'entries' ? entries.length : results.length}
                    </span>
                    {tab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8c8fe0]" />}
                  </button>
                ))}
              </div>

              {tab === 'entries' ? (
                <div className="flex flex-col flex-1 min-h-0 p-3 gap-3">
                  <div className="flex gap-2">
                    <button onClick={handleShuffle} disabled={isSpinning} className="flex items-center gap-1.5 px-3 h-8 rounded bg-[#373a60] text-[#ebecf8] text-[13px] font-medium hover:brightness-110 disabled:opacity-50">
                      <Shuffle size={15} /> Mezclar
                    </button>
                    <button onClick={handleSort} disabled={isSpinning} className="flex items-center gap-1.5 px-3 h-8 rounded bg-[#373a60] text-[#ebecf8] text-[13px] font-medium hover:brightness-110 disabled:opacity-50">
                      <ArrowDownAZ size={15} /> Ordenar
                    </button>
                    <button className="flex items-center gap-1.5 pl-3 pr-2 h-8 rounded bg-[#373a60] text-[#ebecf8] text-[13px] font-medium hover:brightness-110">
                      <ImageIcon size={15} /> Añadir imagen <ChevronDown size={14} />
                    </button>
                  </div>
                  <label className="flex items-center gap-2 text-[13px] text-white/80 cursor-pointer select-none">
                    <input type="checkbox" checked={advanced} onChange={e => setAdvanced(e.target.checked)} className="w-4 h-4 accent-[#8c8fe0]" />
                    Avanzado
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSpinning}
                    spellCheck={false}
                    className="flex-1 min-h-[280px] w-full px-3 py-2 rounded border border-white/20 bg-transparent text-white text-[14px] leading-[22px] resize-none outline-none focus:border-[#8c8fe0]"
                    style={{ fontFamily: 'system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif' }}
                  />
                  <div className="flex">
                    <button className="flex items-center gap-1.5 pl-3 pr-2 h-8 rounded bg-[#373a60] text-[#ebecf8] text-[13px] font-medium hover:brightness-110">
                      <Plus size={15} /> Añadir ruleta <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col flex-1 min-h-0 p-3 gap-3">
                  <div className="flex gap-2">
                    <button onClick={() => setResults(r => [...r].sort((a, b) => a.localeCompare(b, 'es')))} disabled={results.length === 0} className="flex items-center gap-1.5 px-3 h-8 rounded bg-[#373a60] text-[#ebecf8] text-[13px] font-medium hover:brightness-110 disabled:opacity-50">
                      <ArrowDownAZ size={15} /> Ordenar
                    </button>
                    <button onClick={() => setResults([])} disabled={results.length === 0} className="px-3 h-8 rounded bg-[#373a60] text-[#ebecf8] text-[13px] font-medium hover:brightness-110 disabled:opacity-50">
                      Borrar la lista
                    </button>
                  </div>
                  <div className="flex-1 min-h-[280px] overflow-y-auto px-3 py-2 rounded border border-white/20 text-[14px] leading-[22px]">
                    {results.map((r, i) => <div key={i}>{r}</div>)}
                  </div>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>

      <canvas ref={confettiRef} className="pointer-events-none fixed inset-0 z-[120]" />

      {/* Modal ganador */}
      {winner && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4" onClick={() => setWinner(null)}>
          <div className="w-full max-w-[560px] bg-[#1d1d1d] rounded shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-3.5 font-medium text-[20px]" style={{ backgroundColor: winner.color, color: winner.textColor }}>
              ¡Tenemos un ganador!
            </div>
            <div className="px-6 py-10 text-center text-[44px] sm:text-[52px] font-medium text-white break-words leading-tight">
              {winner.name}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3">
              <button onClick={() => setWinner(null)} className="px-4 h-9 rounded text-[14px] font-medium text-white/90 hover:bg-white/10 uppercase tracking-wide">
                Cerrar
              </button>
              <button onClick={handleRemoveWinner} className="px-4 h-9 rounded text-[14px] font-medium bg-[#4a45b0] text-white hover:brightness-110 uppercase tracking-wide">
                Quitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
