import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import logoBlueBg from "../assets/logoBlueBg.svg";
import { useTranslation } from "react-i18next";
import { useContactInfo } from "../hooks/useContactInfo";

const Footer = () => {
  const { t } = useTranslation();
  const { getMainPhone, getMainEmail, getSocialMedia } = useContactInfo();

  return (
    <footer className="w-full bg-[#09142b] text-[#c8a45e] pt-10 pb-4 px-4 md:px-12 mt-12 border-t border-[#e7cfa7]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-start gap-10 md:gap-0">
        {/* Brand/Logo & Tagline */}
        <div className="flex-1 flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link
            to="/"
            className="flex items-center gap-3 mb-2 focus:outline-none"
          >
            <img
              src={logoBlueBg}
              alt="SOSLAW Logo"
              className="h-12 w-auto"
              loading="lazy"
            />
          </Link>
          <span className="text-sm text-[#e7cfa7] font-light text-center md:text-left max-w-xs">
            {t("footerTagline") || "Professional legal services and solutions"}
          </span>
        </div>
        {/* Quick Links */}
        <nav
          className="flex-1 flex flex-col items-center md:items-center mb-6 md:mb-0"
          aria-label="Footer Navigation"
        >
          <ul className="flex flex-col md:flex-row gap-2 md:gap-6 text-base font-medium">
            <li>
              <Link
                to="/"
                className="hover:text-white transition-colors focus:outline-none focus:underline"
              >
                {t("home")}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-white transition-colors focus:outline-none focus:underline"
              >
                {t("about")}
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-white transition-colors focus:outline-none focus:underline"
              >
                {t("servicesTitle")}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="hover:text-white transition-colors focus:outline-none focus:underline"
              >
                {t("contact")}
              </Link>
            </li>
          </ul>
        </nav>
        {/* Contact & Social */}
        <div className="flex-1 flex flex-col items-center md:items-end gap-2">
          <div className="mb-2">
            <span className="block text-sm text-[#e7cfa7] font-semibold mb-1">
              {t("phone")}
            </span>
            <a
              href={`mailto:${getMainEmail()}`}
              className="block text-sm text-[#e7cfa7] hover:text-white transition-colors focus:underline"
            >
              {getMainEmail()}
            </a>
          </div>
          <div className="flex gap-4 mt-2">
            {getSocialMedia().facebook && (
              <a
                href={getSocialMedia().facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-[#c8a45e] hover:text-white text-2xl transition-colors focus:outline-none"
              >
                <FaFacebook />
              </a>
            )}
            {getSocialMedia().instagram && (
              <a
                href={getSocialMedia().instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-[#c8a45e] hover:text-white text-2xl transition-colors focus:outline-none"
              >
                <FaInstagram />
              </a>
            )}
            {getSocialMedia().linkedin && (
              <a
                href={getSocialMedia().linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-[#c8a45e] hover:text-white text-2xl transition-colors focus:outline-none"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Divider */}
      <div className="w-full h-px bg-[#e7cfa7] my-6 opacity-30" />
      {/* Legal & Copyright */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs text-[#e7cfa7] gap-2">
        <span>
          &copy; {new Date().getFullYear()} SOSLAW.{" "}
          {t("footerRights") || "All rights reserved."}
        </span>
        <div className="flex gap-4">
          <Link to="/privacy" className="hover:text-white focus:underline">
            {t("privacy") || "Privacy Policy"}
          </Link>
          <Link to="/terms" className="hover:text-white focus:underline">
            {t("terms") || "Terms of Service"}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
