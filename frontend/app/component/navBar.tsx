"use client";
import React, { useState } from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0c23]/80 border-b border-white/10 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-16">

        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo1.jpg"
            alt="Logo"
            className="h-12 w-12 object-contain rounded-full shadow-md border border-indigo-400/20"
          />
          <span className="font-semibold text-3xl text-indigo-400 tracking-wide" style={{ fontFamily: 'Inter, Segoe UI, Arial, sans-serif' }}>
            B-Vision
          </span>
        </Link>


        <div className="hidden md:flex gap-10 items-center">
          <Link
            href="/"
            className="relative text-white font-semibold text-base px-3 py-1 hover:text-indigo-300 transition-colors group"
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/services"
            className="relative text-white font-semibold text-base px-3 py-1 hover:text-indigo-300 transition-colors group"
          >
            Services
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-400 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/contact"
            className="relative text-white font-semibold text-base px-3 py-1 hover:text-indigo-300 transition-colors group"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-indigo-400 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="focus:outline-none"
            type="button"
          >
            {isOpen ? (
              <svg
                className="w-8 h-8 text-indigo-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-8 h-8 text-indigo-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden flex flex-col bg-[#0a0c23]/95 border-t border-white/10 px-6 py-4 gap-4 absolute w-full left-0 transition-all duration-300 ${
          isOpen ? "top-16 opacity-100 pointer-events-auto" : "-top-96 opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          onClick={handleNavClick}
          className="text-white font-semibold text-base hover:text-indigo-300 transition-colors"
        >
          Home
        </Link>
        <Link
          href="/services"
          onClick={handleNavClick}
          className="text-white font-semibold text-base hover:text-indigo-300 transition-colors"
        >
          Services
        </Link>
        <Link
          href="/contact"
          onClick={handleNavClick}
          className="text-white font-semibold text-base hover:text-indigo-300 transition-colors"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
