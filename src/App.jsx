import { useState } from 'react';

const samplePlayers = [
  { name: 'Lionel Messi', position: 'FW', rating: 98 },
  { name: 'Cristiano Ronaldo', position: 'FW', rating: 97 },
  { name: 'Zinedine Zidane', position: 'MF', rating: 95 },
  { name: 'Ronaldinho', position: 'MF', rating: 94 },
  { name: 'Paolo Maldini', position: 'DF', rating: 93 },
  { name: 'Cafu', position: 'DF', rating: 92 },
  { name: 'Gianluigi Buffon', position: 'GK', rating: 91 },
  { name: 'Xavi Hernandez', position: 'MF', rating: 94 },
  { name: 'Andres Iniesta', position: 'MF', rating: 94 },
  { name: 'Diego Maradona', position: 'FW', rating: 96 }
];

export default function App() {
  const [userTeam, setUserTeam] = useState([]);
  const [cpuTeam, setCpuTeam] = useState([]);
  const [drafted, setDrafted] = useState([]);
  const [phase, setPhase] = useState('draft');
  const [log, setLog] = useState('');

  function draftPlayer(player) {
    if (drafted.includes(player.name)) return;
    const updatedDrafted = [...drafted, player.name];
    setUserTeam([...userTeam, player]);
    const remainingPlayers = samplePlayers.filter(p => !updatedDrafted.includes(p.name));
    const cpuPick = remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];
    setCpuTeam([...cpuTeam, cpuPick]);
    setDrafted([...updatedDrafted, cpuPick.name]);

    if (userTeam.length === 6) {
      setPhase('sim');
      simulateMatch([...userTeam, player], [...cpuTeam, cpuPick]);
    }
  }

  function simulateMatch(user, cpu) {
    let userScore = 0;
    let cpuScore = 0;
    let events = '';
    for (let i = 0; i < 5; i++) {
      const u = user[Math.floor(Math.random() * user.length)];
      const c = cpu[Math.floor(Math.random() * cpu.length)];
      if (Math.random() * 100 < u.rating * 0.5) {
        userScore++;
        events += `⚽ ${u.name} scored for you!\n`;
      }
      if (Math.random() * 100 < c.rating * 0.5) {
        cpuScore++;
        events += `⚽ ${c.name} scored for CPU!\n`;
      }
    }
    events += `\nFinal Score — You: ${userScore} | CPU: ${cpuScore}`;
    setLog(events);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">GOAT Draft (Solo)</h1>
      {phase === 'draft' && (
        <div>
          <h2 className="mb-2">Pick Your Player ({userTeam.length}/7)</h2>
          <ul className="space-y-2 max-h-96 overflow-y-scroll pr-2">
            {samplePlayers.map((p) => (
              <li key={p.name} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{p.name} ({p.position})</span>
                <button
                  onClick={() => draftPlayer(p)}
                  disabled={drafted.includes(p.name)}
                  className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50"
                >
                  Draft
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase === 'sim' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Match Recap</h2>
          <pre className="bg-black text-green-400 p-4 rounded whitespace-pre-wrap">{log}</pre>
        </div>
      )}
    </div>
  );
}

