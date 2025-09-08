import React from "react";
import { FiStar, FiUsers, FiClock } from "react-icons/fi";
import Avatar from "../../components/common/Avatar";

const ConsultantCard = ({
  name,
  title,
  bio,
  img,
  rating,
  consultations,
  experience,
}) => {
  return (
    <article
      className="bg-white rounded-2xl shadow-md border border-[#e7cfa7] p-6 text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg focus-within:scale-105 focus-within:shadow-lg cursor-pointer h-96 flex flex-col items-center"
      tabIndex={0}
      aria-label={`Consultant: ${name}`}
    >
      {/* Avatar */}
      <Avatar
        src={img}
        alt={`Portrait of ${name}`}
        name={name}
        size="3xl"
        className="mb-4"
        showBorder={false}
        fallbackBg="gradient"
      />

      <h3 className="text-xl font-bold text-[#c8a45e] mb-1">{name}</h3>
      <p className="text-[#09142b] font-medium mb-2">{title}</p>
      <div className="text-[#6b7280] text-sm max-h-[3rem] overflow-y-auto px-1 mb-3">
        {bio}
      </div>

      {/* Additional information */}
      <div className="flex flex-col space-y-2 w-full">
        {/* Rating */}
        {rating && rating > 0 && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <FiStar className="text-yellow-400 ml-1" size={14} />
            <span className="font-medium">{rating}</span>
          </div>
        )}

        {/* Experience */}
        {experience && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <FiClock className="text-blue-400 ml-1" size={14} />
            <span>{experience}</span>
          </div>
        )}

        {/* Consultations */}
        {consultations && consultations > 0 && (
          <div className="flex items-center justify-center text-sm text-gray-600">
            <FiUsers className="text-green-400 ml-1" size={14} />
            <span>{consultations} استشارة</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default ConsultantCard;
