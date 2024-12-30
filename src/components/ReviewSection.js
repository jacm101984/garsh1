import React, { useState } from 'react';
import { Star, ThumbsUp, Flag, User } from 'lucide-react';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor selecciona una calificación');
      return;
    }
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Calificación
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= (hover || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tu opinión
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
          placeholder="Comparte tu experiencia..."
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
        >
          Publicar reseña
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

const ReviewCard = ({ review }) => {
  const [helpful, setHelpful] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="border-b border-gray-200 py-4 last:border-0">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-full p-2">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{review.userName}</h4>
            <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-4 h-4 ${
                index < review.rating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-600 mb-4">{review.comment}</p>

      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={() => setHelpful(!helpful)}
          className={`flex items-center gap-1 ${
            helpful ? 'text-green-600' : 'text-gray-500'
          } hover:text-green-600`}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{helpful ? 'Útil' : '¿Te resultó útil?'}</span>
        </button>
        <button className="flex items-center gap-1 text-gray-500 hover:text-red-600">
          <Flag className="w-4 h-4" />
          <span>Reportar</span>
        </button>
      </div>
    </div>
  );
};

const ReviewSection = ({ reviews, spaceId, onAddReview, user }) => {
  const [showForm, setShowForm] = useState(false);

  const spaceReviews = reviews.filter(review => review.spaceId === spaceId);
  const averageRating = spaceReviews.length
    ? spaceReviews.reduce((acc, review) => acc + review.rating, 0) / spaceReviews.length
    : 0;

  const ratingBreakdown = {
    5: spaceReviews.filter(r => r.rating === 5).length,
    4: spaceReviews.filter(r => r.rating === 4).length,
    3: spaceReviews.filter(r => r.rating === 3).length,
    2: spaceReviews.filter(r => r.rating === 2).length,
    1: spaceReviews.filter(r => r.rating === 1).length,
  };

  const handleSubmitReview = (reviewData) => {
    onAddReview(spaceId, reviewData);
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Reseñas y calificaciones</h2>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Average Rating */}
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <div className="flex items-center mb-1">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-5 h-5 ${
                    index < Math.round(averageRating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {spaceReviews.length} {spaceReviews.length === 1 ? 'reseña' : 'reseñas'}
            </p>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingBreakdown[rating];
            const percentage = spaceReviews.length
              ? (count / spaceReviews.length) * 100
              : 0;

            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-gray-600">{rating}</span>
                  <Star className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Review Button */}
      {user && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors"
        >
          Escribir una reseña
        </button>
      )}

      {/* Review Form */}
      {showForm && (
        <div className="mb-6">
          <ReviewForm
            onSubmit={handleSubmitReview}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {spaceReviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay reseñas aún. ¡Sé el primero en dejar una!
          </p>
        ) : (
          spaceReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;