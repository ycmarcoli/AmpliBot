'use client';

import React, { useState } from 'react';
import {
  PiArrowLineLeft,
  PiArrowLineRight,
  PiUserCircle,
  PiPlus,
} from 'react-icons/pi';
import { BiCommentAdd } from 'react-icons/bi';
import UserModal from './UserModal';
import UserModalSettings from './UserModalSettings';
import Image from 'next/image';

interface ChatSideBarProps {
  messages: Message[];
  sessions: string[];
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
  onNewSession: () => Promise<string>;
}

export default function ChatSideBar({
  messages,
  sessions,
  currentSessionId,
  onSessionChange,
  onNewSession,
}: ChatSideBarProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleToggle = () => {
    setIsMinimized(!isMinimized);
  };

  const handleProfileClick = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-4">
      <div
        className={`h-full ${
          isMinimized ? 'w-24' : 'w-80'
        } bg-primary-dark rounded-3xl flex flex-col transition-all duration-300`}
      >
        <div className="flex flex-col justify-between p-8 h-full">
          <div className="flex justify-between text-3xl text-offwhite mb-10">
            <div className="flex items-center justify-center w-8 h-8">
              {isMinimized ? (
                <PiArrowLineRight
                  onClick={handleToggle}
                  className="cursor-pointer"
                />
              ) : (
                <PiArrowLineLeft
                  onClick={handleToggle}
                  className="cursor-pointer"
                />
              )}
            </div>
            {!isMinimized && (
              <BiCommentAdd onClick={onNewSession} className="cursor-pointer" />
            )}
          </div>
          {!isMinimized && (
            <>
              <div className="flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <Image
                    src="/amplibot-icon.png"
                    alt="Amplibot Logo"
                    layout="fill"
                    objectFit="contain"
                    priority
                  />
                </div>
                <h1 className="font-bold text-2xl md:text-3xl text-offwhite">
                  AMPLIBOT
                </h1>
              </div>
              <div className="flex-grow overflow-hidden">
                <div className="h-full overflow-y-auto pr-1">
                  {sessions.map((sessionId) => (
                    <div
                      key={sessionId}
                      className={`p-2 rounded-xl cursor-pointer overflow-hidden overflow-ellipsis whitespace-nowrap mb-2 ${
                        sessionId === currentSessionId
                          ? 'bg-offwhite text-primary'
                          : 'bg-gray-700 text-offwhite'
                      }`}
                      onClick={() => onSessionChange(sessionId)}
                    >
                      {sessionId}...
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="text-3xl text-offwhite mt-10">
            <button onClick={handleProfileClick}>
              <PiUserCircle />
            </button>
          </div>
        </div>
      </div>
      <UserModal
        title={'User Settings'}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      >
        <UserModalSettings messages={messages} />
      </UserModal>
    </div>
  );
}
