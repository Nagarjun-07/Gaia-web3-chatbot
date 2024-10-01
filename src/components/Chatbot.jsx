import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { BsFillSendFill } from 'react-icons/bs';
import { FaRobot, FaUserAlt } from 'react-icons/fa';

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = 'https://llamatool.us.gaianet.network/v1';
  const LLM_MODEL_NAME = 'llama';
  const API_KEY = ''; // Empty string or any value

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, isUser: true, timestamp: new Date().toLocaleTimeString() };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/chat/completions`,
        {
          model: LLM_MODEL_NAME,
          messages: [{ role: 'user', content: input }],
          max_tokens: 150,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
          },
        }
      );

      const botResponse = response.data.choices[0].message.content.trim();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, isUser: false, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Sorry, I encountered an error.', isUser: false, timestamp: new Date().toLocaleTimeString() },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-cover bg-center" style={{ backgroundImage: 'url("https://source.unsplash.com/featured/?water")' }}>
      <div className="bg-gradient-to-r from-teal-500 to-blue-800 text-white p-4 text-xl font-bold shadow-lg flex justify-between items-center">
        <span>Web3</span>
        <span className="text-sm text-gray-200 italic">Arjun 's Chatbot </span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-opacity-75">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex-shrink-0">
              {message.isUser ? (
                <FaUserAlt className="text-blue-200 text-lg animate-bounce" />
              ) : (
                <FaRobot className="text-indigo-300 text-lg animate-spin" />
              )}
            </div>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg ${
                message.isUser ? 'bg-gradient-to-r from-teal-400 to-blue-400 text-white' : 'bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800'
              }`}
              style={{ animation: 'fadeIn 0.5s ease-in-out' }}
            >
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{message.isUser ? 'You' : 'Chatbot'}</p>
                <span className="text-xs text-gray-500">{message.timestamp}</span>
              </div>
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start space-x-2">
            <FaRobot className="text-indigo-300 text-lg animate-spin" />
            <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gradient-to-r from-gray-300 to-gray-100 shadow-md backdrop-blur-lg">
              <p className="text-sm font-semibold mb-1">Chatbot</p>
              <p className="text-gray-600">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-100 shadow-md backdrop-blur-md">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white bg-opacity-80"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:scale-105 flex items-center space-x-2 transition-all duration-300 ease-in-out"
          >
            <BsFillSendFill className="text-lg" />
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
