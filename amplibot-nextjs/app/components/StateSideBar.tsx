'use client';

import React, { useState } from 'react';
import { PiBug, PiTrash, PiUploadSimple } from 'react-icons/pi';
import handleExport from '@/app/helper/exporthelper';

interface StateSideBarProps {
  currentState: State | undefined;
  messages: { text: string; isBot: boolean }[] | undefined;
  onDeleteCurrentChat: () => void;
}

export default function StateSideBar({
  currentState,
  messages,
  onDeleteCurrentChat,
}: StateSideBarProps) {
  const [isMinimized, setIsMinimized] = useState(true);

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const handleDelete = () => {
    if (!messages || messages.length === 0) {
      alert('The chat is empty!');
      return;
    }
    if (confirm("Are you sure you want to delete the current chat?")) {
      onDeleteCurrentChat();
    }
  };

  return (
    <div className="p-4">
      <div
        className={`${
          isMinimized ? 'h-24 w-24' : 'h-full w-96'
        } bg-primary-dark rounded-3xl flex flex-col transition-all duration-300`}
      >
        <div className="flex justify-end p-8 text-3xl text-offwhite">
          <PiBug onClick={handleToggle} className="cursor-pointer" />
        </div>
        {!isMinimized && (
          <div className="flex flex-col gap-2 px-8">
            <div className="font-bold text-xl text-offwhite mx-auto whitespace-nowrap">
              Debug Customer States
            </div>
            {currentState && (
              <div className="bg-gray-800 text-green-400 font-mono text-sm rounded-xl p-4 overflow-hidden">
                <pre>
                  {Object.entries(currentState).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <span className="text-pink-400">{key}:</span>{' '}
                      {typeof value === 'object'
                        ? JSON.stringify(value, null, 2)
                        : String(value) || 'N/A'}
                    </div>
                  ))}
                </pre>
              </div>
            )}
          </div>
        )}
        {isMinimized && (
          <>
            <div className="flex justify-end p-8 text-3xl text-offwhite">
              <PiTrash onClick={handleDelete} className="cursor-pointer" />
            </div>
            <div className="flex justify-end p-8 text-3xl text-offwhite">
              <PiUploadSimple
                onClick={() => messages && handleExport(messages)}
                className="cursor-pointer"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
