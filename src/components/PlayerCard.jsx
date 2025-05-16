import React from 'react';

const PlayerCard = ({ player }) => {
  return (
    <div className="border p-2 rounded shadow hover:bg-gray-100">
      <h4 className="font-bold">{player.name}</h4>
      <p>{player.position}</p>
      <p>Rating: {player.rating}</p>
    </div>
  );
};

export default PlayerCard;
