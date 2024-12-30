import React, { useState } from 'react';

const MessageHost = ({ hostEmail }) => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();

    // Simular envío de mensaje
    console.log(`Mensaje enviado a ${hostEmail}: ${message}`);
    setMessage('');
    setSuccess(true);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Contactar al Anfitrión</h2>
      {success && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
          ¡Mensaje enviado con éxito!
        </div>
      )}
      <form onSubmit={handleSendMessage}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded p-2 w-full mb-4"
          rows="4"
          placeholder="Escribe tu mensaje..."
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Enviar Mensaje
        </button>
      </form>
    </div>
  );
};

export default MessageHost;
