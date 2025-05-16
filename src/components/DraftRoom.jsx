import { useState, useEffect } from 'react';
import players from '../players.json';

const DraftRoom = () => {
  const [numCPUs, setNumCPUs] = useState(2);
  const [playersPool, setPlayersPool] = useState(players);
  const [drafted, setDrafted] = useState([]);
  const [teams, setTeams] = useState({});
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [drafting, setDrafting] = useState(false);
  const [started, setStarted] = useState(false);

  const maxPlayersPerTeam = 3;

  const startDraft = () => {
    const newOrder = ['You'];
    for (let i = 1; i <= numCPUs; i++) {
      newOrder.push(`CPU${i}`);
    }
    setDraftOrder(newOrder);

    const initialTeams = {};
    newOrder.forEach(d => {
      initialTeams[d] = [];
    });
    setTeams(initialTeams);
    setDrafting(true);
    setStarted(true);
  };

  const handlePick = (player) => {
    if (drafted.includes(player.id)) return;

    const drafter = draftOrder[currentPickIndex];
    setDrafted(prev => [...prev, player.id]);
    setTeams(prev => ({
      ...prev,
      [drafter]: [...prev[drafter], player]
    }));

    // Advance pick
    const totalPicks = draftOrder.length * maxPlayersPerTeam;
    const nextIndex = currentPickIndex + 1;
    if (drafted.length + 1 >= totalPicks) {
      setDrafting(false);
      return;
    }

    // Snake order handling
    const picksPerRound = draftOrder.length;
    const nextRound = Math.floor((nextIndex) / picksPerRound) + 1;
    const forward = nextRound % 2 === 1;
    const indexInOrder = nextIndex % picksPerRound;
    const newIndex = forward ? indexInOrder : (picksPerRound - 1 - indexInOrder);

    setCurrentPickIndex(newIndex);
    setRound(nextRound);
  };

  // CPU pick
  useEffect(() => {
    if (!drafting) return;
    const drafter = draftOrder[currentPickIndex];
    if (drafter !== 'You') {
      const available = playersPool.filter(p => !drafted.includes(p.id));
      const best = available.sort((a, b) => b.rating - a.rating)[0];
      setTimeout(() => handlePick(best), 500); // short delay to mimic thinking
    }
  }, [currentPickIndex, drafting]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">GOAT Draft - Snake Mode</h1>

      {!started && (
        <div className="space-y-2">
          <label>
            Select number of CPU players:
            <select
              className="ml-2 border border-gray-400 p-1"
              value={numCPUs}
              onChange={(e) => setNumCPUs(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <br />
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={startDraft}>
            Start Draft
          </button>
        </div>
      )}

      {started && (
        <div className="mt-4">
          <p><strong>Current Pick:</strong> {draftOrder[currentPickIndex]}</p>
          {drafting ? <p>Draft in Progress...</p> : <p>✅ Draft Complete</p>}

          {draftOrder[currentPickIndex] === 'You' && drafting && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Available Players:</h2>
              <ul>
                {playersPool
                  .filter(p => !drafted.includes(p.id))
                  .sort((a, b) => b.rating - a.rating)
                  .map(p => (
                    <li key={p.id} className="flex justify-between mb-1">
                      <span>{p.name} ({p.position}) - {p.rating}</span>
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded"
                        onClick={() => handlePick(p)}
                      >
                        Draft
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h2 className="font-bold mb-2">Teams</h2>
            {Object.entries(teams).map(([teamName, roster]) => (
              <div key={teamName} className="mb-4">
                <h3 className="underline">{teamName}'s Team:</h3>
                <ul>
                  {roster.map(p => (
                    <li key={p.id}>{p.name} ({p.position})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftRoom;
