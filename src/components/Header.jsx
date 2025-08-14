import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiPhone,
  FiClock,
  FiGlobe,
  FiChevronDown,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo.svg";
import { useTranslation } from "react-i18next";
import { useSmoothScroll } from "../hooks/useSmoothScroll";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

const SOCIALS = [
  { label: "IN.", href: "#", color: "#0a1a2f" },
  { label: "IG.", href: "#", color: "#0a1a2f" },
  { label: "FB.", href: "#", color: "#0a1a2f" },
];

const NAV_LINKS = [
  { to: "/", label: "home" },
  { to: "/about", label: "about" },
  { to: "/#services", label: "servicesTitle" },
  { to: "/contact", label: "contact" },
  { to: "/join", label: "joinUs" },

  {
    dropdown: "more",
    label: "more",
    items: [
      { to: "/library", label: "legalLibrary" },
      { to: "/#testimonials", label: "testimonialsTitle" },
      { to: "/#consultants", label: "consultantsTitle" },
      { to: "/#consultation-branches", label: "consulting" },
      { to: "/#faq", label: "faqSectionTitle" },
    ],
  },
];

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { scrollToSection } = useSmoothScroll();
  const [lang, setLang] = useState(i18n.language || "en");
  const [showLang, setShowLang] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState({
    more: false,
  });
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs for dropdowns
  const langRef = useRef();
  const moreMenuRef = useRef();
  const moreTriggerRef = useRef();

  // Handle navigation with smooth scrolling for anchor links
  const handleNavigation = (to, closeMenu = false) => {
    if (to.startsWith("/#")) {
      // Handle anchor links with smooth scrolling
      const sectionId = to.substring(2); // Remove '/#' prefix
      scrollToSection(sectionId);
      if (closeMenu) {
        setMobileMenu(false);
        setOpenDropdown(null);
      }
    } else if (to === "/") {
      // Handle home page navigation
      if (closeMenu) {
        setMobileMenu(false);
        setOpenDropdown(null);
      }
      // If we're already on home page, scroll to top
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      // Handle regular page navigation
      if (closeMenu) {
        setMobileMenu(false);
        setOpenDropdown(null);
      }
    }
  };

  // Handle language change and RTL
  const handleLangChange = (code) => {
    setLang(code);
    i18n.changeLanguage(code);
    setShowLang(false);

    // Set dir attribute for RTL/LTR
    const isRTL = code === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = code;
    document.body.dir = isRTL ? "rtl" : "ltr";
    document.body.lang = code;
  };

  // Close Language dropdown on outside click
  useEffect(() => {
    if (!showLang) return;
    function handleClick(e) {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLang(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showLang]);

  // Keyboard accessibility for language dropdown
  useEffect(() => {
    if (!showLang) return;
    function handleKey(e) {
      if (e.key === "Escape") setShowLang(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [showLang]);

  // Close More dropdown on outside click
  useEffect(() => {
    if (!showMore) return;
    function handleClick(e) {
      if (
        moreMenuRef.current &&
        moreTriggerRef.current &&
        !moreMenuRef.current.contains(e.target) &&
        !moreTriggerRef.current.contains(e.target)
      ) {
        setShowMore(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMore]);

  // Sticky header
  useEffect(() => {
    const header = document.getElementById("main-header");
    if (header) {
      header.classList.add("sticky", "top-0", "z-50", "bg-white", "shadow-sm");
    }
  }, []);

  // Sync language state with i18n
  useEffect(() => {
    setLang(i18n.language || "ar");
  }, [i18n.language]);

  // Focus indicator for accessibility
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      a:focus, button:focus { outline: 2px solid #b48b5a; outline-offset: 2px; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <header id="main-header" className="w-full">
      {/* Top Bar: Contact Info, Language Switcher, Work Time (Desktop Only) */}
      <div className="hidden md:flex items-center justify-between px-8 h-10 bg-[#faf6f0] text-[#c8a45e] text-sm border-b border-[#e7cfa7]">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <FiPhone />
            <span className="text-[#09142b] font-medium">{t("phone")}</span>
          </span>
        </div>

        {/* Right: Work Time */}
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1">
            <FiClock />
            <span className="text-[#09142b]">{t("hours")}</span>
          </span>
        </div>
        {/* Center: Language Switcher */}
        <div className="relative" ref={langRef}>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded border border-[#c8a45e] text-[#c8a45e] bg-white hover:bg-[#e7cfa7]/20 focus:outline-none cursor-pointer"
            aria-haspopup="listbox"
            aria-expanded={showLang}
            aria-label="Select language"
            onClick={() => setShowLang((v) => !v)}
            tabIndex={0}
          >
            <FiGlobe className="inline" />
            <span className="font-bold">
              {LANGUAGES.find((l) => l.code === lang)?.label}
            </span>
            <FiChevronDown
              className={`ml-1 transition-transform duration-300 ${
                showLang ? "rotate-180 text-[#c8a45e]" : ""
              }`}
            />
          </button>
          {showLang && (
            <ul
              className="absolute left-1/2 -translate-x-1/2 mt-2 bg-white border rounded shadow z-10 min-w-[80px]"
              role="listbox"
              tabIndex={-1}
            >
              {LANGUAGES.filter((l) => l.code !== lang).map((l) => (
                <li
                  key={l.code}
                  className="px-4 py-2 hover:bg-[#e7cfa7]/20 text-[#09142b] cursor-pointer"
                  role="option"
                  aria-selected={false}
                  tabIndex={0}
                  onClick={() => handleLangChange(l.code)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleLangChange(l.code);
                  }}
                >
                  {l.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Main Navigation Bar */}
      <nav className="flex items-center justify-between px-4 md:px-8 h-20">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 focus:outline-none"
          aria-label="SOSLAW Home"
        >
          <img
            src={logo}
            alt="SOSLAW Logo"
            className="h-10 w-auto"
            loading="lazy"
          />
        </Link>
        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8" role="menubar">
          {NAV_LINKS.map((link) => (
            <li key={link.label} role="none" className="relative group">
              {link.dropdown === "more" ? (
                <>
                  <button
                    className={`font-semibold px-2 py-1 rounded flex items-center gap-1 transition-colors duration-200 focus:outline-none relative cursor-pointer ${
                      location.pathname.startsWith(`/${link.dropdown}`)
                        ? "text-[#c8a45e] underline underline-offset-4"
                        : "text-[#09142b] hover:text-[#c8a45e]"
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={openDropdown === link.dropdown}
                    tabIndex={0}
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === link.dropdown ? null : link.dropdown
                      )
                    }
                    onMouseEnter={() => setOpenDropdown(link.dropdown)}
                    onFocus={() => setOpenDropdown(link.dropdown)}
                    ref={moreTriggerRef}
                  >
                    <span className="relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-[#c8a45e] after:scale-x-0 group-hover:after:scale-x-100 group-focus:after:scale-x-100 after:origin-left after:transition-transform after:duration-300">
                      {t(link.label)}
                    </span>
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${
                        openDropdown === link.dropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <ul
                    className={`absolute left-0 top-full mt-2 min-w-[180px] bg-white border rounded shadow-lg z-20 transition-opacity duration-200 ${
                      openDropdown === link.dropdown
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                    role="menu"
                    tabIndex={-1}
                    onMouseEnter={() => setOpenDropdown(link.dropdown)}
                    onMouseLeave={() => setOpenDropdown(null)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget))
                        setOpenDropdown(null);
                    }}
                    ref={moreMenuRef}
                  >
                    {link.items.map((item) => (
                      <li key={item.label || item.to} role="none">
                        {item.to ? (
                          <Link
                            to={item.to}
                            className="block px-4 py-2 text-[#09142b] hover:bg-[#e7cfa7]/20 rounded focus:outline-none transition-all duration-200 transform hover:scale-105 focus:scale-105 hover:text-[#c8a45e] focus:text-[#c8a45e] cursor-pointer"
                            role="menuitem"
                            tabIndex={0}
                            onClick={() => handleNavigation(item.to, true)}
                          >
                            {t(item.label)}
                          </Link>
                        ) : (
                          <div className="group/sub relative px-4 py-2 text-[#09142b] font-bold hover:bg-[#faf6f0] cursor-pointer">
                            <div className="flex items-center justify-between">
                              <span>{t(item.label)}</span>
                              {item.children && (
                                <FiChevronDown className="ml-2 rotate-[-90deg] text-[#c8a45e] group-hover/sub:rotate-0 transition-transform duration-200" />
                              )}
                            </div>
                            {item.children && (
                              <ul className="absolute left-full top-0 min-w-[220px] bg-white border rounded shadow-lg z-30 opacity-0 group-hover/sub:opacity-100 group-focus-within/sub:opacity-100 pointer-events-none group-hover/sub:pointer-events-auto group-focus-within/sub:pointer-events-auto transition-opacity duration-200">
                                {item.children.map((sub) => (
                                  <li
                                    key={sub.label}
                                    className="group/sub2 relative px-4 py-2 text-[#09142b] font-bold hover:bg-[#faf6f0] cursor-pointer"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{t(sub.label)}</span>
                                      {sub.children && (
                                        <FiChevronDown className="ml-2 rotate-[-90deg] text-[#c8a45e] group-hover/sub2:rotate-0 transition-transform duration-200" />
                                      )}
                                    </div>
                                    {sub.children && (
                                      <ul className="absolute left-full top-0 min-w-[200px] bg-white border rounded shadow-lg z-40 opacity-0 group-hover/sub2:opacity-100 group-focus-within/sub2:opacity-100 pointer-events-none group-hover/sub2:pointer-events-auto group-focus-within/sub2:pointer-events-auto transition-opacity duration-200">
                                        {sub.children.map((subItem) => (
                                          <li
                                            key={subItem.label}
                                            className="px-4 py-2 text-[#09142b] font-normal whitespace-nowrap hover:bg-[#e7cfa7]/20"
                                            style={{ fontSize: "0.97em" }}
                                          >
                                            {t(subItem.label)}
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  to={link.to}
                  className={`font-semibold px-2 py-1 rounded transition-colors duration-200 focus:outline-none relative cursor-pointer ${
                    location.pathname === link.to
                      ? "text-[#c8a45e] underline underline-offset-4"
                      : "text-[#09142b] hover:text-[#c8a45e]"
                  } group`}
                  role="menuitem"
                  tabIndex={0}
                  aria-current={
                    location.pathname === link.to ? "page" : undefined
                  }
                >
                  <span className="relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-[#c8a45e] after:scale-x-0 group-hover:after:scale-x-100 group-focus:after:scale-x-100 after:origin-left after:transition-transform after:duration-300">
                    {t(link.label)}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        {/* Free Consultation Button (Desktop Only) */}
        <Link
          to="/auth"
          className={`hidden md:inline-block ${
            lang === "ar" ? "mr-6" : "ml-6"
          } px-6 py-2 bg-[#c8a45e] text-white font-semibold rounded shadow hover:bg-[#c8a45e]/80 transition focus:outline-none focus:ring-2 focus:ring-[#c8a45e]`}
          aria-label={t("freeConsultation")}
        >
          {t("freeConsultation")}
        </Link>
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#c8a45e] text-2xl ml-4 focus:outline-none"
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenu}
          onClick={() => setMobileMenu((v) => !v)}
        >
          {mobileMenu ? <FiX /> : <FiMenu />}
        </button>
      </nav>
      {/* Mobile Menu */}
      {mobileMenu && (
        <div
          className="md:hidden bg-white border-t border-[#e7cfa7] px-4 py-4 space-y-2 z-30"
          role="menu"
        >
          {NAV_LINKS.map((link) => (
            <div key={link.label}>
              {link.dropdown === "more" ? (
                <>
                  <button
                    className="w-full text-left py-2 font-bold text-[#09142b] hover:text-[#c8a45e] flex items-center gap-2 focus:outline-none relative cursor-pointer"
                    onClick={() =>
                      setMobileDropdown((prev) => ({
                        ...prev,
                        [link.dropdown]: !prev[link.dropdown],
                      }))
                    }
                    aria-haspopup="menu"
                    aria-expanded={!!mobileDropdown[link.dropdown]}
                    ref={moreTriggerRef}
                  >
                    <span className="relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-[#c8a45e] after:scale-x-0 [&.active]:after:scale-x-100 after:origin-left after:transition-transform after:duration-300">
                      {t(link.label)}
                    </span>
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${
                        mobileDropdown[link.dropdown] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {mobileDropdown[link.dropdown] && (
                    <ul
                      className="pl-4 border-l border-[#e7cfa7] mt-1 mb-2"
                      role="menu"
                      ref={moreMenuRef}
                    >
                      {link.items.map((item) => (
                        <li key={item.label || item.to} role="none">
                          {item.to ? (
                            <Link
                              to={item.to}
                              className="block py-2 text-[#09142b] hover:text-[#c8a45e] focus:outline-none transition-all duration-200 transform hover:scale-105 focus:scale-105 cursor-pointer"
                              role="menuitem"
                              tabIndex={0}
                              onClick={() => handleNavigation(item.to, true)}
                            >
                              {t(item.label)}
                            </Link>
                          ) : (
                            <div className="py-2 text-[#09142b] font-bold">
                              <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() =>
                                  setMobileDropdown((prev) => ({
                                    ...prev,
                                    [item.label]: !prev[item.label],
                                  }))
                                }
                              >
                                <span>{t(item.label)}</span>
                                {item.children && (
                                  <FiChevronDown
                                    className={`ml-2 transition-transform duration-200 ${
                                      mobileDropdown[item.label]
                                        ? "rotate-180 text-[#c8a45e]"
                                        : "text-[#c8a45e]"
                                    }`}
                                  />
                                )}
                              </div>
                              {item.children && mobileDropdown[item.label] && (
                                <ul className="pl-4 mt-1">
                                  {item.children.map((sub) => (
                                    <li
                                      key={sub.label}
                                      className="py-2 text-[#09142b] font-bold"
                                    >
                                      <div
                                        className="flex items-center justify-between cursor-pointer"
                                        onClick={() =>
                                          setMobileDropdown((prev) => ({
                                            ...prev,
                                            [sub.label]: !prev[sub.label],
                                          }))
                                        }
                                      >
                                        <span>{t(sub.label)}</span>
                                        {sub.children && (
                                          <FiChevronDown
                                            className={`ml-2 transition-transform duration-200 ${
                                              mobileDropdown[sub.label]
                                                ? "rotate-180 text-[#c8a45e]"
                                                : "text-[#c8a45e]"
                                            }`}
                                          />
                                        )}
                                      </div>
                                      {sub.children &&
                                        mobileDropdown[sub.label] && (
                                          <ul className="pl-4 mt-1">
                                            {sub.children.map((subItem) => (
                                              <li
                                                key={subItem.label}
                                                className="py-1 text-[#09142b] font-normal whitespace-nowrap"
                                                style={{ fontSize: "0.97em" }}
                                              >
                                                {t(subItem.label)}
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={link.to}
                  className={`block py-2 font-bold rounded transition-colors duration-200 focus:outline-none relative cursor-pointer ${
                    location.pathname === link.to
                      ? "text-[#c8a45e] underline underline-offset-4"
                      : "text-[#09142b] hover:text-[#c8a45e]"
                  } group`}
                  role="menuitem"
                  tabIndex={0}
                  aria-current={
                    location.pathname === link.to ? "page" : undefined
                  }
                  onClick={() => handleNavigation(link.to, true)}
                >
                  <span className="relative after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-[#c8a45e] after:scale-x-0 group-hover:after:scale-x-100 group-focus:after:scale-x-100 after:origin-left after:transition-transform after:duration-300">
                    {t(link.label)}
                  </span>
                </Link>
              )}
            </div>
          ))}
          {/* Language Switcher in Mobile */}
          <div className="mt-2">
            <div className="text-xs text-[#c8a45e] mb-1 font-semibold">
              {t("language")}
            </div>
            <div className="flex gap-2">
              {LANGUAGES.filter((l) => l.code !== lang).map((l) => (
                <button
                  key={l.code}
                  className="px-3 py-1 rounded border border-[#e7cfa7] text-[#09142b] bg-white hover:bg-[#e7cfa7]/20 transition-colors duration-200 text-sm focus:outline-none cursor-pointer"
                  onClick={() => {
                    handleLangChange(l.code);
                    setMobileMenu(false);
                  }}
                  tabIndex={0}
                  aria-label={`Switch to ${l.label}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          {/* Free Consultation Button (Mobile Only) */}
          <Link
            to="/auth"
            className="block w-full mt-4 px-6 py-3 bg-[#c8a45e] text-white font-semibold rounded shadow hover:bg-[#c8a45e]/80 transition text-center focus:outline-none focus:ring-2 focus:ring-[#c8a45e]"
            aria-label={t("freeConsultation")}
            onClick={() => setMobileMenu(false)}
          >
            {t("freeConsultation")}
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
