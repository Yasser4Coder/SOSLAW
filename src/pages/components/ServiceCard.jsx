import React from "react";

const ServiceCard = ({ icon: Icon, title, desc }) => (
  <article
    className="bg-white rounded-2xl shadow-md border border-[#e7cfa7] p-6 flex flex-col items-center text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg cursor-pointer h-72"
    tabIndex={0}
    aria-label={title}
  >
    <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#faf6f0] border-2 border-[#c8a45e]">
      {Icon && <Icon className="text-3xl text-[#c8a45e]" aria-hidden="true" />}
    </div>
    <h3 className="text-lg font-bold text-[#c8a45e] mb-2">{title}</h3>
    <p className="text-[#09142b] text-sm opacity-80">{desc}</p>
  </article>
);

export default ServiceCard;
