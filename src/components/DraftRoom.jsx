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
  const [matchSummary, setMatchSummary] = useState('');

  useEffect(() => {
    if (!drafting || playersLeft.length === 0) return;

    const drafter = draftOrder[currentPickIndex];
    if (drafter !== 'You') {
      const available = playersLeft.filter(p => !drafted.includes(p.id));
      const bestAvailable = available.sort((a, b) => b.rating - a.rating)[0];
      if (bestAvailable) {
        setTimeout(() => makePick(drafter, bestAvailable), 600);
      }
    }
  }, [drafting, currentPickIndex]);

  const startDraft = () => {
    const newOrder = ['You'];
    for (let i = 1; i <= numCPUs; i++) {
      newOrder.push(`CPU${i}`);
    }

    const initialTeams = { You: [] };
    newOrder.slice(1).forEach(cpu => (initialTeams[cpu] = []));

    setDraftOrder(newOrder);
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
    if (playersLeft.length - 1 === 0) {
    setDrafting(false);
  }
};

  const handlePick = (player) => {
    if (drafted.includes(player.id)) return;
    const drafter = draftOrder[currentPickIndex];
    makePick(drafter, player);
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
      if (Math.random() < 0.2) {
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

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
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

          <div className="grid md:grid-cols-2 gap-8 mt-10">
            {draftOrder.map(name => {
              const team = teams[name] || [];

              const grouped = {
                Forwards: team.filter(p => ['ST', 'FW', 'RW', 'LW'].includes(p.position)),
                Midfielders: team.filter(p => ['CM', 'CAM', 'CDM'].includes(p.position)),
                Defenders: team.filter(p => ['CB', 'LB', 'RB'].includes(p.position)),
                Goalkeeper: team.filter(p => p.position === 'GK'),
              };

return (
  <div key={name} className="p-4 border rounded-lg shadow bg-white space-y-4">
    <h3 className="text-lg font-bold mb-2">
      {name === 'You' ? 'Your Team' : `${name}'s Team`}
    </h3>
    {Object.entries(grouped).map(([label, players]) =>
      players.length > 0 && (
        <div key={label} className="mb-6">
          <strong className="block text-sm text-gray-600 mb-1">{label}</strong>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {players.map((p) => (
              <li
                key={p.id}
                className="border border-gray-300 rounded px-2 py-1 bg-white shadow-sm"
              >
                {p.name} ({p.position})
              </li>
            ))}
          </ul>
        </div>
      )
    )}
  </div>
);

<div className="mt-16">
  <h2 className="text-2xl font-bold border-b pb-2 mb-4">Available Players</h2>
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
    {playersLeft
      .filter((p) => !drafted.includes(p.id))
      .map((player) => (
        <button
          key={player.id}
          onClick={() => handlePick(player)}
          className="hover:scale-105 transition-transform duration-200"
        >
          <PlayerCard player={player} />
        </button>
      ))}
  </div>
</div>

          {!drafting && started && (
            <div className="mt-8 text-center">
              <button
                onClick={simulateMatch}
                className="px-6 py-3 bg-purple-700 text-white rounded hover:bg-purple-800"
              >
                Simulate Match
              </button>
            </div>
          )}
        </div>
      ))}
    </div>

    {matchSummary && (
      <div className="mt-6 bg-gray-800 text-green-300 p-6 rounded-lg shadow whitespace-pre-wrap font-mono text-sm max-w-2xl mx-auto">
        {matchSummary}
      </div>
    )}
  );
};

export default DraftRoom;
