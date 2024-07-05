'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

export default function AuthButtons({ vertical = false }) {
  const router = useRouter();

  const handleRoute = () => {
    router.push('/chat');
  };
  return (
    <div
      className={`flex ${
        vertical ? 'flex-col gap-4' : 'gap-10'
      } text-lg font-bold`}
    >
      <button
        onClick={handleRoute}
        className="text-offwhite py-1 px-8 rounded-lg hover:bg-white/15 transition-all before:duration-500"
      >
        Login
      </button>
      <button
        onClick={handleRoute}
        className="relative py-1 px-8 font-bold text-lg rounded-lg overflow-hidden bg-secondary text-primary shadow-2xl transition-all
                     before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-secondary-light before:transition-all before:duration-500 hover:text-primary
                   hover:shadow-primary hover:before:left-0 hover:before:w-full"
      >
        <span className="relative flex items-center justify-center gap-2 z-10">
          Register
        </span>
      </button>
    </div>
  );
}
