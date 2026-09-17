import React, { useState } from 'react';
import { Copy, Check, Download, ExternalLink, X, Code2 } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawCode: string;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose, rawCode }) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([rawCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'neon-pink-ghost-bakery.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#160822] border-2 border-[#ff2d95] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_0_35px_rgba(255,45,149,0.4)] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#ff2d95]/30 bg-[#12051c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#ff2d95]/20 text-[#ff2d95]">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-lg flex items-center gap-2">
                <span>File HTML Tunggal (Single-File HTML)</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ff2d95]/20 text-[#ffb6df] border border-[#ff2d95]/40">
                  HTML + CSS + JS Utuh
                </span>
              </h3>
              <p className="text-xs text-[#ffb6df]">
                Dapat langsung disimpan sebagai <code className="text-pink-300 font-mono">game.html</code> dan dibuka di browser apa pun tanpa dependensi.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#ffb6df] hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-6 py-3 bg-[#1c0b2b] border-b border-[#ff2d95]/20 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-300">
            Ukuran: <span className="text-pink-400 font-mono">{(rawCode.length / 1024).toFixed(1)} KB</span> • Total Baris: <span className="text-pink-400 font-mono">{rawCode.split('\n').length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-[#ff2d95] text-white hover:bg-[#ff2d95]/80 active:scale-95 transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,45,149,0.5)] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Semua Kode'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white/10 text-[#ffb6df] border border-[#ff2d95]/40 hover:bg-white/20 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .html</span>
            </button>

            <a
              href="/game.html"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 rounded-xl font-bold text-xs bg-white/10 text-white border border-white/20 hover:bg-white/20 transition flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka di Tab Baru</span>
            </a>
          </div>
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-auto p-4 bg-[#0c0312] font-mono text-xs text-pink-200/90 leading-relaxed selection:bg-[#ff2d95] selection:text-white">
          <pre className="whitespace-pre">{rawCode}</pre>
        </div>
      </div>
    </div>
  );
};
