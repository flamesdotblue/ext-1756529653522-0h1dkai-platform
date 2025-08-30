import React, { useMemo } from 'react';

const COLS = 10;
const ROWS = 20;

const TYPE_TO_COLOR = {
  0: 'bg-white/5',
  I: 'bg-rose-400',
  J: 'bg-rose-500',
  L: 'bg-rose-600',
  O: 'bg-rose-300',
  S: 'bg-rose-700',
  T: 'bg-rose-800',
  Z: 'bg-rose-900',
};

function getShape(type, rot, pieces) {
  const shapes = pieces[type]?.shapes || [];
  return shapes[(rot ?? 0) % shapes.length];
}

// local PIECES signature to compute shape; kept minimal to avoid circular import
const PIECES = {
  I: {
    shapes: [
      [ [0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0] ],
      [ [0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0] ],
    ],
  },
  J: { shapes: [ [ [1,0,0],[1,1,1],[0,0,0] ], [ [0,1,1],[0,1,0],[0,1,0] ], [ [0,0,0],[1,1,1],[0,0,1] ], [ [0,1,0],[0,1,0],[1,1,0] ] ] },
  L: { shapes: [ [ [0,0,1],[1,1,1],[0,0,0] ], [ [0,1,0],[0,1,0],[0,1,1] ], [ [0,0,0],[1,1,1],[1,0,0] ], [ [1,1,0],[0,1,0],[0,1,0] ] ] },
  O: { shapes: [ [ [1,1],[1,1] ] ] },
  S: { shapes: [ [ [0,1,1],[1,1,0],[0,0,0] ], [ [0,1,0],[0,1,1],[0,0,1] ] ] },
  T: { shapes: [ [ [0,1,0],[1,1,1],[0,0,0] ], [ [0,1,0],[0,1,1],[0,1,0] ], [ [0,0,0],[1,1,1],[0,1,0] ], [ [0,1,0],[1,1,0],[0,1,0] ] ] },
  Z: { shapes: [ [ [1,1,0],[0,1,1],[0,0,0] ], [ [0,0,1],[0,1,1],[0,1,0] ] ] },
};

function GameBoard({ board, current, ghostY, clearedRows }) {
  const displayBoard = useMemo(() => {
    const grid = board.map((row) => [...row]);

    if (current) {
      const shape = getShape(current.type, current.rot, PIECES);
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (!shape[y][x]) continue;
          const bx = current.x + x;
          const by = current.y + y;
          if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) grid[by][bx] = current.type;
        }
      }

      if (typeof ghostY === 'number') {
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (!shape[y][x]) continue;
            const bx = current.x + x;
            const by = ghostY + y;
            if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
              // mark ghost with special token
              if (!grid[by][bx]) grid[by][bx] = 'G';
            }
          }
        }
      }
    }

    return grid;
  }, [board, current, ghostY]);

  return (
    <div className="relative mx-auto select-none">
      <div className="relative grid grid-cols-10 gap-[6px] rounded-2xl border border-white/10 bg-white/5 p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
        {displayBoard.map((row, y) => (
          <React.Fragment key={y}>
            {row.map((cell, x) => {
              const isGhost = cell === 'G';
              const colorClass = isGhost ? 'border border-rose-400/40 bg-transparent' : TYPE_TO_COLOR[cell] || 'bg-white/5';
              const ripple = clearedRows.includes(y) ? 'animate-[pulse_0.2s_ease-in-out_1] ring-1 ring-rose-500/40' : '';
              return (
                <div
                  key={`${y}-${x}`}
                  className={`aspect-square w-8 sm:w-10 rounded-lg ${colorClass} ${ripple} shadow-[0_1px_0_0_rgba(255,255,255,0.04),0_8px_20px_-12px_rgba(244,63,94,0.5)] transition-colors`}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
