import React from 'react';

const PlayerCard = ({ player }) => {
  return (
    <div className="w-[180px] h-auto bg-white border-2 border-gray-500 rounded-xl shadow-lg p-4 flex flex-col items-center text-center space-y-2">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
        {player.name[0]}
      </div>
      <div className="font-semibold text-base text-gray-900">{player.name}</div>
      <div className="text-sm text-gray-600">{player.position}</div>
      <div className="text-sm text-gray-700">Rating: {player.rating}</div>
    </div>
  );
};

export default PlayerCard;
