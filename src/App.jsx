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

  return
