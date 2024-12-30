import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !role) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
      role: role === 'both' ? ['user', 'host'] : [role],
    };

    // Simular guardado en el backend
    console.log('Usuario registrado:', newUser);

    // Autenticar al usuario y redirigir
    setUser(newUser);
    navigate('/');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Regístrate</h1>
      <form
        onSubmit={handleRegister}
        className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-md mx-auto"
      >
        {errorMessage && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Nombre:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
            Correo Electrónico:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded p-2 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">
            Selecciona tu Rol:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border rounded p-2 w-full"
            required
          >
            <option value="">Selecciona un rol</option>
            <option value="user">Usuario</option>
            <option value="host">Anfitrión</option>
            <option value="both">Ambos</option>
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
