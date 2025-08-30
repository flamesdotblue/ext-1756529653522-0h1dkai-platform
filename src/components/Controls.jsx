import React from 'react';
import { Play, Pause, RotateCw, ArrowDown, ArrowLeft, ArrowRight, Rocket, RefreshCw } from 'lucide-react';

function Button({ children, onClick, variant = 'default' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors active:scale-[0.98]';
  const styles = {
    default: 'bg-rose-600 hover:bg-rose-500',
    subtle: 'bg-white/5 hover:bg-white/10',
  };
  return (
    <button onClick={onClick} className={`${base} ${styles[variant]}`}>{children}</button>
  );
}

function Controls({ onLeft, onRight, onRotate, onSoftDrop, onHardDrop, onPause, onReset, paused, gameOver }) {
  return (
    <aside className="order-3 lg:order-3 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Button onClick={onLeft} variant="subtle"><ArrowLeft size={18} /> Left</Button>
        <Button onClick={onRotate} variant="subtle"><RotateCw size={18} /> Rotate</Button>
        <Button onClick={onRight} variant="subtle">Right <ArrowRight size={18} /></Button>
        <Button onClick={onSoftDrop} variant="subtle"><ArrowDown size={18} /> Drop</Button>
        <Button onClick={onHardDrop}><Rocket size={18} /> Hard Drop</Button>
        <Button onClick={onReset} variant="subtle"><RefreshCw size={18} /> Reset</Button>
      </div>

      <div className="flex gap-3">
        <Button onClick={onPause}>
          {paused ? (<><Play size={18} /> Resume</>) : (<><Pause size={18} /> Pause</>)}
        </Button>
        {gameOver && (
          <div className="rounded-xl border border-rose-900/50 bg-rose-950/30 px-4 py-2 text-sm">Game Over</div>
        )}
      </div>

      <div className="text-xs text-neutral-400">
        Arrow keys to move, Up to rotate, Space for hard drop. P to pause, R to reset.
      </div>
    </aside>
  );
}

export default Controls;
