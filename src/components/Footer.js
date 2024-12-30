import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4">
      <p>&copy; {new Date().getFullYear()} Garage Share. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
