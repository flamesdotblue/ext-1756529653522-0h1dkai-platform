import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import HeroCover from './components/HeroCover';
import GameBoard from './components/GameBoard';
import HUD from './components/HUD';
import Controls from './components/Controls';

const COLS = 10;
const ROWS = 20;

const PIECES = {
  I: {
    color: 'bg-rose-400',
    shapes: [
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
      [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
      ],
    ],
  },
  J: {
    color: 'bg-rose-500',
    shapes: [
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0],
      ],
    ],
  },
  L: {
    color: 'bg-rose-600',
    shapes: [
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0],
      ],
      [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  O: {
    color: 'bg-rose-300',
    shapes: [
      [
        [1, 1],
        [1, 1],
      ],
    ],
  },
  S: {
    color: 'bg-rose-700',
    shapes: [
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1],
      ],
      [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0],
      ],
      [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  T: {
    color: 'bg-rose-800',
    shapes: [
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0],
      ],
    ],
  },
  Z: {
    color: 'bg-rose-900',
    shapes: [
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
      [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ],
      [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1],
      ],
      [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0],
      ],
    ],
  },
};

const PIECE_KEYS = Object.keys(PIECES);

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
}

function getRandomBag() {
  const bag = [...PIECE_KEYS];
  // Fisher-Yates
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

function App() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [bag, setBag] = useState(getRandomBag());
  const [nextQueue, setNextQueue] = useState([]);
  const [current, setCurrent] = useState(null); // {type, rot, x, y}
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [clearedRows, setClearedRows] = useState([]);

  const gravityRef = useRef(null);

  const speedMs = useMemo(() => Math.max(1000 - (level - 1) * 75, 120), [level]);

  const spawnPiece = useCallback((initial = false) => {
    let pool = [...bag];
    if (pool.length === 0) pool = getRandomBag();
    const type = pool.shift();
    setBag(pool);

    // build next queue
    let q = [...nextQueue];
    while (q.length < 3) {
      if (pool.length === 0) pool = getRandomBag();
      q.push(pool.shift());
    }
    setNextQueue(q);

    const shape0 = PIECES[type].shapes[0];
    const startX = Math.floor((COLS - shape0[0].length) / 2);
    const startY = -shape0.length; // start above board for smooth spawn

    const newPiece = { type, rot: 0, x: startX, y: startY };
    // if collides immediately -> game over
    if (collides(board, newPiece)) {
      setGameOver(true);
      setPaused(true);
    }
    setCurrent(newPiece);
  }, [bag, nextQueue, board]);

  useEffect(() => {
    // initialize
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setPaused(false);
    setGameOver(false);
    setBag(getRandomBag());
  }, []);

  useEffect(() => {
    if (!current && !gameOver) spawnPiece(true);
  }, [current, gameOver, spawnPiece]);

  useEffect(() => {
    if (paused || gameOver) {
      if (gravityRef.current) clearInterval(gravityRef.current);
      return;
    }
    gravityRef.current = setInterval(() => {
      softDrop();
    }, speedMs);
    return () => clearInterval(gravityRef.current);
  }, [paused, gameOver, speedMs]);

  const collides = useCallback((brd, piece) => {
    const shape = PIECES[piece.type].shapes[piece.rot % PIECES[piece.type].shapes.length];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const bx = piece.x + x;
        const by = piece.y + y;
        if (bx < 0 || bx >= COLS || by >= ROWS) return true;
        if (by >= 0 && brd[by][bx]) return true;
      }
    }
    return false;
  }, []);

  const mergePiece = useCallback((brd, piece) => {
    const newBoard = brd.map(row => [...row]);
    const shape = PIECES[piece.type].shapes[piece.rot % PIECES[piece.type].shapes.length];
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (!shape[y][x]) continue;
        const bx = piece.x + x;
        const by = piece.y + y;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          newBoard[by][bx] = piece.type;
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((brd) => {
    const fullRows = [];
    for (let y = 0; y < ROWS; y++) {
      if (brd[y].every(v => v !== 0)) fullRows.push(y);
    }
    if (fullRows.length === 0) return { board: brd, cleared: 0 };

    setClearedRows(fullRows);

    const nb = [];
    let cleared = 0;
    for (let y = 0; y < ROWS; y++) {
      if (!fullRows.includes(y)) nb.push([...brd[y]]);
      else cleared++;
    }
    while (nb.length < ROWS) nb.unshift(Array(COLS).fill(0));
    return { board: nb, cleared };
  }, []);

  const scoreForClears = (c) => {
    switch (c) {
      case 1: return 100;
      case 2: return 300;
      case 3: return 500;
      case 4: return 800;
      default: return 0;
    }
  };

  const lockPiece = useCallback(() => {
    if (!current) return;
    const merged = mergePiece(board, current);
    const { board: afterClear, cleared } = clearLines(merged);

    if (cleared > 0) {
      setScore(s => s + scoreForClears(cleared) * level);
      setLines(l => {
        const nl = l + cleared;
        setLevel(1 + Math.floor(nl / 10));
        return nl;
      });
      // little delay to show ripple effect
      setTimeout(() => {
        setBoard(afterClear);
        setClearedRows([]);
      }, 150);
    } else {
      setBoard(afterClear);
    }

    // spawn next from queue
    if (nextQueue.length > 0) {
      const type = nextQueue[0];
      const rest = nextQueue.slice(1);
      let pool = [...bag];
      if (rest.length < 3) {
        if (pool.length === 0) pool = getRandomBag();
        rest.push(pool.shift());
        setBag(pool);
      }
      setNextQueue(rest);
      const shape0 = PIECES[type].shapes[0];
      const startX = Math.floor((COLS - shape0[0].length) / 2);
      const startY = -shape0.length;
      const newPiece = { type, rot: 0, x: startX, y: startY };
      if (collides(afterClear, newPiece)) {
        setGameOver(true);
        setPaused(true);
      }
      setCurrent(newPiece);
    } else {
      spawnPiece();
    }
  }, [current, board, clearLines, mergePiece, nextQueue, bag, level, spawnPiece, collides]);

  const move = useCallback((dx) => {
    if (!current || paused || gameOver) return;
    const candidate = { ...current, x: current.x + dx };
    if (!collides(board, candidate)) setCurrent(candidate);
  }, [current, board, paused, gameOver, collides]);

  const rotate = useCallback(() => {
    if (!current || paused || gameOver) return;
    const maxRots = PIECES[current.type].shapes.length;
    const candidate = { ...current, rot: (current.rot + 1) % maxRots };
    // simple wall kicks
    const kicks = [0, -1, 1, -2, 2];
    for (let k of kicks) {
      const kicked = { ...candidate, x: candidate.x + k };
      if (!collides(board, kicked)) {
        setCurrent(kicked);
        return;
      }
    }
  }, [current, board, paused, gameOver, collides]);

  const softDrop = useCallback(() => {
    if (!current || paused || gameOver) return;
    const candidate = { ...current, y: current.y + 1 };
    if (!collides(board, candidate)) {
      setCurrent(candidate);
    } else {
      lockPiece();
    }
  }, [current, paused, gameOver, board, collides, lockPiece]);

  const hardDrop = useCallback(() => {
    if (!current || paused || gameOver) return;
    let y = current.y;
    while (true) {
      const candidate = { ...current, y: y + 1 };
      if (!collides(board, candidate)) y++;
      else break;
    }
    setCurrent(c => c ? { ...c, y } : c);
    setScore(s => s + 2 * (y - current.y));
    setTimeout(() => lockPiece(), 0);
  }, [current, paused, gameOver, board, collides, lockPiece]);

  const togglePause = useCallback(() => setPaused(p => !p), []);

  const reset = useCallback(() => {
    setBoard(createEmptyBoard());
    setBag(getRandomBag());
    setNextQueue([]);
    setCurrent(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setPaused(false);
    setGameOver(false);
    setClearedRows([]);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowDown') softDrop();
      else if (e.key === 'ArrowUp') rotate();
      else if (e.code === 'Space') { e.preventDefault(); hardDrop(); }
      else if (e.key.toLowerCase() === 'p') togglePause();
      else if (e.key.toLowerCase() === 'r') reset();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [move, softDrop, rotate, hardDrop, togglePause, reset]);

  const ghostY = useMemo(() => {
    if (!current) return null;
    let y = current.y;
    while (true) {
      const candidate = { ...current, y: y + 1 };
      if (!collides(board, candidate)) y++;
      else break;
    }
    return y;
  }, [current, board, collides]);

  const nextPieces = useMemo(() => nextQueue.slice(0, 3), [nextQueue]);

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-white overflow-x-hidden">
      <HeroCover />

      <main className="relative mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Grid Ripple Tetris</h1>
            <p className="mt-2 text-neutral-400">A minimalist, interactive Tetris with a soft red, domino-like ripple aesthetic.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          <HUD score={score} lines={lines} level={level} next={nextPieces} />

          <GameBoard
            board={board}
            current={current}
            ghostY={ghostY}
            clearedRows={clearedRows}
          />

          <Controls
            onLeft={() => move(-1)}
            onRight={() => move(1)}
            onRotate={rotate}
            onSoftDrop={softDrop}
            onHardDrop={hardDrop}
            onPause={togglePause}
            onReset={reset}
            paused={paused}
            gameOver={gameOver}
          />
        </div>

        {gameOver && (
          <div className="mt-6 rounded-xl border border-rose-900/50 bg-rose-950/30 p-4 text-center">
            <p className="text-lg">Game Over</p>
            <p className="text-neutral-400 mb-3">Your score: {score}</p>
            <button onClick={reset} className="inline-flex items-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium hover:bg-rose-500 transition-colors">Play Again</button>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-neutral-500">
        Use arrow keys, up to rotate, space to hard drop. P to pause.
      </footer>
    </div>
  );
}

export default App;
