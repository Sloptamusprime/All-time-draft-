import { useState, useEffect } from 'react';
import { playerPool } from '../playerPool';

const DraftRoom = () => {
  const [players, setPlayers] = useState(playerPool);
  const [drafted, setDrafted] = useState([]);
  const [userTeam, setUserTeam] = useState([]);
  const [cpuTeam, setCpuTeam] = useState([]);
  const [turn, setTurn] = useState(0); // even = user, odd = CPU

  const handlePick = (player) => {
    if (drafted.includes(player.id)) return;

    setDrafted(prev => [...prev, player.id]);

    if (turn % 2 === 0) {
      setUserTeam(prev => [...prev, player]);
    } else {
      setCpuTeam(prev => [...prev, player]);
    }

    setTurn(prev => prev + 1);
  };

  useEffect(() => {
    if (turn % 2 === 1 && turn < 6) {
      const available = players.filter(p => !drafted.includes(p.id));
      const best = available.sort((a, b) => b.rating - a.rating)[0];

      if (best) {
        setTimeout(() => {
          handlePick(best);
        }, 1000); // 1 second delay
      }
    }
  }, [turn]);

  const availablePlayers = players.filter(p => !drafted.includes(p.id));

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">GOAT Draft - Test Mode</h1>
      <h2 className="mb-2">Turn: {turn % 2 === 0 ? 'You' : 'CPU'}</h2>

      {turn < 6 ? (
        <div className="grid grid-cols-2 gap-4">
          {availablePlayers.map(player => (
            <button
              key={player.id}
              onClick={() => handlePick(player)}
              disabled={turn % 2 === 1}
              className="border p-4 rounded bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              <p className="font-bold">{player.name}</p>
              <p>{player.position} | {player.rating}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mt-4">Draft Complete</h2>
          <div className="mt-4">
            <h3 className="font-bold">Your Team:</h3>
            <ul>{userTeam.map(p => <li key={p.id}>{p.name} ({p.position})</li>)}</ul>
          </div>
          <div className="mt-4">
            <h3 className="font-bold">CPU Team:</h3>
            <ul>{cpuTeam.map(p => <li key={p.id}>{p.name} ({p.position})</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftRoom;
