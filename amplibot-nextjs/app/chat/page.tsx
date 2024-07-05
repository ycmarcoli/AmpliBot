'use client';

import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from '@/amplifyconfiguration.json';
import { fetchAuthSession } from 'aws-amplify/auth';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatSideBar from '../components/ChatSideBar';
import ChatInputBox from '../components/ChatInputBox';
import ChatHistory from '../components/ChatHistory';
import StateSideBar from '../components/StateSideBar';
import reorderState from '../helper/statehelper';

Amplify.configure(config);

function ChatPage() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [currentState, setCurrentState] = useState<State>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getToken = async () => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken;
    if (!accessToken) {
      throw new Error('No id token found');
    }
    return accessToken;
  };

  const fetchChatHistory = useCallback(async () => {
    try {
      const accessToken = await getToken();
      const response = await fetch('http://127.0.0.1:8000/user_data', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      const chatHistory = data.chat_history;
      const state = data.state;

      const reorderedState = reorderState(state);

      setMessages(
        chatHistory.map((message: any) => ({
          text: message.content,
          isBot: message.role === 'assistant',
        }))
      );
      setCurrentState(reorderedState);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  }, []);

  const sendPrompt = async (prompt: string) => {
    try {
      setIsWaitingForResponse(true);
      const accessToken = await getToken();

      const response = await fetch('http://127.0.0.1:8000/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      const chatHistory = data.chat_history;
      const state = data.state;

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `${chatHistory[chatHistory.length - 1].content}`, isBot: true },
      ]);
      setCurrentState(state);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isBot: false },
    ]);
    sendPrompt(message);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    fetchChatHistory();
  }, [fetchChatHistory]);

  return (
    <div className="min-h-screen max-h-screen flex bg-primary overflow-hidden">
      <ChatSideBar messages={messages} />
      <div className="flex flex-col flex-grow py-8">
        <div className="pl-4 w-full h-full overflow-auto">
          <ChatHistory messages={messages} />
        </div>
        <ChatInputBox
          inputValue={inputValue}
          setInputValue={setInputValue}
          addMessage={addMessage}
          isWaitingForResponse={isWaitingForResponse}
        />
      </div>
      <StateSideBar messages={messages} currentState={currentState} />
    </div>
  );
}

export default withAuthenticator(ChatPage);
