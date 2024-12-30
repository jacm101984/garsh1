import React, { useState } from 'react';

const Reviews = ({ reviews, allowRating = false, onAddReview }) => {
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleAddReview = () => {
    if (newReview && rating > 0) {
      onAddReview({ text: newReview, rating });
      setNewReview('');
      setRating(0);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold">Reseñas</h3>
      <ul className="mt-2 space-y-2">
        {reviews.map((review, index) => (
          <li key={index} className="p-2 border-b">
            <p className="text-sm text-gray-700">{review.text}</p>
            <div className="flex items-center mt-1">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`${
                    i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>

      {allowRating && (
        <div className="mt-4">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Escribe una reseña"
            className="w-full p-2 border rounded"
          ></textarea>
          <div className="mt-2 flex items-center">
            <span className="mr-2">Calificación:</span>
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                onClick={() => setRating(i + 1)}
                className={`${
                  i < rating ? 'text-yellow-400' : 'text-gray-300'
                } text-xl`}
              >
                ★
              </button>
            ))}
          </div>
          <button
            onClick={handleAddReview}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Reseña
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
