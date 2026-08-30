import React, { useState } from 'react';
import { Star, X, Loader2, Send } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const ReviewForm = ({ existingReview = null, onSubmit, onClose }) => {
  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      showToast('Please select a star rating between 1 and 5', 'error');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      showToast('Please provide both review title and comment', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ rating, title, comment });
      showToast(
        existingReview ? 'Review updated successfully!' : 'Review submitted successfully!',
        'success'
      );
      if (onClose) onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              {existingReview ? 'Edit Your Review' : 'Write a Product Review'}
            </h3>
            <p className="text-xs text-slate-400">Share your experience with other shoppers</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Rating Selection */}
          <div className="space-y-2 text-center">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Your Rating
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 ${
                      (hoverRating || rating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-amber-300 font-semibold block">
              {rating === 5 && 'Outstanding'}
              {rating === 4 && 'Very Good'}
              {rating === 3 && 'Average'}
              {rating === 2 && 'Poor'}
              {rating === 1 && 'Terrible'}
            </span>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Review Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Headline for your review (e.g. Great build quality!)"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Review Comment</label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike? How does it perform?"
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-2">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{existingReview ? 'Update Review' : 'Submit Review'}</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
