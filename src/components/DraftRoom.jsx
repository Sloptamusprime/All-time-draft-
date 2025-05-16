import { useState, useEffect } from 'react';
import playerData from '../players.json';

const DraftRoom = () => {
  const [numCPUs, setNumCPUs] = useState(2);
  const [players, setPlayers] = useState(playerData);
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
  };

  const initialTeams = { You: [] };
  draftOrder.slice(1).forEach(cpu => (initialTeams[cpu] = []));

  const handlePick = (player) => {
    if (drafted.includes(player.id)) return;
    const drafter = draftOrder[currentPickIndex];
    setDrafted(prev => [...prev, player.id]);
    setTeams(prev => ({
      ...prev,
      [drafter]: [...prev[drafter], player]
    }));
  };

  useEffect(() => {
    if (drafting && drafted.length < draftOrder.length * 3) {
      const drafter = draftOrder[currentPickIndex];
      if (drafter.startsWith('CPU')) {
        const available = players.filter(p => !drafted.includes(p.id));
        const bestAvailable = available.sort((a, b) => b.rating - a.rating)[0];
        setTimeout(() => handlePick(bestAvailable), 500);
      }
    }
  }, [currentPickIndex, drafting, drafted, draftOrder, players]);

  useEffect(() => {
    if (drafted.length > 0 && drafted.length < draftOrder.length * 3) {
      let nextIndex = currentPickIndex + 1;
      if (round % 2 === 0) {
        if (nextIndex >= draftOrder.length) {
          setRound(prev => prev + 1);
          setCurrentPickIndex(draftOrder.length - 1);
        } else {
          setCurrentPickIndex(nextIndex);
        }
      } else {
        if (nextIndex >= draftOrder.length) {
          setRound(prev => prev + 1);
          setCurrentPickIndex(draftOrder.length - 1);
        } else {
          setCurrentPickIndex(nextIndex);
        }
      }
    }
  }, [drafted]);

  return (
    <div className="p-6">
      <h1>GOAT Draft - Snake Mode</h1>
      {!started && (
        <div>
          <label>Number of CPUs: </label>
          <select value={numCPUs} onChange={(e) => setNumCPUs(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button onClick={() => {
            startDraft();
            setTeams(initialTeams);
            setDrafting(true);
            setStarted(true);
          }}>Start Draft</button>
        </div>
      )}
      {started && (
        <div>
          <p>Current Pick: {draftOrder[currentPickIndex]}</p>
          <p>{drafted.length === draftOrder.length * 3 ? 'Draft Complete' : ''}</p>
          <div className="grid grid-cols-2 gap-4">
            {players.filter(p => !drafted.includes(p.id)).map(player => (
              <button key={player.id} onClick={() => handlePick(player)}>
                {player.name} ({player.position})
              </button>
            ))}
          </div>
          <div className="mt-6">
            {Object.entries(teams).map(([teamName, squad]) => (
              <div key={teamName} className="mb-4">
                <h2>{teamName}'s Team:</h2>
                <ul>
                  {squad.map(player => (
                    <li key={player.id}>{player.name} ({player.position})</li>
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
