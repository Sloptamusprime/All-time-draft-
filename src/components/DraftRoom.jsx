import React, { useState, useEffect } from 'react';
import players from '../players.json';

const DraftRoom = () => {
  const [numCPUs, setNumCPUs] = useState(2);
  const [draftOrder, setDraftOrder] = useState([]);
  const [playersLeft, setPlayersLeft] = useState(players);
  const [drafted, setDrafted] = useState([]);
  const [teams, setTeams] = useState({});
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [round, setRound] = useState(1);
  const [drafting, setDrafting] = useState(false);
  const [started, setStarted] = useState(false);
  const [userTeam, setUserTeam] = useState([]);

  useEffect(() => {
    if (!drafting || playersLeft.length === 0) return;

    const isUserTurn = draftOrder[currentPickIndex] === 'You';
    if (!isUserTurn) {
      const cpu = draftOrder[currentPickIndex];
      const available = playersLeft.filter(p => !drafted.includes(p.id));
      const bestAvailable = available.sort((a, b) => b.rating - a.rating)[0];
      if (bestAvailable) {
        makePick(cpu, bestAvailable);
      }
    }
  }, [drafting, currentPickIndex]);

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

  const makePick = (drafter, player) => {
    setDrafted(prev => [...prev, player.id]);
    setTeams(prev => ({
      ...prev,
      [drafter]: [...prev[drafter], player]
    }));
    setPlayersLeft(prev => prev.filter(p => p.id !== player.id));

    // Advance pick
    let nextIndex = currentPickIndex + 1;
    let newRound = round;
    let reversed = false;

    if (nextIndex >= draftOrder.length) {
      nextIndex = 0;
      newRound++;
      reversed = true;
      setDraftOrder(prev => [...prev].reverse());
    }

    setCurrentPickIndex(nextIndex);
    setRound(newRound);
  };

  const handlePick = (player) => {
    if (drafted.includes(player.id)) return;
    const drafter = draftOrder[currentPickIndex];
    makePick(drafter, player);
  };

  const resetDraft = () => {
    setPlayersLeft(players);
    setDrafted([]);
    setTeams({});
    setCurrentPickIndex(0);
    setRound(1);
    setDrafting(false);
    setStarted(false);
    setUserTeam([]);
  };

  return (
    <div>
      <h1>GOAT Draft - Snake Mode</h1>
      {!started ? (
        <div>
          <label>Number of CPU Opponents:</label>
          <select value={numCPUs} onChange={e => setNumCPUs(parseInt(e.target.value))}>
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button onClick={startDraft}>Start Draft</button>
        </div>
      ) : (
        <>
          <p>Current Pick: {draftOrder[currentPickIndex]}</p>
          <p>Draft {playersLeft.length === 0 ? 'Complete' : 'In Progress'}</p>

          {draftOrder.map(name => (
            <div key={name}>
              <h3>{name}'s Team:</h3>
              <ul>
                {(teams[name] || []).map(p => (
                  <li key={p.id}>{p.name} ({p.position})</li>
                ))}
              </ul>
            </div>
          ))}

          <h2>Available Players</h2>
          <ul>
            {playersLeft.filter(p => !drafted.includes(p.id)).map(player => (
              <li key={player.id}>
                <button onClick={() => handlePick(player)}>
                  {player.name} ({player.position}) - {player.rating}
                </button>
              </li>
            ))}
          </ul>

          <button onClick={resetDraft}>Restart Draft</button>
        </>
      )}
    </div>
  );
};

export default DraftRoom;
