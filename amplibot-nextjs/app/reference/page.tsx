'use client';

import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { withAuthenticator } from '@aws-amplify/ui-react';
import type { WithAuthenticatorProps } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '@/amplifyconfiguration.json';
import { useState, useEffect, useRef } from 'react';

Amplify.configure(config);

interface ChatEntry {
  prompt: string;
  response: string;
}

function Home({ signOut, user }: WithAuthenticatorProps) {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getToken = async () => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken;
    if (!accessToken) {
      throw new Error('No id token found');
    }
    return accessToken;
  };

  const send_prompt = async () => {
    try {
      setLoading(true);
      const accessToken = await getToken();
      
      const currentPrompt = userInput;
      setChatHistory(prevHistory => [...prevHistory, { prompt: currentPrompt, response: '' }]);
      setUserInput(''); // Clear the input field immediately

      const response = await fetch('http://127.0.0.1:8000/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: currentPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();

      console.log(data)

      setChatHistory(prevHistory => {
        const newHistory = [...prevHistory];
        newHistory[newHistory.length - 1].response = data.response;
        return newHistory;
      });

      setLoading(false);
    } catch (err) {
      console.log('Error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  return (
    <div className="flex flex-col items-center justify-between h-screen p-6">
      <div className="flex flex-col w-full max-w-md h-full">
        <div className="flex-1 overflow-y-auto p-4 ">
          <code className="font-mono font-bold">
            {user?.signInDetails?.loginId}
          </code>
          <button className="ml-4 font-mono font-bold" onClick={signOut}>
            Sign out
          </button>
          <div className="mt-4">
            {chatHistory.map((entry, index) => (
              <div key={index} className="mb-4 p-4 bg-blue-100 text-blue-900 rounded-lg shadow-sm">
                <div><strong>Prompt:</strong> {entry.prompt}</div>
                {entry.response && <div><strong>Response:</strong> {entry.response}</div>}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
        </div>
        <div className="flex p-4 rounded-lg bg-white w-full">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your message"
            className="flex-1 p-2 border border-gray-300 text-black rounded-l"
            disabled={loading}
          />
          <button
            onClick={send_prompt}
            className={`p-2 bg-blue-500 text-white rounded-r ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(Home);
