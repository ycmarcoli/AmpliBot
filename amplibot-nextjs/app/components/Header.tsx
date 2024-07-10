'use client';

import React, { useState } from 'react';
import AuthButtons from './AuthButtons';
import { PiList, PiX } from 'react-icons/pi';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="w-full">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
        <div className="flex items-center justify-center">
          <div className="relative w-16 h-16">
            <Image
              src="/amplibot-icon.png"
              alt="Amplibot Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <h1 className="font-bold text-5xl text-offwhite">
            AMPLIBOT
          </h1>
        </div>
        <div className="hidden lg:block">
          <AuthButtons />
        </div>
        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu} className="text-3xl text-offwhite">
            <PiList />
          </button>
        </div>
      </div>
      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={closeMenu}
        ></div>
      )}
      <div
        className={`z-20 fixed top-0 right-0 h-full bg-primary text-offwhite transition-transform transform ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        } w-72 p-4 lg:hidden flex flex-col`}
      >
        <div className="flex justify-end">
          <button onClick={toggleMenu} className="text-3xl p-8">
            <PiX />
          </button>
        </div>
        <div className="mt-4 flex flex-col space-y-4">
          <AuthButtons vertical />
        </div>
      </div>
    </div>
  );
}
