import React from 'react';
import Header from './components/Header';
import MainContent from './components/MainContent';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0 bg-[url('/amplibot-bg.png')] bg-cover bg-center bg-fixed">
        <div className="absolute inset-0 bg-primary opacity-35"></div>
      </div>
      <div className="relative container mx-auto p-8">
        <Header />
      </div>
      <div className="relative flex-grow container mx-auto flex items-center justify-start px-8">
        <MainContent />
      </div>
    </div>
  );
}
