import { useState, useEffect } from 'react';
import { playerPool } from '../playerPool';

const DraftRoom = () => {
  const [numCPUs, setNumCPUs] = useState(2); // User-selectable now
  const [players, setPlayers] = useState(playerPool);
  const [drafted, setDrafted] = useState([]);
  const [teams, setTeams] = useState({ You: [] });
  const [draftOrder, setDraftOrder] = useState([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [drafting, setDrafting] = useState(false);
  const [started, setStarted] = useState(false);

  const startDraft = () => {
    const newOrder = ['You'];
    for (let i = 1; i <= numCPUs; i++) {
      newOrder.push(`CPU${i}`);
    }
    setDraftOrder(newOrder);

    const initialTeams = { You: [] };
    newOrder.slice(1).forEach(cpu => (initialTeams[cpu] = []));
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

    const isLastPick = round * draftOrder.length >= 6; // Total of 6 picks for now
    if (isLastPick) {
      setDrafting(false);
      return;
    }

    const nextIndex = currentPickIndex + 1;
    if (nextIndex >= draftOrder.length) {
      setCurrentPickIndex(0);
      setRound(prev => prev + 1);
      setDraftOrder(prev => [...prev].reverse()); // Snake it
    } else {
      setCurrentPickIndex(nextIndex);
    }
  };

  useEffect(() => {
    const drafter = draftOrder[currentPickIndex];
    if (drafting && drafter !== 'You') {
      const available = players.filter(p => !drafted.includes(p.id));
      const best = available.sort((a, b) => b.rating - a.rating)[0];
      if (best) {
        setTimeout(() => handlePick(best), 1000);
      }
    }
  }, [currentPickIndex, draftOrder, drafting]);

  const availablePlayers = players.filter(p => !drafted.includes(p.id));

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">GOAT Draft - Snake Mode</h1>

      {!started && (
        <div className="mb-4">
          <label className="block mb-2 font-medium">Choose # of CPU opponents:</label>
          <select
            value={numCPUs}
            onChange={(e) => setNumCPUs(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            onClick={startDraft}
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Draft
          </button>
        </div>
      )}

      {started && (
        <>
          <h2 className="mb-2">Current Pick: {draftOrder[currentPickIndex]}</h2>

          {drafting ? (
            <div className="grid grid-cols-2 gap-4">
              {availablePlayers.map(player => (
                <button
                  key={player.id}
                  onClick={() => draftOrder[currentPickIndex] === 'You' && handlePick(player)}
                  disabled={draftOrder[currentPickIndex] !== 'You'}
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
              {Object.entries(teams).map(([team, roster]) => (
                <div key={team} className="mt-4">
                  <h3 className="font-bold">{team}'s Team:</h3>
                  <ul>{roster.map(p => <li key={p.id}>{p.name} ({p.position})</li>)}</ul>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DraftRoom;
