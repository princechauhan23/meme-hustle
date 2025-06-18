import React from 'react';
import { MemeDuelCard } from './MemeDuelCard';

export function MemeDuelPreview({ meme1, meme2 }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center my-8">
      <div className="flex-1">
        {meme1 ? <MemeDuelCard meme={meme1} /> : <div className="cyber-card p-8 text-center text-cyber-blue/60">Select Meme 1</div>}
      </div>
      <div className="text-4xl font-cyber text-cyber-pink font-bold mx-4">VS</div>
      <div className="flex-1">
        {meme2 ? <MemeDuelCard meme={meme2} /> : <div className="cyber-card p-8 text-center text-cyber-blue/60">Select Meme 2</div>}
      </div>
    </div>
  );
}
