import React, { useState } from 'react';
import { Upload, Plus, X, Check, Eye } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

const AddSpace = ({ user, onAddSpace }) => {
  const [step, setStep] = useState('form'); // 'form' | 'preview'
  const [formData, setFormData] = useState({
    name: '',
    type: 'garage',
    location: '',
    price: '',
    description: '',
    features: []
  });

  const [images, setImages] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [customFeature, setCustomFeature] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableFeatures = [
    'Seguridad 24/7',
    'Acceso controlado',
    'Iluminación LED',
    'Ventilación',
    'Cámaras de seguridad',
    'WiFi',
    'Aire acondicionado',
    'Control remoto',
    'Techo alto',
    'Puerta ancha'
  ];

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push('El nombre es obligatorio');
    if (!formData.location.trim()) errors.push('La ubicación es obligatoria');
    if (!formData.price) errors.push('El precio es obligatorio');
    if (Number(formData.price) <= 0) errors.push('El precio debe ser mayor a 0');
    if (!formData.description.trim()) errors.push('La descripción es obligatoria');
    if (images.length === 0) errors.push('Debes subir al menos una imagen');
    if (formData.description.length < 20) errors.push('La descripción debe tener al menos 20 caracteres');
    if (selectedFeatures.length === 0) errors.push('Selecciona al menos una característica');

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature)) {
      setSelectedFeatures(prev => [...prev, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const handlePreview = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      setError(errors.join('\n'));
      return;
    }
    setStep('preview');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const errors = validateForm();
      if (errors.length > 0) {
        throw new Error(errors.join('\n'));
      }

      // Procesar las imágenes
      const imageUrls = await Promise.all(images.map(async (file) => {
        return URL.createObjectURL(file);
      }));

      const newSpace = {
        ...formData,
        price: Number(formData.price),
        features: selectedFeatures,
        ownerId: user.id,
        status: 'active',
        images: imageUrls,
        createdAt: new Date().toISOString()
      };

      await onAddSpace(newSpace);
      window.location.href = '/host-dashboard';
    } catch (error) {
      setError(error.message);
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Componente de Preview
  const SpacePreview = () => (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{formData.name}</h2>

        {/* Image Gallery */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {images.map((image, index) => (
            <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img
                src={URL.createObjectURL(image)}
                alt={`Vista ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Detalles</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tipo:</span>
                <span className="ml-2 text-gray-900">{formData.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Ubicación:</span>
                <span className="ml-2 text-gray-900">{formData.location}</span>
              </div>
              <div>
                <span className="text-gray-500">Precio:</span>
                <span className="ml-2 text-gray-900">${formData.price}/mes</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Descripción</h3>
            <p className="text-gray-600">{formData.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Características</h3>
            <div className="flex flex-wrap gap-2">
              {selectedFeatures.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-6">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar espacio'}
          </button>
        </div>
      </div>
    </div>
  );

  if (step === 'preview') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <SpacePreview />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Publicar un nuevo espacio
          </h1>

          <form className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre del espacio *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de espacio *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="garage">Garage</option>
                  <option value="almacen">Almacén</option>
                  <option value="oficina">Oficina</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Precio por mes (USD) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Características
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {availableFeatures.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => handleFeatureToggle(feature)}
                    className={`px-4 py-2 rounded-full text-sm flex items-center justify-center gap-2 ${
                      selectedFeatures.includes(feature)
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-gray-100 text-gray-700 border-gray-200'
                    } border hover:bg-orange-50`}
                  >
                    {selectedFeatures.includes(feature) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {feature}
                  </button>
                ))}
              </div>

              {/* Custom Feature Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFeature}
                  onChange={(e) => setCustomFeature(e.target.value)}
                  placeholder="Agregar característica personalizada"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomFeature}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Image Upload */}
            <ImageUpload onImagesChange={setImages} />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg whitespace-pre-line">
                {error}
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => window.location.href = '/host-dashboard'}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handlePreview}
                className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                <Eye className="h-5 w-5" />
                Vista previa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSpace;