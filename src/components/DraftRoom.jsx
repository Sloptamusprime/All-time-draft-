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
  const [tournamentWinner, setTournamentWinner] = useState(null);

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
    if (drafted.includes(player.id)) return;
    setTeams(prev => {
      const updated = { ...prev };
      updated[drafter].push(player);
      return updated;
    });
    setDrafted(prev => [...prev, player.id]);
    setCurrentPickIndex((prevIndex) => (prevIndex + 1) % draftOrder.length);
  };

  const handlePick = (player) => {
    const drafter = draftOrder[currentPickIndex];
    if (drafter === 'You') {
      makePick('You', player);
    }
  };

  const groupByPosition = (players) => {
    return players.reduce((acc, player) => {
      const position = player.position;
      if (!acc[position]) acc[position] = [];
      acc[position].push(player);
      return acc;
    }, {});
  };

  const simulateMatch = (teamA, teamB) => {
    const scoreA = teamA.reduce((sum, p) => sum + p.rating, 0) + Math.random() * 10;
    const scoreB = teamB.reduce((sum, p) => sum + p.rating, 0) + Math.random() * 10;
    return scoreA >= scoreB ? teamA : teamB;
  };

  const simulateTournament = () => {
    const teamEntries = Object.entries(teams);
    if (teamEntries.length !== 4) {
      setMatchSummary("Tournament requires 4 teams.");
      return;
    }

    const [team1, team2, team3, team4] = teamEntries;
    const semi1Winner = simulateMatch(team1[1], team2[1]);
    const semi1Name = semi1Winner === team1[1] ? team1[0] : team2[0];

    const semi2Winner = simulateMatch(team3[1], team4[1]);
    const semi2Name = semi2Winner === team3[1] ? team3[0] : team4[0];

    const finalWinner = simulateMatch(semi1Winner, semi2Winner);
    const winnerName = finalWinner === semi1Winner ? semi1Name : semi2Name;

    setMatchSummary(
      `Semi-final 1: ${team1[0]} vs ${team2[0]} → ${semi1Name}\n` +
      `Semi-final 2: ${team3[0]} vs ${team4[0]} → ${semi2Name}\n` +
      `Final: ${semi1Name} vs ${semi2Name} → 🏆 ${winnerName}`
    );
    setTournamentWinner(winnerName);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!started ? (
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">All-Time Draft</h1>
          <button
            onClick={startDraft}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Start Draft
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold border-b pb-2 mt-6 mb-4">Available Players</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-10">
            {playersLeft
              .filter((p) => !drafted.includes(p.id))
              .map((player) => (
                <PlayerCard key={player.id} player={player} onClick={handlePick} />
              ))}
          </div>

          <h2 className="text-xl font-semibold mb-4">Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {Object.entries(teams).map(([name, team]) => {
              const grouped = groupByPosition(team);
              return (
                <div key={name} className="bg-white rounded shadow p-4">
                  <h3 className="font-bold text-lg mb-2">{name === 'You' ? 'Your Team' : `${name}'s Team`}</h3>
                  {Object.entries(grouped).map(([position, players]) => (
                    players.length > 0 && (
                      <div key={position} className="mb-2">
                        <strong>{position}:</strong>
                        <ul className="list-disc list-inside ml-4">
                          {players.map(p => (
                            <li key={p.id}>{p.name} ({p.rating})</li>
                          ))}
                        </ul>
                      </div>
                    )
                  ))}
                </div>
              );
            })}
          </div>

          {drafted.length === players.length && (
            <div className="text-center">
              <button
                onClick={simulateTournament}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Simulate Tournament
              </button>
            </div>
          )}

          {matchSummary && (
            <div className="mt-8 bg-gray-100 p-4 rounded shadow whitespace-pre-wrap">
              <h3 className="text-lg font-bold mb-2">Tournament Results</h3>
              <p>{matchSummary}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DraftRoom;
