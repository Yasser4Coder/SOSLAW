import React from "react";

const ConsultantCard = ({ name, title, bio, img }) => (
  <article
    className="bg-white rounded-2xl shadow-md border border-[#e7cfa7] p-6 text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg cursor-pointer h-96 flex flex-col items-center"
    tabIndex={0}
    aria-label={`Consultant: ${name}`}
  >
    <img
      src={img}
      alt={`Portrait of ${name}`}
      className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-[#faf6f0] shadow"
      loading="lazy"
    />
    <h3 className="text-xl font-bold text-[#c8a45e] mb-1">{name}</h3>
    <p className="text-[#09142b] font-medium mb-2">{title}</p>
    <div className="text-[#6b7280] text-sm max-h-[4.5rem] overflow-y-auto px-1">
      {bio}
    </div>
  </article>
);

export default ConsultantCard;
