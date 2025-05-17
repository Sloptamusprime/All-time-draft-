import React, { useState, useEffect } from 'react';
import players from '../players.json';
import PlayerCard from './PlayerCard';

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
  const [matchSummary, setMatchSummary] = useState('');


useEffect(() => {
  if (!drafting || playersLeft.length === 0) return;

  const drafter = draftOrder[currentPickIndex];
  if (drafter !== 'You') {
    const available = playersLeft.filter(p => !drafted.includes(p.id));
    const bestAvailable = available.sort((a, b) => b.rating - a.rating)[0];
    if (bestAvailable) {
      setTimeout(() => makePick(drafter, bestAvailable), 600); // delay to simulate thinking
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

    let nextIndex = currentPickIndex + 1;
    let newRound = round;

    if (nextIndex >= draftOrder.length) {
      nextIndex = 0;
      newRound++;
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

  const simulateMatch = () => {
  const allTeams = Object.entries(teams);
  if (allTeams.length < 2) return;

  const [userTeamName, userPlayers] = allTeams[0];
  const [cpuTeamName, cpuPlayers] = allTeams[1];

  let log = `🏟️ ${userTeamName} vs ${cpuTeamName}\n\n`;
  let userScore = 0;
  let cpuScore = 0;

  for (let min = 5; min <= 90; min += 5) {
    if (Math.random() < 0.2) { // 20% chance for a goal this segment
      if (Math.random() < 0.5) {
        const scorer = userPlayers.sort(() => 0.5 - Math.random()).sort((a, b) => b.rating - a.rating)[0];
        userScore++;
        log += `⚽ ${scorer.name} scored for YOU in the ${min}′!\n`;
      } else {
        const scorer = cpuPlayers.sort(() => 0.5 - Math.random()).sort((a, b) => b.rating - a.rating)[0];
        cpuScore++;
        log += `⚽ ${scorer.name} scored for CPU in the ${min}′!\n`;
      }
    }
  }

  log += `\n🔚 Final Score — You: ${userScore} | CPU: ${cpuScore}`;
  setMatchSummary(log);
};

  const draftComplete = playersLeft.length === 0;

  return (
    <>
      <h1 className="text-xl font-bold mb-2">GOAT Draft - Snake Mode</h1>
      {!started ? (
        <div>
          <label className="block mb-2">Number of CPU Opponents:</label>
          <select
            value={numCPUs}
            onChange={e => setNumCPUs(parseInt(e.target.value))}
            className="border px-2 py-1 rounded"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <button
            onClick={startDraft}
            className="ml-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Start Draft
          </button>
        </div>
      ) : (
        <>
          <p className="mb-2">Current Pick: {draftOrder[currentPickIndex]}</p>
          {draftComplete && <p className="mb-4 font-semibold">Draft Complete</p>}

{draftOrder.map(name => {
  const team = teams[name] || [];

  const grouped = {
    Forwards: team.filter(p => ['ST', 'FW', 'RW', 'LW'].includes(p.position)),
    Midfielders: team.filter(p => ['CM', 'CAM', 'CDM'].includes(p.position)),
    Defenders: team.filter(p => ['CB', 'LB', 'RB'].includes(p.position)),
    Goalkeeper: team.filter(p => p.position === 'GK'),
  };

return (
  <>
    <h1 className="text-xl font-bold mb-2">GOAT Draft - Snake Mode</h1>
    {!started ? (
      <div>
        <label className="block mb-2">Number of CPU Opponents:</label>
        <select
          value={numCPUs}
          onChange={e => setNumCPUs(parseInt(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[1, 2, 3, 4, 5].map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <button
          onClick={startDraft}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Start Draft
        </button>
      </div>
    ) : (
      <>
        <p className="mb-2">Current Pick: {draftOrder[currentPickIndex]}</p>
        {draftComplete && <p className="mb-4 font-semibold">Draft Complete</p>}

        {draftOrder.map(name => {
          const team = teams[name] || [];

          const grouped = {
            Forwards: team.filter(p => ['ST', 'FW', 'RW', 'LW'].includes(p.position)),
            Midfielders: team.filter(p => ['CM', 'CAM', 'CDM'].includes(p.position)),
            Defenders: team.filter(p => ['CB', 'LB', 'RB'].includes(p.position)),
            Goalkeeper: team.filter(p => p.position === 'GK'),
          };

          return (
            <div key={name} className="mt-4">
              <h3 className="font-medium">
                {name === 'You' ? 'Your Team:' : `${name}'s Team:`}
              </h3>
              {Object.entries(grouped).map(([label, players]) => (
                players.length > 0 && (
                  <div key={label}>
                    <strong>{label}:</strong>
                    <ul className="ml-4 list-disc">
                      {players.map(p => (
                        <li key={p.id}>{p.name} ({p.position})</li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          );
        })}

        <h2 className="mt-6 text-lg font-semibold">Available Players</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {playersLeft
            .filter(p => !drafted.includes(p.id))
            .map(player => (
              <button key={player.id} onClick={() => handlePick(player)}>
                <PlayerCard player={player} />
              </button>
          ))}
        </div>

        {!drafting && started && (
          <div className="mt-6">
            <button
              onClick={simulateMatch}
              className="px-4 py-2 bg-purple-600 text-white rounded"
            >
              Simulate Match
            </button>
          </div>
        )}

        {matchSummary && (
          <div className="mt-4 bg-black text-green-400 p-4 rounded whitespace-pre-wrap">
            {matchSummary}
          </div>
        )}

        <button
          onClick={resetDraft}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Restart Draft
               </button>
      </>
    )}
  </>
);
};

   
export default DraftRoom;

