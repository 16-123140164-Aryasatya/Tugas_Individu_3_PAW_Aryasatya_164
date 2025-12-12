// ReviewList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReviewList({ refreshTrigger }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    fetchReviews();
  }, [refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('http://localhost:5000/api/reviews');
      setReviews(response.data);
    } catch (err) {
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '#10b981';
      case 'negative':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😞';
      default:
        return '😐';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true;
    return review.sentiment === filter;
  });

  const sentimentCounts = {
    all: reviews.length,
    positive: reviews.filter(r => r.sentiment === 'positive').length,
    negative: reviews.filter(r => r.sentiment === 'negative').length,
    neutral: reviews.filter(r => r.sentiment === 'neutral').length,
  };

  if (loading) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}>⏳</div>
            <div style={styles.loadingText}>Loading review...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>❌</div>
            <div style={styles.errorText}>{error}</div>
            <button onClick={fetchReviews} style={styles.retryButton}>
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.container}>
          <div style={styles.emptyContainer}>
            <div style={styles.emptyIcon}>📭</div>
            <div style={styles.emptyTitle}>Belum di review</div>
            <div style={styles.emptyText}>
              Analisis product
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>📚 Riwayat</h2>
          <div style={styles.totalCount}>
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </div>
        </div>

        <div style={styles.filterContainer}>
          <button
            onClick={() => setFilter('all')}
            style={{
              ...styles.filterButton,
              ...(filter === 'all' ? styles.filterButtonActive : {}),
            }}
          >
            All ({sentimentCounts.all})
          </button>
          <button
            onClick={() => setFilter('positive')}
            style={{
              ...styles.filterButton,
              ...(filter === 'positive' ? {
                ...styles.filterButtonActive,
                backgroundColor: '#d1fae5',
                borderColor: '#10b981',
                color: '#065f46',
              } : {}),
            }}
          >
            😊 Positive ({sentimentCounts.positive})
          </button>
          <button
            onClick={() => setFilter('negative')}
            style={{
              ...styles.filterButton,
              ...(filter === 'negative' ? {
                ...styles.filterButtonActive,
                backgroundColor: '#fee2e2',
                borderColor: '#ef4444',
                color: '#991b1b',
              } : {}),
            }}
          >
            😞 Negative ({sentimentCounts.negative})
          </button>
          <button
            onClick={() => setFilter('neutral')}
            style={{
              ...styles.filterButton,
              ...(filter === 'neutral' ? {
                ...styles.filterButtonActive,
                backgroundColor: '#f3f4f6',
                borderColor: '#6b7280',
                color: '#374151',
              } : {}),
            }}
          >
            😐 Neutral ({sentimentCounts.neutral})
          </button>
        </div>

        <div style={styles.reviewsGrid}>
          {filteredReviews.map((review, index) => (
            <div 
              key={review.id} 
              style={{
                ...styles.reviewCard,
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              <div style={styles.cardTop}>
                {review.product_name && (
                  <div style={styles.productBadge}>
                    <span style={styles.productIcon}>📦</span>
                    <span style={styles.productName}>{review.product_name}</span>
                  </div>
                )}
                
                <div style={styles.sentimentBadgeContainer}>
                  <span style={styles.sentimentEmoji}>
                    {getSentimentIcon(review.sentiment)}
                  </span>
                  <span 
                    style={{
                      ...styles.sentimentBadge,
                      backgroundColor: getSentimentColor(review.sentiment)
                    }}
                  >
                    {review.sentiment.toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={styles.dateSection}>
                <span style={styles.dateIcon}>🕐</span>
                <span style={styles.dateText}>
                  {formatDate(review.created_at)}
                </span>
              </div>

              <div style={styles.reviewContent}>
                <div style={styles.reviewLabel}>Review:</div>
                <p style={styles.reviewText}>
                  {review.review_text}
                </p>
              </div>

              <div style={styles.scoreSection}>
                <div style={styles.scoreLabel}>Confidence Score</div>
                <div style={styles.scoreBarContainer}>
                  <div 
                    style={{
                      ...styles.scoreBar,
                      width: `${review.sentiment_score * 100}%`,
                      backgroundColor: getSentimentColor(review.sentiment)
                    }}
                  />
                </div>
                <div style={styles.scoreValue}>
                  {(review.sentiment_score * 100).toFixed(1)}%
                </div>
              </div>

              {review.key_points && (
                <div style={styles.keyPointsSection}>
                  <div style={styles.keyPointsHeader}>
                    <span style={styles.keyPointsIcon}>💡</span>
                    <span style={styles.keyPointsLabel}>Key Insights</span>
                  </div>
                  <div style={styles.keyPointsText}>
                    {review.key_points}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '50vh',
    backgroundColor: '#f3f4f6',
    padding: '60px 20px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  totalCount: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    border: '2px solid #e5e7eb',
  },
  filterContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterButton: {
    padding: '10px 20px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: 'white',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    color: '#4b5563',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
    color: 'white',
    transform: 'scale(1.05)',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  loadingSpinner: {
    fontSize: '48px',
    marginBottom: '20px',
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '18px',
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  errorText: {
    fontSize: '18px',
    color: '#dc2626',
    marginBottom: '25px',
    fontWeight: '500',
  },
  retryButton: {
    padding: '12px 30px',
    fontSize: '16px',
    fontWeight: '600',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '12px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
  },
  reviewsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '25px',
  },
  reviewCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s',
    border: '1px solid #e5e7eb',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
    gap: '15px',
    flexWrap: 'wrap',
  },
  productBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    backgroundColor: '#dbeafe',
    borderRadius: '10px',
    border: '2px solid #93c5fd',
  },
  productIcon: {
    fontSize: '16px',
  },
  productName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1e40af',
  },
  sentimentBadgeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  sentimentEmoji: {
    fontSize: '24px',
  },
  sentimentBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '12px',
  },
  dateSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '18px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e5e7eb',
  },
  dateIcon: {
    fontSize: '16px',
  },
  dateText: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
  },
  reviewContent: {
    marginBottom: '18px',
  },
  reviewLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  reviewText: {
    color: '#374151',
    lineHeight: '1.7',
    fontSize: '15px',
    margin: 0,
  },
  scoreSection: {
    marginBottom: '18px',
    padding: '15px',
    backgroundColor: '#f9fafb',
    borderRadius: '10px',
  },
  scoreLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  scoreBarContainer: {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  scoreBar: {
    height: '100%',
    transition: 'width 1s ease-out',
    borderRadius: '10px',
  },
  scoreValue: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'right',
  },
  keyPointsSection: {
    paddingTop: '18px',
    borderTop: '1px solid #e5e7eb',
  },
  keyPointsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  keyPointsIcon: {
    fontSize: '18px',
  },
  keyPointsLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1f2937',
  },
  keyPointsText: {
    fontSize: '14px',
    color: '#4b5563',
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    whiteSpace: 'pre-line',
    lineHeight: '1.6',
    border: '1px solid #e5e7eb',
  },
};

export default ReviewList;