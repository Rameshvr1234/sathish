import { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, ThumbsUp, User, Calendar, CheckCircle, X } from 'lucide-react';

const ReviewsRatings = ({ reviewType, entityId, entityName }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: '',
    cons: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [entityId, reviewType, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      const params = {
        review_type: reviewType,
        entity_id: entityId,
        sort: sortBy
      };

      if (filterRating !== 'all') {
        params.rating = filterRating;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reviews`, { params });
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/stats/${entityId}`, {
        params: { review_type: reviewType }
      });
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit a review');
        return;
      }

      const reviewData = {
        review_type: reviewType,
        entity_id: entityId,
        rating: reviewForm.rating,
        title: reviewForm.title,
        comment: reviewForm.comment,
        pros: reviewForm.pros.split('\n').filter(p => p.trim()),
        cons: reviewForm.cons.split('\n').filter(c => c.trim())
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/reviews`, reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Review submitted successfully! It will be visible after admin approval.');
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '', pros: '', cons: '' });
      fetchReviews();
      fetchStats();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to mark reviews as helpful');
        return;
      }

      await axios.post(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}/helpful`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update the review in the list
      setReviews(reviews.map(review =>
        review.id === reviewId
          ? { ...review, helpful_count: review.helpful_count + 1 }
          : review
      ));
    } catch (error) {
      console.error('Error marking as helpful:', error);
      alert(error.response?.data?.message || 'Error marking review as helpful');
    }
  };

  const renderStars = (rating, size = 20, interactive = false, onSelect = null) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:fill-yellow-300 hover:text-yellow-300' : ''}`}
            onClick={() => interactive && onSelect && onSelect(star)}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ratings & Reviews</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="text-5xl font-bold text-gray-900">
                  {stats.average_rating?.toFixed(1) || '0.0'}
                </span>
                <div>
                  {renderStars(Math.round(stats.average_rating || 0), 24)}
                  <p className="text-sm text-gray-600 mt-1">
                    {stats.total_reviews || 0} review{stats.total_reviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.rating_breakdown?.[rating] || 0;
                const percentage = stats.total_reviews > 0
                  ? (count / stats.total_reviews) * 100
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700 w-8">{rating}</span>
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Sort Controls */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Filter by:</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Write a Review
          </button>
        </div>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Write Your Review</h3>
            <button
              onClick={() => setShowReviewForm(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              {renderStars(reviewForm.rating, 32, true, (rating) =>
                setReviewForm({ ...reviewForm, rating })
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title *
              </label>
              <input
                type="text"
                value={reviewForm.title}
                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Summarize your experience"
                required
              />
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Share your detailed experience"
                required
              ></textarea>
            </div>

            {/* Pros */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pros (one per line)
              </label>
              <textarea
                value={reviewForm.pros}
                onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What did you like?&#10;Good location&#10;Well maintained"
              ></textarea>
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cons (one per line)
              </label>
              <textarea
                value={reviewForm.cons}
                onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What could be better?&#10;No parking&#10;Noisy neighborhood"
              ></textarea>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 mt-2">Be the first to review {entityName}!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {review.user?.full_name || 'Anonymous'}
                      </h4>
                      {review.verified_purchase && (
                        <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          <CheckCircle size={12} className="mr-1" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(review.rating, 16)}
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Admin Badge */}
                {review.status === 'approved' && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    Approved
                  </span>
                )}
              </div>

              {/* Review Title */}
              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>

              {/* Review Comment */}
              <p className="text-gray-700 mb-4">{review.comment}</p>

              {/* Pros and Cons */}
              {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {review.pros && review.pros.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h6 className="font-semibold text-green-900 mb-2">👍 Pros</h6>
                      <ul className="space-y-1">
                        {review.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-green-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <h6 className="font-semibold text-red-900 mb-2">👎 Cons</h6>
                      <ul className="space-y-1">
                        {review.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-red-800 flex items-start">
                            <span className="mr-2">•</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <button
                  onClick={() => handleMarkHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  <ThumbsUp size={16} />
                  Helpful ({review.helpful_count || 0})
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsRatings;
