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
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const getToken = async () => {
    const session = await fetchAuthSession();
    const accessToken = session.tokens?.accessToken;
    if (!accessToken) {
      throw new Error('No id token found');
    }
    return accessToken;
  };

  const fetchSessions = useCallback(async () => {
    try {
      const accessToken = await getToken();
      const response = await fetch('http://127.0.0.1:8000/sessions', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }

      const data = await response.json();
      setSessions(data.sessions);

      if (data.sessions.length > 0 && !currentSessionId) {
        setCurrentSessionId(data.sessions[0]);
        fetchChatHistory(data.sessions[0]);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  }, [currentSessionId]);

  const createNewSession = async (): Promise<string> => {
    try {
      const accessToken = await getToken();
      const response = await fetch('http://127.0.0.1:8000/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      if (!data.session_id) {
        throw new Error('No session ID returned from server');
      }

      setSessions((prevSessions) => [...prevSessions, data.session_id]);
      setCurrentSessionId(data.session_id);
      setMessages([]);
      setCurrentState(undefined);

      if (inputRef.current) {
        inputRef.current.focus();
      }

      return data.session_id;
    } catch (err) {
      console.error('Error creating new session:', err);
      throw err;
    }
  };

  const fetchChatHistory = useCallback(async (sessionId: string) => {
    try {
      const accessToken = await getToken();
      const response = await fetch(
        `http://127.0.0.1:8000/user_data?session_id=${sessionId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server response:', errorData);
        throw new Error(JSON.stringify(errorData));
      }

      const data = await response.json();
      const chatHistory = data.chat_history;
      const state = data.state;

      if (chatHistory) {
        setMessages(
          chatHistory.map((message: any) => ({
            text: message.content,
            isBot: message.role === 'assistant',
          }))
        );
      } else {
        setMessages([]);
      }

      if (state) {
        const reorderedState = reorderState(state);
        setCurrentState(reorderedState);
      } else {
        setCurrentState(undefined);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setMessages([]);
      setCurrentState(undefined);
    }
  }, []);

  const sendPrompt = async (prompt: string) => {
    setIsWaitingForResponse(true);

    let sessionId = currentSessionId;
    if (!sessionId) {
      try {
        sessionId = await createNewSession();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: prompt, isBot: false },
        ]);
      } catch (err) {
        console.error('Failed to create new session:', err);
        return; // Exit the function if we couldn't create a new session
      }
    }

    try {
      const accessToken = await getToken();

      const response = await fetch('http://127.0.0.1:8000/chats', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_input: prompt,
          session_id: sessionId,
        }),
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

      fetchSessions(); // update sidebar immediately after successful chat
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
    fetchSessions();
  }, [fetchSessions]);

  const handleSessionChange = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setMessages([]);
    fetchChatHistory(sessionId);

    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen max-h-screen flex bg-primary overflow-hidden">
      <ChatSideBar
        messages={messages}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionChange={handleSessionChange}
        onNewSession={createNewSession}
      />
      <div className="flex flex-col flex-grow py-8">
        <div className="pl-4 w-full h-full overflow-auto">
          <ChatHistory messages={messages} />
        </div>
        <ChatInputBox
          inputValue={inputValue}
          setInputValue={setInputValue}
          addMessage={addMessage}
          isWaitingForResponse={isWaitingForResponse}
          inputRef={inputRef}
        />
      </div>
      <StateSideBar messages={messages} currentState={currentState} />
    </div>
  );
}

export default withAuthenticator(ChatPage);
