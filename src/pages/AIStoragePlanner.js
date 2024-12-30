import React, { useState } from 'react';

const AIStoragePlanner = () => {
  const [image, setImage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const analyzeImage = async () => {
    setLoading(true);

    // Simulación de análisis de imagen
    setTimeout(() => {
      setRecommendations([
        { type: 'Rack', quantity: 3, capacity: '30 boxes each' },
        { type: 'Shelf', quantity: 5, capacity: '20 items each' },
      ]);
      setLoading(false);
    }, 2000);

    // Para la integración real:
    // 1. Subir la imagen a un servidor o API
    // 2. Procesar con un modelo de IA y obtener las recomendaciones
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Planificador de Almacenamiento</h1>

      <div className="mb-6 text-center">
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && (
          <div className="mt-4">
            <img src={image} alt="Espacio subido" className="max-w-md mx-auto" />
          </div>
        )}
      </div>

      <button
        onClick={analyzeImage}
        disabled={!image || loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? 'Analizando...' : 'Analizar Imagen'}
      </button>

      {recommendations.length > 0 && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Recomendaciones</h2>
          <ul className="list-disc pl-6">
            {recommendations.map((rec, index) => (
              <li key={index} className="mb-2">
                {rec.quantity} {rec.type}(s) con capacidad para {rec.capacity}.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIStoragePlanner;
