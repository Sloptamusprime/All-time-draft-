import React from 'react';

const PlayerCard = ({ player }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow hover:shadow-lg transition-all p-4 flex flex-col items-center text-center space-y-2">
      {/* Optional player image placeholder */}
      <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
        {player.name[0]}
      </div>

      <div className="font-semibold text-lg">{player.name}</div>

      <div className="text-sm text-gray-600">{player.position}</div>

      <div className="text-yellow-500 font-bold text-lg">
        ⭐ {player.rating}
      </div>
    </div>
  );
};

export default PlayerCard;
