import React from 'react';

const PlayerCard = ({ player, onClick }) => {
  return (
    <div
      onClick={() => onClick(player)}
      className="w-40 h-64 bg-gradient-to-b from-yellow-300 to-yellow-100 border-4 border-yellow-500 rounded-xl shadow-md p-2 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
    >
      <div className="w-full flex justify-between items-center text-sm font-bold text-gray-800">
        <span>{player.position}</span>
        <span>{player.rating}</span>
      </div>

      <div className="mt-2 w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
        {player.name[0]}
      </div>

      <div className="mt-3 text-center font-semibold text-sm text-gray-900 leading-tight">
        {player.name}
      </div>

      <div className="mt-auto text-xs text-gray-500">Click to Draft</div>
    </div>
  );
};

export default PlayerCard;

