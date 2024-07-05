'use client';

import React, { useEffect, useRef } from 'react';
import { PiArrowCircleUpFill, PiSpinnerBall } from 'react-icons/pi';

interface ChatInputBoxProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  addMessage: (message: string) => void;
  isWaitingForResponse: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export default function ChatInputBox({
  inputValue,
  setInputValue,
  addMessage,
  isWaitingForResponse,
  inputRef,
}: ChatInputBoxProps) {

  const handleSend = () => {
    if (inputValue.trim()) {
      addMessage(inputValue);
      setInputValue('');
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, 0);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevents the default newline insertion
      handleSend();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'; // Reset height
      const newHeight = Math.min(inputRef.current.scrollHeight, 9 * 16); // Calculate the height and cap it at 9rem (9 * 16px)
      inputRef.current.style.height = `${newHeight}px`; // Set to the scroll height
    }
  }, [inputValue, inputRef]);

  return (
    <div className="w-full flex justify-center items-center mt-8">
      <div className="flex gap-1 items-start justify-center w-full max-w-3xl bg-primary-dark rounded-3xl p-4 overflow-hidden">
        <textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow ml-2 outline-none bg-primary-dark text-white resize-none"
          placeholder="Text Amplibot..."
          rows={3}
          style={{ lineHeight: '1.5rem', maxHeight: '9rem', overflow: 'auto' }} // Adjust line height as necessary
        />
        <div className="relative w-8 h-8">
          {isWaitingForResponse && (
            <div className="absolute inset-0 flex items-center justify-center text-4xl text-offwhite animate-spin">
              <PiSpinnerBall />
            </div>
          )}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${
              inputValue.trim() && !isWaitingForResponse
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-0'
            }`}
          >
            <button
              onClick={handleSend}
              className="text-4xl text-offwhite"
              disabled={!inputValue.trim() || isWaitingForResponse}
            >
              <PiArrowCircleUpFill />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
