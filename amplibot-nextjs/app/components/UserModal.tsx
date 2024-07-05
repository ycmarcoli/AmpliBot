import React, { MouseEvent } from 'react';
import { PiX, PiXBold } from 'react-icons/pi';

export default function UserModal({
  isVisible,
  onClose,
  title,
  children,
}: {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isVisible) return null;

  const handleContentClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-offwhite p-8 rounded-lg shadow-lg w-1/3"
        onClick={handleContentClick}
      >
        <div className="flex flex-col gap-8">
          <div className="text-primary text-3xl flex justify-between">
            <div className="font-bold">{title}</div>
            <button onClick={onClose}>
              <PiXBold />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
