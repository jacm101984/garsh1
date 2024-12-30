import React, { useState } from 'react';
import { CreditCard, Calendar, Lock, AlertCircle } from 'lucide-react';

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      setPaymentData(prev => ({
        ...prev,
        [name]: formatCardNumber(value)
      }));
    } else if (name === 'expiry') {
      // Format MM/YY
      const formatted = value
        .replace(/[^\d]/g, '')
        .substring(0, 4)
        .replace(/(\d{2})(\d)/, '$1/$2');
      setPaymentData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else if (name === 'cvv') {
      // Only allow numbers and max 4 digits
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

  const validateCard = () => {
    const { cardNumber, cardName, expiry, cvv } = paymentData;

    if (cardNumber.replace(/\s/g, '').length < 16) {
      return 'Número de tarjeta inválido';
    }

    if (cardName.length < 3) {
      return 'Nombre del titular inválido';
    }

    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
      return 'Fecha de expiración inválida';
    }

    const [month, year] = expiry.split('/');
    const now = new Date();
    const cardDate = new Date(2000 + parseInt(year), parseInt(month) - 1);

    if (cardDate < now) {
      return 'La tarjeta ha expirado';
    }

    if (cvv.length < 3) {
      return 'CVV inválido';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateCard();
    if (error) {
      setStatus({ error });
      return;
    }

    setStatus({ loading: true, error: '' });

    try {
      // Aquí iría la integración real con el sistema de pagos
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación de proceso de pago

      onPaymentComplete({
        last4: paymentData.cardNumber.slice(-4),
        cardType: getCardType(paymentData.cardNumber),
        amount: total
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
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Información de pago</h2>
        <div className="flex items-center text-gray-500">
          <Lock className="w-4 h-4 mr-1" />
          <span className="text-sm">Pago seguro</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de tarjeta
          </label>
          <div className="relative">
            <input
              type="text"
              name="cardNumber"
              value={paymentData.cardNumber}
              onChange={handleInputChange}
              placeholder="1234 5678 9012 3456"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              maxLength="19"
              required
            />
            <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Card Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del titular
          </label>
          <input
            type="text"
            name="cardName"
            value={paymentData.cardName}
            onChange={handleInputChange}
            placeholder="Como aparece en la tarjeta"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Expiry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de expiración
            </label>
            <div className="relative">
              <input
                type="text"
                name="expiry"
                value={paymentData.expiry}
                onChange={handleInputChange}
                placeholder="MM/YY"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                maxLength="5"
                required
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* CVV */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="password"
              name="cvv"
              value={paymentData.cvv}
              onChange={handleInputChange}
              placeholder="123"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              maxLength="4"
              required
            />
          </div>
        </div>

        {/* Total Amount */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Total a pagar</span>
            <span className="text-2xl font-bold text-gray-900">${total}</span>
          </div>
        </div>

        {/* Error Message */}
        {status.error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{status.error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={status.loading}
            className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600
              transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {status.loading ? 'Procesando...' : 'Pagar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;