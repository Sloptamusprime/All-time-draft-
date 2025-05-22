import React from 'react';

const PlayerCard = ({ player }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all p-4 flex flex-col items-center text-center space-y-2">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-600">
        {player.name[0]}
      </div>
      <div className="font-bold text-base text-gray-800">{player.name}</div>
      <div className="text-sm text-gray-500">{player.position}</div>
      <div className="text-sm text-gray-400">Rating: {player.rating}</div>
    </div>
  );
};

export default PlayerCard;
