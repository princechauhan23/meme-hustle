import React, { useEffect, useState } from 'react';
import { MemeDuelCard } from './MemeDuelCard';
import { CyberButton } from './CyberButton';
import { socketService } from '../services/socketService';

// Place this inside MemeDuel.jsx, below your main MemeDuel component
export function LiveBattleTimers({ battles, memes, user, handleEndBattle, setShowCreate }) {
  // This state triggers re-render every second
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const upvoteMeme = (memeId, battleId) => {
    const socket = socketService.connect();
    socket.emit('memeDuelvote', {
      memeId: memeId,
      battleId: battleId,
    });
    setShowCreate(false);
  }


  return (
    <div className="space-y-4">
      {battles.map(battle => {
        const m1 = memes.find(m => m.id === battle.meme1);
        const meme1Upvotes = battle.meme1Upvotes;
        const m2 = memes.find(m => m.id === battle.meme2);
        const meme2Upvotes = battle.meme2Upvotes;
        const now = Math.floor(Date.now() / 1000);
        const end = Math.floor(new Date(battle.timer).getTime() / 1000);
        let diff = end - now;
        if (diff < 0) diff = 0;
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = Math.floor(diff % 60).toString().padStart(2, '0');
        return (
          <div key={battle.id} className='border border-cyber-blue/20 rounded-lg p-4'>
            <div className="flex items-center justify-between gap-4 bg-cyber-dark/60">
              <div className="flex flex-col md:flex-row gap-8 justify-center items-center my-8">
                <div className="flex-1">{m1 ? <MemeDuelCard meme={m1} count={meme1Upvotes} battle={battle} upvoteMeme={diff === 0 ? () => { } : upvoteMeme} /> : null}</div>
                <div className="text-4xl font-cyber text-cyber-pink font-bold mx-4">VS</div>
                <div className="flex-1">{m2 ? <MemeDuelCard meme={m2} count={meme2Upvotes} battle={battle} upvoteMeme={diff === 0 ? () => { } : upvoteMeme} /> : null}</div>
              </div>
            </div>
            <div className="text-center text-2xl font-mono text-cyber-green mb-4 flex items-center justify-between">
              <div>{diff === 0 ? 'Battle ended' : `Battle ends in: ${h}:${m}:${s}`}</div>
              {battle.host === user.id && diff !== 0 && (
                <CyberButton variant="danger" onClick={() => handleEndBattle(battle.id)}>
                  End Battle
                </CyberButton>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}