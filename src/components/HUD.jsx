import React from 'react';

function MiniPreview({ type }) {
  const shapes = {
    I: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
    J: [[1,0,0],[1,1,1],[0,0,0]],
    L: [[0,0,1],[1,1,1],[0,0,0]],
    O: [[1,1],[1,1]],
    S: [[0,1,1],[1,1,0],[0,0,0]],
    T: [[0,1,0],[1,1,1],[0,0,0]],
    Z: [[1,1,0],[0,1,1],[0,0,0]],
  };
  const shape = type ? shapes[type] : null;

  if (!shape) return (
    <div className="grid h-24 w-24 place-items-center rounded-xl bg-white/5" />
  );

  const size = Math.max(shape.length, shape[0].length);

  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className={`grid gap-[4px]`} style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {Array.from({ length: size }).map((_, y) => (
          Array.from({ length: size }).map((__, x) => {
            const filled = shape[y]?.[x] === 1;
            return <div key={`${y}-${x}`} className={`aspect-square rounded-md ${filled ? 'bg-rose-500' : 'bg-white/5'}`} />;
          })
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="text-neutral-400 text-xs uppercase tracking-wider">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}

function HUD({ score, lines, level, next }) {
  return (
    <aside className="order-2 lg:order-1 space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Score" value={score} />
        <Stat label="Lines" value={lines} />
        <Stat label="Level" value={level} />
      </div>

      <div>
        <div className="mb-2 text-sm text-neutral-400">Next</div>
        <div className="flex items-center gap-3">
          {next.map((t, i) => (
            <MiniPreview key={i} type={t} />
          ))}
        </div>
      </div>
    </aside>
  );
}

export default HUD;
