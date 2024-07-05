import React, { useRef, useEffect } from 'react';

export default function ChatHistory({ messages } : { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="max-w-3xl mx-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex my-2 ${
            message.isBot ? 'justify-start' : 'justify-end'
          }`}
        >
          <div
            className={`rounded-t-3xl ${
              message.isBot
                ? 'bg-primary-dark text-offwhite rounded-br-3xl'
                : 'bg-offwhite text-primary rounded-bl-3xl'
            } py-3 px-5 max-w-md break-words`}
          >
            {message.text}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
