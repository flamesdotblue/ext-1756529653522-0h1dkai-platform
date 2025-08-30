import React from 'react';
import Spline from '@splinetool/react-spline';

function HeroCover() {
  return (
    <section className="relative h-[48vh] w-full sm:h-[60vh]">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/20 via-neutral-950/30 to-neutral-950 pointer-events-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-4 pb-8">
        <div className="backdrop-blur-sm/0">
          <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight">Domino Grid</h2>
          <p className="mt-3 max-w-xl text-neutral-200">Tap and drag the cubes. Then dive into an innovative Tetris experience inspired by the same ripple interaction.</p>
        </div>
      </div>
    </section>
  );
}

export default HeroCover;
