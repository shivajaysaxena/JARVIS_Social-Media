// Card.js
import React from "react";

const Card = ({title,value,change}) => {
  return (
    <div className="bg-white text-stone-950 p-6 rounded-lg shadow-lg h-52 w-60 flex flex-col justify-between items-center">
      <h3 className="text-2xl font-semibold text-center">{title}</h3>
      <p className="text-4xl font-bold">{value}</p>
      <p className="text-5xl">{change}</p>
    </div>
  )
};

export default Card;
