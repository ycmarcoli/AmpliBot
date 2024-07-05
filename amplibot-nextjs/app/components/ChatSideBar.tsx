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
        } bg-primary-dark rounded-3xl flex flex-col justify-between transition-all duration-300`}
      >
        <div className="flex flex-col gap-10 p-8">
          <div className="flex justify-between text-3xl text-offwhite">
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
            {!isMinimized && <BiCommentAdd onClick={onNewSession} className="cursor-pointer" />}
          </div>
          {!isMinimized && (
            <>
              <div className="font-bold text-3xl text-offwhite mx-auto slide-in-left">
                AMPLIBOT
              </div>
              <div className="flex flex-col gap-2 overflow-y-auto max-h-96">
                {sessions.map((sessionId) => (
                  <div
                    key={sessionId}
                    className={`p-2 rounded-xl cursor-pointer ${
                      sessionId === currentSessionId
                        ? 'bg-offwhite text-primary'
                        : 'bg-gray-700 text-offwhite'
                    }`}
                    onClick={() => onSessionChange(sessionId)}
                  >
                    Session {sessionId.slice(0, 8)}...
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="text-3xl text-offwhite p-8">
          <button onClick={handleProfileClick}>
            <PiUserCircle />
          </button>
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
