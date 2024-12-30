import React, { useState, useEffect, useRef } from 'react';
import { Send, Image, Paperclip, MoreVertical, ArrowLeft, Phone, Video, Search } from 'lucide-react';

const ChatMessage = ({ message, isOwn }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwn
            ? 'bg-orange-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className={`text-xs mt-1 block ${isOwn ? 'text-orange-100' : 'text-gray-500'}`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};

const ChatHeader = ({ recipient, onBack }) => (
  <div className="bg-white border-b p-4 flex items-center space-x-4">
    <button onClick={onBack} className="lg:hidden">
      <ArrowLeft className="h-6 w-6 text-gray-600" />
    </button>
    <div className="flex-1">
      <h3 className="font-semibold text-gray-800">{recipient.name}</h3>
      <p className="text-sm text-gray-500">{recipient.isOnline ? 'En línea' : 'Desconectado'}</p>
    </div>
    <div className="flex items-center space-x-4">
      <button className="text-gray-600 hover:text-gray-800">
        <Phone className="h-5 w-5" />
      </button>
      <button className="text-gray-600 hover:text-gray-800">
        <Video className="h-5 w-5" />
      </button>
      <button className="text-gray-600 hover:text-gray-800">
        <MoreVertical className="h-5 w-5" />
      </button>
    </div>
  </div>
);

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t p-4">
      <div className="flex items-center space-x-4">
        <button type="button" className="text-gray-500 hover:text-gray-600">
          <Image className="h-6 w-6" />
        </button>
        <button type="button" className="text-gray-500 hover:text-gray-600">
          <Paperclip className="h-6 w-6" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white rounded-full p-2 hover:bg-orange-600"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

const ChatList = ({ chats, activeChat, onSelectChat, onSearch }) => (
  <div className="border-r h-full flex flex-col">
    <div className="p-4 border-b">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar chats..."
          className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:border-orange-500"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
    <div className="flex-1 overflow-y-auto">
      {chats.map((chat) => (
        <button
          key={chat.id}
          onClick={() => onSelectChat(chat)}
          className={`w-full text-left p-4 border-b hover:bg-gray-50 flex items-center space-x-4 ${
            activeChat?.id === chat.id ? 'bg-orange-50' : ''
          }`}
        >
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{chat.recipient.name}</h4>
            <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
          </div>
          {chat.unreadCount > 0 && (
            <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1">
              {chat.unreadCount}
            </span>
          )}
        </button>
      ))}
    </div>
  </div>
);

const ChatWindow = ({ chat, currentUserId, onSendMessage, onBack }) => {
  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Selecciona un chat para comenzar</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ChatHeader recipient={chat.recipient} onBack={onBack} />
      <div className="flex-1 overflow-y-auto p-4 bg-white">
        {chat.messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message}
            isOwn={message.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};

const MessageCenter = ({ currentUserId }) => {
  const [chats, setChats] = useState([
    {
      id: 1,
      recipient: { id: 2, name: 'Juan Pérez', isOnline: true },
      lastMessage: 'Hola, ¿está disponible el espacio?',
      unreadCount: 2,
      messages: [
        {
          id: 1,
          content: 'Hola, me interesa tu espacio',
          senderId: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 2,
          content: '¿Está disponible para el próximo mes?',
          senderId: 2,
          timestamp: new Date(Date.now() - 3000000).toISOString(),
        },
      ],
    },
    // Añade más chats de ejemplo aquí
  ]);

  const [activeChat, setActiveChat] = useState(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleSendMessage = (content) => {
    if (!activeChat) return;

    const newMessage = {
      id: Date.now(),
      content,
      senderId: currentUserId,
      timestamp: new Date().toISOString(),
    };

    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChat.id
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
              lastMessage: content,
            }
          : chat
      )
    );
  };

  const handleSearch = (searchTerm) => {
    // Implementar búsqueda de chats
  };

  return (
    <div className="h-[800px] bg-gray-50 rounded-lg overflow-hidden">
      <div className="h-full flex">
        <div className={`w-full lg:w-1/3 ${showMobileChat ? 'hidden' : 'block'} lg:block`}>
          <ChatList
            chats={chats}
            activeChat={activeChat}
            onSelectChat={(chat) => {
              setActiveChat(chat);
              setShowMobileChat(true);
            }}
            onSearch={handleSearch}
          />
        </div>
        <div className={`w-full lg:w-2/3 ${showMobileChat ? 'block' : 'hidden'} lg:block`}>
          <ChatWindow
            chat={activeChat}
            currentUserId={currentUserId}
            onSendMessage={handleSendMessage}
            onBack={() => setShowMobileChat(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageCenter;