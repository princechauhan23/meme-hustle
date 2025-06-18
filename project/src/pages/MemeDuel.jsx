import React, { useState, useEffect, useMemo } from 'react';
import { useMemeStore } from '../store/memeStore';
import { useAuthStore } from '../store/authStore';
import { MemeDuelPreview } from '../components/MemeDuelPreview';
import { CyberButton } from '../components/CyberButton';
import { socketService } from '../services/socketService';
import { toast } from 'react-hot-toast';
import { LiveBattleTimers } from '../components/LiveBattleTimers';

export function MemeDuel() {
  const { memes } = useMemeStore();
  const { user, token } = useAuthStore();
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedMeme1, setSelectedMeme1] = useState('');
  const [selectedMeme2, setSelectedMeme2] = useState('');
  const [timer, setTimer] = useState(60); // seconds
  const [countdown, setCountdown] = useState(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const [battles, setBattles] = useState([]);
  const [hostBattleId, setHostBattleId] = useState(null);

  // Websocket setup for real-time battles
  useEffect(() => {
    const socket = socketService.connect();
    socket.emit('getBattles');
    socket.on('battlesUpdate', (data) => {
      setBattles(data);
    });
    return () => {
      if (socket && socket.off) socket.off('battlesUpdate');
    };
  }, [battleStarted, showCreate]);

  // Countdown logic
  useEffect(() => {
    let interval;
    if (battleStarted && countdown > 0) {
      interval = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setBattleStarted(false);
      setCountdown(null);
      toast('Battle ended!');
    }
    return () => clearInterval(interval);
  }, [battleStarted, countdown]);

  // Filter memes for dropdown/search
  const filteredMemes = useMemo(() =>
    memes.filter(m => m.title.toLowerCase().includes(search.toLowerCase())), [memes, search]);

  // Prevent duplicate selection
  const meme1Options = filteredMemes.filter(m => m.id !== selectedMeme2);
  const meme2Options = filteredMemes.filter(m => m.id !== selectedMeme1);

  // Get meme objects
  const meme1 = memes.find(m => m.id === selectedMeme1);
  const meme2 = memes.find(m => m.id === selectedMeme2);

  // Start battle handler
  const handleStartBattle = async () => {
    if (!selectedMeme1 || !selectedMeme2 || !timer) {
      toast.error('Select both memes and timer!');
      return;
    }
    const battleData = {
      meme1: selectedMeme1,
      meme2: selectedMeme2,
      timer: new Date(timer * 1000).toISOString(),
      host: user.id,
    };
    const response = await fetch('https://meme-hustle-backend.vercel.app/api/memeDuel/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(battleData),
    });
    const data = await response.json();
    console.log(data);
    setHostBattleId(`${selectedMeme1}_${selectedMeme2}_${Date.now()}`);
    setBattleStarted(true);
    setCountdown(timer);
    toast.success('Battle started!');
  };

  // End battle handler (only host)
  const handleEndBattle = (battleId) => {
    const socket = socketService.connect();
    socket.emit('endBattle', { battleId });
    setBattleStarted(false);
    setCountdown(null);
    setHostBattleId(null);
    toast('Battle ended!');
  };

  return (
    <div className="min-h-screen bg-cyber-darker py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold font-cyber text-cyber-pink mb-2 md:mb-0">
            Meme Duel: Real-Time Battle Arena
          </h1>
          <div className="flex gap-2">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search memes..."
              className="cyber-input px-4 py-2 text-sm font-mono"
            />
            <CyberButton variant="accent" onClick={() => setShowCreate(v => !v)}>
              {showCreate ? 'Cancel' : 'Create Battle'}
            </CyberButton>
          </div>
        </div>

        {/* Create Battle */}
        {showCreate && (
          <div className="cyber-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="block mb-2 font-mono text-cyber-blue">Select Meme 1</label>
                <select
                  value={selectedMeme1}
                  onChange={e => setSelectedMeme1(e.target.value)}
                  className="cyber-input w-full"
                >
                  <option value="">-- Select Meme --</option>
                  {meme1Options.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-mono text-cyber-blue">Select Meme 2</label>
                <select
                  value={selectedMeme2}
                  onChange={e => setSelectedMeme2(e.target.value)}
                  className="cyber-input w-full"
                >
                  <option value="">-- Select Meme --</option>
                  {meme2Options.map(m => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block mb-2 font-mono text-cyber-blue">Battle End Time</label>
                <input
                  type="datetime-local"
                  value={timer && timer > Math.floor(Date.now() / 1000) ? new Date(timer * 1000).toISOString().slice(0, 16) : ''}
                  onChange={e => {
                    const dt = new Date(e.target.value);
                    if (!isNaN(dt.getTime()) && dt.getTime() > Date.now()) {
                      setTimer(Math.floor(dt.getTime() / 1000)); // store as UNIX timestamp (seconds)
                    } else {
                      setTimer('');
                    }
                  }}
                  className="cyber-input w-full"
                />
              </div>
              <div className="flex items-end">
                <CyberButton
                  variant="primary"
                  onClick={handleStartBattle}
                  disabled={!selectedMeme1 || !selectedMeme2 || !timer || selectedMeme1 === selectedMeme2}
                >
                  Start
                </CyberButton>
              </div>
            </div>
            {/* Preview */}
            <MemeDuelPreview meme1={meme1} meme2={meme2} />
          </div>
        )}

        {/* Battle List */}
        <div className="cyber-card p-6">
          <h2 className="text-xl font-cyber text-cyber-blue mb-4">Active Battles</h2>
          {battles.length === 0 && <div className="text-cyber-blue/60 font-mono">No battles running. Create one!</div>}
          {/* Live timer state for re-render */}
          <LiveBattleTimers battles={battles} memes={memes} user={user} handleEndBattle={handleEndBattle} setShowCreate={setShowCreate} />
        </div>
      </div>
    </div>
  );
}