import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import logo from "../assets/logoBlueBg.svg";
import { useTranslation } from "react-i18next";
import { useContactInfo } from "../hooks/useContactInfo";

const Footer = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { getMainPhone, getMainEmail, getSocialMedia } = useContactInfo();
  const isAuthPage = pathname === "/auth";

  const linkClass =
    "text-[#e7cfa7] transition hover:text-white focus:outline-none focus:text-white";

  return (
    <footer
      className={`w-full bg-[#09142b] ${isAuthPage ? "" : "mt-16"}`}
      role="contentinfo"
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block focus:outline-none focus:ring-2 focus:ring-[#c8a45e] focus:ring-offset-2 focus:ring-offset-[#09142b] rounded-lg">
              <img
                src={logo}
                alt="SOS Law"
                className="h-11 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#e7cfa7]/90 leading-relaxed">
              {t("footerTagline", "منصة قانونية رقمية – استشارتك أينما كنت.")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("footerQuickLinks", "Quick links")}
            </h3>
            <ul className="mt-4 space-y-3" role="list">
              <li>
                <Link to="/" className={linkClass}>
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link to="/about" className={linkClass}>
                  {t("about")}
                </Link>
              </li>
              <li>
                <Link to="/#services" className={linkClass}>
                  {t("servicesTitle")}
                </Link>
              </li>
              <li>
                <Link to="/consultants" className={linkClass}>
                  {t("consultantsTitle")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className={linkClass}>
                  {t("contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("contact")}
            </h3>
            <ul className="mt-4 space-y-3" role="list">
              <li>
                <a
                  href={`tel:${getMainPhone().replace(/\s/g, "")}`}
                  className={`inline-flex items-center gap-2 ${linkClass}`}
                >
                  <FiPhone className="h-4 w-4 shrink-0 text-[#c8a45e]" aria-hidden />
                  {getMainPhone()}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${getMainEmail()}`}
                  className={`inline-flex items-center gap-2 ${linkClass} break-all`}
                >
                  <FiMail className="h-4 w-4 shrink-0 text-[#c8a45e]" aria-hidden />
                  {getMainEmail()}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("followUs", "Follow us")}
            </h3>
            <div className="mt-4 flex gap-4">
              {getSocialMedia().facebook && (
                <a
                  href={getSocialMedia().facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#c8a45e] transition hover:bg-[#c8a45e] hover:text-[#09142b] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]"
                >
                  <FaFacebook className="h-5 w-5" />
                </a>
              )}
              {getSocialMedia().instagram && (
                <a
                  href={getSocialMedia().instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#c8a45e] transition hover:bg-[#c8a45e] hover:text-[#09142b] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
              )}
              {getSocialMedia().linkedin && (
                <a
                  href={getSocialMedia().linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-[#c8a45e] transition hover:bg-[#c8a45e] hover:text-[#09142b] focus:outline-none focus:ring-2 focus:ring-[#c8a45e]"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-sm text-[#e7cfa7]/80">
              &copy; {new Date().getFullYear()} SOSLAW. {t("footerRights") || "All rights reserved."}
            </span>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className={linkClass}>
                {t("privacy") || "Privacy Policy"}
              </Link>
              <Link to="/terms" className={linkClass}>
                {t("terms") || "Terms of Service"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
