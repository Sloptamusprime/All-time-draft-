import React from 'react';

const PlayerCard = ({ player, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-[160px] h-[240px] cursor-pointer bg-gradient-to-b from-yellow-300 to-yellow-500 rounded-xl shadow-md border-4 border-white flex flex-col items-center justify-between p-4 hover:scale-105 transition-transform"
    >
      {/* Player Initial or Icon */}
      <div className="w-20 h-20 bg-white border-2 border-black rounded-full flex items-center justify-center text-2xl font-bold">
        {player.name[0]}
      </div>

      {/* Player Info */}
      <div className="text-center">
        <div className="text-lg font-bold">{player.name}</div>
        <div className="text-sm text-gray-800">{player.position}</div>
        <div className="text-md font-semibold mt-1">⭐ {player.rating}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
