import { useState } from 'react';
import { GhostBakeryGame } from './components/GhostBakeryGame';
import { CodeModal } from './components/CodeModal';
import { SINGLE_HTML_GAME_CODE } from './data/singleHtmlCode';
import { Code2, Gamepad2, Download, ExternalLink, Heart, Flame } from 'lucide-react';

export default function App() {
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0e0416] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#270938] via-[#11041b] to-[#07010c] text-white flex flex-col items-center justify-between p-3 sm:p-5 relative selection:bg-[#ff2d95] selection:text-white">
      {/* Top Header / Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between py-2 px-3 sm:px-5 mb-2 bg-[#1b0a2a]/60 border border-[#ff2d95]/30 rounded-2xl backdrop-blur-md shadow-[0_0_20px_rgba(255,45,149,0.15)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff2d95] to-[#990055] flex items-center justify-center text-lg shadow-[0_0_12px_#ff2d95]">
            👻
          </div>
          <div>
            <h1 className="font-black text-sm sm:text-base tracking-wide text-white flex items-center gap-1.5">
              <span>NEON PINK GHOST BAKERY</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-[#ff2d95]/20 text-[#ffb6df] border border-[#ff2d95]/40">
                2D Arcade
              </span>
            </h1>
            <p className="text-[11px] text-[#ffb6df] hidden sm:block">
              Toko kue hantu neon • Tangkap makanan pink & aktifkan Pink Overdrive!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            id="btn-download-html-top"
            href="/neon-pink-ghost-bakery.html"
            download="neon-pink-ghost-bakery.html"
            className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#ff2d95] text-white hover:bg-[#ff2d95]/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,45,149,0.4)] cursor-pointer"
            title="Unduh file HTML game lengkap"
          >
            <Download className="w-4 h-4" />
            <span className="inline">Unduh File .html</span>
          </a>

          <button
            id="btn-open-code-modal"
            onClick={() => setIsCodeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl font-bold text-xs bg-[#ff2d95]/20 text-[#ffb6df] border border-[#ff2d95]/50 hover:bg-[#ff2d95] hover:text-white transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,45,149,0.2)] cursor-pointer"
            title="Lihat dan salin kode file HTML tunggal"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden xs:inline">Lihat Kode</span>
          </button>

          <a
            href="/neon-pink-ghost-bakery.html"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-[#ffb6df] hover:text-white hover:bg-white/10 transition border border-white/10 cursor-pointer"
            title="Buka File Standalone di Tab Baru"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Main Game Screen Center */}
      <main className="w-full flex-1 flex flex-col items-center justify-center py-1">
        <GhostBakeryGame onOpenCodeModal={() => setIsCodeModalOpen(true)} />
      </main>

      {/* Quick Legend / Info Bar */}
      <footer className="w-full max-w-4xl mt-3 py-2 px-4 rounded-xl bg-[#140620]/70 border border-white/5 flex flex-wrap items-center justify-between text-xs text-[#ffd6ee] gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1 text-[#ffb6df]">
            <Gamepad2 className="w-3.5 h-3.5 text-[#ff2d95]" /> <strong>Kontrol:</strong> Tombol [Panah] / [A] [D] / Sentuh Layar
          </span>
          <span className="hidden md:inline text-zinc-600">•</span>
          <span className="flex items-center gap-1">
            🧁 <strong>Cupcake</strong> (+20)
          </span>
          <span className="flex items-center gap-1">
            🍩 <strong>Donat</strong> (+25)
          </span>
          <span className="flex items-center gap-1">
            🫧 <strong>Permen</strong> (+15)
          </span>
          <span className="flex items-center gap-1 text-purple-300">
            💣 <strong>Bom</strong> (-1 <Heart className="w-3 h-3 text-[#ff2d95] fill-[#ff2d95] inline" />)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-yellow-300 font-bold">
            <Flame className="w-3.5 h-3.5 text-[#ff2d95]" /> Overdrive: 5 Combo = Skor 2X (5 detik)
          </span>
        </div>
      </footer>

      {/* Single-File HTML View & Copy Modal */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        rawCode={SINGLE_HTML_GAME_CODE}
      />
    </div>
  );
}
