import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SpaceDetails from './pages/SpaceDetails';
import AddSpace from './pages/AddSpace';
import Favorites from './pages/Favorites';
import HostDashboard from './pages/HostDashboard';
import UserDashboard from './pages/UserDashboard';
import Reservation from './pages/Reservation';
import Login from './pages/Login';
import Register from './pages/Register';
import AIPlanner from './pages/AIPlanner';
import MessageCenter from './components/MessageCenter';
import './index.css';

function App() {
  // Initial data
 // Initial data
const initialSpaces = [
  {
    id: 1,
    name: 'Garage Premium Centro',
    location: 'Centro, Madrid',
    price: 150,
    type: 'garage',
    description: 'Espacioso garage con seguridad 24/7',
    rating: 4.8,
    features: ['Security Camera', 'Climate Control', '24/7 Access'],
    status: 'active',
    ownerId: 2,
    size: 25, // m²
    image: './api/placeholder/400/250?text=Garage+Premium'
  },
  {
    id: 2,
    name: 'Almacén Industrial Sur',
    location: 'Sur, Madrid',
    price: 280,
    type: 'almacen',
    description: 'Almacén industrial con control climático',
    rating: 4.5,
    features: ['Climate Control', 'Security Camera', 'Loading Dock'],
    status: 'active',
    ownerId: 3,
    size: 75,
    image: './api/placeholder/400/250?text=Almacen+Industrial'
  },
  {
    id: 3,
    name: 'Mini Garage Económico',
    location: 'Norte, Madrid',
    price: 80,
    type: 'garage',
    description: 'Perfecto para vehículos pequeños',
    rating: 4.2,
    features: ['Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 2,
    size: 15,
    image: './api/placeholder/400/250?text=Mini+Garage'
  },
  {
    id: 4,
    name: 'Almacén Climatizado Este',
    location: 'Este, Madrid',
    price: 200,
    type: 'almacen',
    description: 'Control de temperatura y humedad',
    rating: 4.7,
    features: ['Climate Control', 'Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 4,
    size: 45,
    image: './api/placeholder/400/250?text=Almacen+Climatizado'
  },
  {
    id: 5,
    name: 'Garage Doble Premium',
    location: 'Centro, Madrid',
    price: 250,
    type: 'garage',
    description: 'Ideal para dos vehículos grandes',
    rating: 4.9,
    features: ['Security Camera', 'Climate Control', 'Electric Charger'],
    status: 'active',
    ownerId: 2,
    size: 35,
    image: './api/placeholder/400/250?text=Garage+Doble'
  },
  {
    id: 6,
    name: 'Almacén Pequeño 24h',
    location: 'Oeste, Madrid',
    price: 90,
    type: 'almacen',
    description: 'Acceso las 24 horas',
    rating: 4.3,
    features: ['24/7 Access', 'Security Camera'],
    status: 'active',
    ownerId: 3,
    size: 18,
    image: './api/placeholder/400/250?text=Almacen+Pequeno'
  },
  {
    id: 7,
    name: 'Garage Lujo Premium',
    location: 'Norte, Madrid',
    price: 300,
    type: 'garage',
    description: 'Garage de lujo con servicios premium',
    rating: 5.0,
    features: ['Security Camera', 'Climate Control', 'Valet Service'],
    status: 'active',
    ownerId: 2,
    size: 40,
    image: './api/placeholder/400/250?text=Garage+Lujo'
  },
  {
    id: 8,
    name: 'Almacén Grande Industrial',
    location: 'Sur, Madrid',
    price: 400,
    type: 'almacen',
    description: 'Gran espacio para almacenamiento industrial',
    rating: 4.6,
    features: ['Security Camera', 'Loading Dock', 'Climate Control'],
    status: 'active',
    ownerId: 4,
    size: 100,
    image: './api/placeholder/400/250?text=Almacen+Grande'
  },
  {
    id: 9,
    name: 'Mini Storage Plus',
    location: 'Este, Madrid',
    price: 70,
    type: 'almacen',
    description: 'Almacenamiento personal seguro',
    rating: 4.4,
    features: ['Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 3,
    size: 12,
    image: './api/placeholder/400/250?text=Mini+Storage'
  },
  {
    id: 10,
    name: 'Garage Familiar',
    location: 'Oeste, Madrid',
    price: 180,
    type: 'garage',
    description: 'Ideal para vehículo familiar',
    rating: 4.5,
    features: ['Security Camera', 'Climate Control'],
    status: 'active',
    ownerId: 2,
    size: 30,
    image: './api/placeholder/400/250?text=Garage+Familiar'
  },
  {
    id: 11,
    name: 'Almacén Empresarial',
    location: 'Centro, Madrid',
    price: 350,
    type: 'almacen',
    description: 'Soluciones de almacenamiento empresarial',
    rating: 4.8,
    features: ['Climate Control', 'Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 4,
    size: 85,
    image: './api/placeholder/400/250?text=Almacen+Empresarial'
  },
  {
    id: 12,
    name: 'Garage Básico',
    location: 'Sur, Madrid',
    price: 95,
    type: 'garage',
    description: 'Garage básico pero funcional',
    rating: 4.1,
    features: ['Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 2,
    size: 20,
    image: './api/placeholder/400/250?text=Garage+Basico'
  },
  {
    id: 13,
    name: 'Almacén Logístico Premium',
    location: 'Norte, Madrid',
    price: 450,
    type: 'almacen',
    description: 'Centro logístico con todas las comodidades',
    rating: 4.9,
    features: ['Climate Control', 'Security Camera', 'Loading Dock'],
    status: 'active',
    ownerId: 4,
    size: 150,
    image: './api/placeholder/400/250?text=Almacen+Logistico'
  },
  {
    id: 14,
    name: 'Garage Compacto',
    location: 'Este, Madrid',
    price: 85,
    type: 'garage',
    description: 'Perfecto para motos o vehículos pequeños',
    rating: 4.3,
    features: ['Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 2,
    size: 16,
    image: './api/placeholder/400/250?text=Garage+Compacto'
  },
  {
    id: 15,
    name: 'Almacén Moderno Centro',
    location: 'Centro, Madrid',
    price: 320,
    type: 'almacen',
    description: 'Instalaciones modernas y seguras',
    rating: 4.7,
    features: ['Climate Control', 'Security Camera', '24/7 Access'],
    status: 'active',
    ownerId: 3,
    size: 65,
    image: './api/placeholder/400/250?text=Almacen+Moderno'
  }
];

  // States
  const [spaces, setSpaces] = useState(initialSpaces);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [user, setUser] = useState(() => ({
    id: 1,
    name: 'Usuario de Prueba',
    email: 'usuario@test.com',
    role: ['user'],
    avatar: null
  }));
  const [reservations, setReservations] = useState(() => {
    const savedReservations = localStorage.getItem('reservations');
    return savedReservations ? JSON.parse(savedReservations) : [];
  });
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Local Storage Persistence
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('spaces', JSON.stringify(spaces));
  }, [spaces]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // Handlers
  const handleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleAddSpace = (newSpace) => {
    const spaceWithId = {
      ...newSpace,
      id: spaces.length + 1,
      rating: 0,
      status: 'active',
      features: newSpace.features || [],
      ownerId: user.id
    };
    setSpaces((prev) => [...prev, spaceWithId]);
  };

  const handleDeleteSpace = (id) => {
    setSpaces(prev => prev.filter(space => space.id !== id));
  };

  const handleEditSpace = (id, updatedSpace) => {
    setSpaces(prev => prev.map(space =>
      space.id === id ? { ...space, ...updatedSpace } : space
    ));
  };

  const handleReserve = async (spaceId, startDate, endDate) => {
    try {
      const space = spaces.find((space) => space.id === spaceId);
      if (!space) {
        throw new Error('Space not found');
      }

      // Calculate total price
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const basePrice = days * space.price;
      const serviceFee = basePrice * 0.1;
      const totalPrice = basePrice + serviceFee;

      const newReservation = {
        id: reservations.length + 1,
        spaceId,
        userId: user?.id || 1,
        spaceName: space.name,
        startDate,
        endDate,
        totalPrice,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        location: space.location,
        spaceType: space.type,
        ownerId: space.ownerId
      };

      setReservations(prev => [...prev, newReservation]);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return newReservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  };

  const handleAddReview = (spaceId, review) => {
    const newReview = {
      id: reviews.length + 1,
      spaceId,
      userId: user?.id || 1,
      userName: user?.name || 'Usuario Anónimo',
      ...review,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [...prev, newReview]);

    // Update space rating
    const spaceReviews = [...reviews, newReview].filter(r => r.spaceId === spaceId);
    const averageRating = spaceReviews.reduce((acc, r) => acc + r.rating, 0) / spaceReviews.length;

    handleEditSpace(spaceId, { rating: averageRating });
  };

  const handleSendMessage = (recipientId, content) => {
    const newMessage = {
      id: messages.length + 1,
      senderId: user?.id || 1,
      recipientId,
      content,
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const ProtectedRoute = ({ children, condition }) => {
    return condition ? children : <Login setUser={setUser} />;
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar user={user} setUser={setUser} />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  spaces={spaces}
                  onFavorite={handleFavorite}
                  favorites={favorites}
                  user={user}
                  onReserve={handleReserve}
                  reservations={reservations}
                />
              }
            />
            <Route
              path="/space/:id"
              element={
                <SpaceDetails
                  spaces={spaces}
                  onFavorite={handleFavorite}
                  favorites={favorites}
                  user={user}
                  reviews={reviews}
                  onAddReview={handleAddReview}
                />
              }
            />
            <Route
              path="/space/:id/reserve"
              element={
                <ProtectedRoute condition={!!user}>
                  <Reservation
                    spaces={spaces}
                    reservations={reservations}
                    onReserve={handleReserve}
                    onNavigateBack={() => window.history.back()}
                    onNavigateHome={() => window.location.href = '#/'}
                    onReservationComplete={() => {
                      window.location.href = '#/user-dashboard'
                    }}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-space"
              element={
                <ProtectedRoute condition={user?.role?.includes('host')}>
                  <AddSpace user={user} onAddSpace={handleAddSpace} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute condition={!!user}>
                  <Favorites
                    spaces={spaces}
                    favorites={favorites}
                    onFavorite={handleFavorite}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host-dashboard"
              element={
                <ProtectedRoute condition={user?.role?.includes('host')}>
                  <HostDashboard
                    spaces={spaces}
                    onDeleteSpace={handleDeleteSpace}
                    onEditSpace={handleEditSpace}
                    reservations={reservations}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-dashboard"
              element={
                <ProtectedRoute condition={!!user}>
                  <UserDashboard
                    userId={user?.id || 1}
                    reservations={reservations}
                    spaces={spaces}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-planner"
              element={
                <ProtectedRoute condition={!!user}>
                  <AIPlanner spaces={spaces} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute condition={!!user}>
                  <MessageCenter
                    currentUserId={user?.id}
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    spaces={spaces}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;