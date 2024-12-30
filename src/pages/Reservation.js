import React, { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Shield, Info, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

const DateFormSection = ({ formData, handleInputChange, handleSubmit }) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de inicio
        </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
          min={new Date().toISOString().split('T')[0]}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hora de inicio
        </label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de fin
        </label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleInputChange}
          min={formData.startDate || new Date().toISOString().split('T')[0]}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hora de fin
        </label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>
    </div>

    <button
      type="submit"
      className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600
        transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Continuar al pago
    </button>
  </form>
);

const PaymentForm = ({ total, onPaymentComplete, onCancel }) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const [status, setStatus] = useState({
    loading: false,
    error: '',
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      setPaymentData(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }));
    } else if (name === 'expiry') {
      const formatted = value
        .replace(/[^\d]/g, '')
        .substring(0, 4)
        .replace(/(\d{2})(\d)/, '$1/$2');
      setPaymentData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else if (name === 'cvv') {
      const formatted = value.replace(/[^\d]/g, '').substring(0, 4);
      setPaymentData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '' });

    try {
      // Simulación del proceso de pago
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPaymentComplete({
        last4: paymentData.cardNumber.slice(-4),
        cardType: getCardType(paymentData.cardNumber)
      });
    } catch (error) {
      setStatus({
        loading: false,
        error: 'Error al procesar el pago. Por favor intenta de nuevo.'
      });
    }
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'MasterCard';
    if (cleaned.startsWith('3')) return 'American Express';
    return 'Tarjeta';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número de tarjeta
        </label>
        <div className="relative">
          <input
            type="text"
            name="cardNumber"
            value={paymentData.cardNumber}
            onChange={handlePaymentInputChange}
            placeholder="1234 5678 9012 3456"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            maxLength="19"
            required
          />
          <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del titular
        </label>
        <input
          type="text"
          name="cardName"
          value={paymentData.cardName}
          onChange={handlePaymentInputChange}
          placeholder="Como aparece en la tarjeta"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de expiración
          </label>
          <input
            type="text"
            name="expiry"
            value={paymentData.expiry}
            onChange={handlePaymentInputChange}
            placeholder="MM/YY"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            maxLength="5"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <input
            type="password"
            name="cvv"
            value={paymentData.cvv}
            onChange={handlePaymentInputChange}
            placeholder="123"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            maxLength="4"
            required
          />
        </div>
      </div>

      {status.error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">{status.error}</span>
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Volver
        </button>
        <button
          type="submit"
          disabled={status.loading}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600
            disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status.loading ? 'Procesando...' : `Pagar $${total}`}
        </button>
      </div>
    </form>
  );
};

const PriceSummary = ({ summary, space }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold mb-4">Resumen de costos</h2>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">
          ${space.price} × {summary.days} días
        </span>
        <span className="font-medium">${summary.basePrice}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Cargo por servicio</span>
        <span className="font-medium">${summary.serviceFee}</span>
      </div>
      <div className="border-t pt-3 flex justify-between items-center">
        <span className="font-semibold">Total</span>
        <span className="font-bold text-xl">${summary.total}</span>
      </div>
    </div>
  </div>
);

const Reservation = ({
  spaceId,
  spaces,
  reservations,
  onReserve,
  onNavigateBack,
  onNavigateHome,
  onReservationComplete
}) => {
  const [currentStep, setCurrentStep] = useState('dates');
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00'
  });

  const [summary, setSummary] = useState({
    days: 0,
    basePrice: 0,
    serviceFee: 0,
    total: 0
  });

  const [status, setStatus] = useState({
    success: '',
    error: '',
    loading: false
  });

  const space = spaces.find((s) => s.id === spaceId);

  useEffect(() => {
    if (formData.startDate && formData.endDate && space) {
      const start = new Date(`${formData.startDate}T${formData.startTime}`);
      const end = new Date(`${formData.endDate}T${formData.endTime}`);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      const basePrice = days * space.price;
      const serviceFee = basePrice * 0.1;

      setSummary({
        days,
        basePrice,
        serviceFee,
        total: basePrice + serviceFee
      });
    }
  }, [formData, space]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setStatus({ success: '', error: '' });
  };

  const isDateConflict = (start, end) => {
    const startDateTime = new Date(`${start}T${formData.startTime}`);
    const endDateTime = new Date(`${end}T${formData.endTime}`);

    return reservations.some(reservation =>
      reservation.spaceId === spaceId &&
      ((startDateTime >= new Date(reservation.startDate) &&
        startDateTime <= new Date(reservation.endDate)) ||
       (endDateTime >= new Date(reservation.startDate) &&
        endDateTime <= new Date(reservation.endDate)))
    );
  };

  const handleDateSubmit = (e) => {
    e.preventDefault();
    const { startDate, endDate, startTime, endTime } = formData;

    if (!startDate || !endDate) {
      setStatus({ error: 'Por favor selecciona ambas fechas.' });
      return;
    }

    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      setStatus({ error: 'La fecha/hora de inicio debe ser anterior a la fecha/hora de fin.' });
      return;
    }

    if (isDateConflict(startDate, endDate)) {
      setStatus({ error: 'Este espacio ya está reservado en las fechas seleccionadas.' });
      return;
    }

    setCurrentStep('payment');
  };

  const handlePaymentComplete = async (paymentDetails) => {
    setStatus({ loading: true });

    try {
      const { startDate, endDate, startTime, endTime } = formData;
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      await onReserve(spaceId, startDateTime.toISOString(), endDateTime.toISOString());

      setStatus({
        success: '¡Reserva realizada exitosamente!',
        loading: false
      });

      setTimeout(() => {
        onReservationComplete();
      }, 2000);
    } catch (error) {
      setStatus({
        error: 'Hubo un error al procesar tu reserva. Por favor intenta de nuevo.',
        loading: false
      });
    }
  };

  if (!space) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Espacio no encontrado</h2>
          <p className="text-gray-600 mb-4">El espacio que buscas no está disponible.</p>
          <button
            onClick={onNavigateHome}
            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
      <button
          onClick={onNavigateBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Space Details */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {space.name}
              </h1>

              <img
                src={space.image || `/api/placeholder/600/400?text=${encodeURIComponent(space.name)}`}
                alt={space.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />

              <div className="space-y-4">
                <p className="text-gray-600">{space.description}</p>

                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>Horario de acceso: 9:00 AM - 6:00 PM</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <Shield className="w-5 h-5 mr-2" />
                  <span>Espacio seguro y monitoreado 24/7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms and Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentStep === 'dates' ? 'Detalles de la reserva' : 'Información de pago'}
              </h2>

              {currentStep === 'dates' ? (
                <DateFormSection
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleDateSubmit}
                />
              ) : (
                <PaymentForm
                  total={summary.total}
                  onPaymentComplete={handlePaymentComplete}
                  onCancel={() => setCurrentStep('dates')}
                />
              )}
            </div>

            {summary.days > 0 && <PriceSummary summary={summary} space={space} />}

            {/* Status Messages */}
            {status.error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <Info className="w-5 h-5 mr-2 mt-0.5" />
                <span>{status.error}</span>
              </div>
            )}

            {status.success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start">
                <Info className="w-5 h-5 mr-2 mt-0.5" />
                <span>{status.success}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;