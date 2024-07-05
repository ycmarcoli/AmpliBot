'use client'

import { useRouter } from 'next/navigation';
import React from 'react';
import { PiArrowRightBold } from 'react-icons/pi';

export default function MainContent() {
  const router = useRouter();

  const handleRoute = () => {
    router.push('/chat');
  };
  return (
    <div className="text-offwhite text-left">
      <h1 className="text-5xl font-bold mb-4">
        Superpower your real estate
        <br />
        business with AI chatbot solutions.
      </h1>
      <div className="flex justify-start">
        <button
          className="relative py-3 px-6 font-bold text-lg rounded-lg overflow-hidden bg-secondary text-primary shadow-2xl transition-all
                     before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-secondary-light before:transition-all before:duration-500 hover:text-primary
                   hover:shadow-primary hover:before:left-0 hover:before:w-full"
          onClick={handleRoute}
        >
          <span className="relative flex items-center gap-2 z-10">
            Schedule demo
            <PiArrowRightBold />
          </span>
        </button>
      </div>
    </div>
  );
}
