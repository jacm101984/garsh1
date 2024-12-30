import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, DollarSign, Clock, Shield, Heart, Share2, Calendar } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

const SpaceDetails = ({ spaces, onFavorite, favorites, user, reviews, onAddReview }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const space = spaces.find(space => space.id === parseInt(id));
  const isFavorite = favorites?.includes(parseInt(id));
  const [activeImage, setActiveImage] = useState(0);

  const images = [
    `/api/placeholder/800/400?text=${encodeURIComponent(space?.name || 'Loading...')}`,
    `/api/placeholder/800/400?text=Inside View`,
    `/api/placeholder/800/400?text=Security Features`,
  ];

  const features = space?.features || [
    { name: 'Seguridad 24/7', description: 'Sistema de vigilancia y monitoreo constante' },
    { name: 'Acceso controlado', description: 'Sistema de acceso con código personal' },
    { name: 'Iluminación', description: 'Sistema de iluminación automático' },
    { name: 'Limpieza', description: 'Servicio de limpieza regular' },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: space.name,
        text: space.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace copiado al portapapeles!');
    }
  };

  if (!space) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Espacio no encontrado</h2>
          <p className="mt-2 text-gray-600">El espacio que buscas no está disponible.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{space.name}</h1>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {space.location}
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {space.rating?.toFixed(1)} ({reviews?.filter(r => r.spaceId === parseInt(id)).length || 0} reseñas)
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onFavorite(parseInt(id))}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-500'
                  } hover:bg-gray-100`}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
              <img
                src={images[activeImage]}
                alt={space.name}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative rounded-lg overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-orange-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`Vista ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Acerca de este espacio</h2>
                <p className="text-gray-600">{space.description}</p>
              </div>

              {/* Features */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Características</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.name}</h3>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <ReviewSection
                reviews={reviews || []}
                spaceId={parseInt(id)}
                onAddReview={onAddReview}
                user={user}
              />
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center text-2xl font-bold text-gray-900">
                    <DollarSign className="h-6 w-6" />
                    {space.price}
                    <span className="text-gray-500 text-base font-normal">/mes</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    {space.rating?.toFixed(1)}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    Horario de acceso: 9:00 AM - 6:00 PM
                  </div>

                  <button
                    onClick={() => navigate(`/space/${id}/reserve`)}
                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="h-5 w-5" />
                    Reservar ahora
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    No se te cobrará nada en este momento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceDetails;