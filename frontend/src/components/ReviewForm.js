// ReviewForm.js

import React, { useState } from 'react';
import axios from 'axios';

function ReviewForm({ onReviewAnalyzed }) {
  const [productName, setProductName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (reviewText.trim().length < 10) {
      setError('Minimal review harus 10 karakter');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-review', {
        product_name: productName.trim(),
        review_text: reviewText
      });

      setResult(response.data);
      setProductName('');
      setReviewText('');
      
      if (onReviewAnalyzed) {
        onReviewAnalyzed(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Analisis gagal. Silakan coba lagi.');
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

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>Product Review Analyzer</h1>
          <p style={styles.subtitle}>Analisis sentimen dan key insights dari produk yang d review</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Nama Produk 
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g., iPhone 15 Pro, Nike Air Max..."
              style={styles.input}
              disabled={loading}
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Review Anda <span style={styles.required}>*</span>
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Bagikan pendapat kamu tentang produk (minimal 10 karakter)"
              style={styles.textarea}
              rows="5"
              disabled={loading}
            />
            <div style={styles.charCount}>
              {reviewText.length} karakter
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || reviewText.trim().length < 10}
            style={{
              ...styles.button,
              opacity: (loading || reviewText.trim().length < 10) ? 0.6 : 1,
              cursor: (loading || reviewText.trim().length < 10) ? 'not-allowed' : 'pointer',
              transform: loading ? 'scale(0.98)' : 'scale(1)',
            }}
          >
            {loading ? (
              <span>
                <span style={styles.spinner}>⏳</span> Analisis...
              </span>
            ) : (
              <span>🔍 Review Analisis</span>
            )}
          </button>
        </form>

        {error && (
          <div style={styles.errorBox}>
            <div style={styles.errorIcon}>⚠️</div>
            <div>
              <div style={styles.errorTitle}>Error</div>
              <div style={styles.errorMessage}>{error}</div>
            </div>
          </div>
        )}

        {result && (
          <div style={styles.resultContainer}>
            <div style={styles.resultHeader}>
              <h3 style={styles.resultTitle}>✨ Analisis selesai!</h3>
            </div>
            
            <div style={styles.resultCard}>
              {result.product_name && (
                <div style={styles.productSection}>
                  <div style={styles.productBadge}>
                    <span style={styles.productIcon}>📦</span>
                    <span style={styles.productText}>{result.product_name}</span>
                  </div>
                </div>
              )}
              
              <div style={styles.sentimentContainer}>
                <div style={styles.sentimentLeft}>
                  <div style={styles.sentimentLabel}>Analisis Sentimen</div>
                  <div style={styles.sentimentBadgeWrapper}>
                    <span style={styles.sentimentEmoji}>
                      {getSentimentIcon(result.sentiment)}
                    </span>
                    <span 
                      style={{
                        ...styles.sentimentBadge,
                        backgroundColor: getSentimentColor(result.sentiment)
                      }}
                    >
                      {result.sentiment.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div style={styles.sentimentRight}>
                  <div style={styles.scoreLabel}>Confidence Score</div>
                  <div style={styles.scoreValue}>
                    {(result.sentiment_score * 100).toFixed(1)}%
                  </div>
                  <div style={styles.scoreBar}>
                    <div 
                      style={{
                        ...styles.scoreBarFill,
                        width: `${result.sentiment_score * 100}%`,
                        backgroundColor: getSentimentColor(result.sentiment)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.divider} />

              <div style={styles.keyPointsContainer}>
                <div style={styles.keyPointsHeader}>
                  <span style={styles.keyPointsIcon}>💡</span>
                  <h4 style={styles.keyPointsTitle}>Key Insights</h4>
                </div>
                <div style={styles.keyPointsContent}>
                  {result.key_points}
                </div>
              </div>

              <div style={styles.divider} />

              <div style={styles.originalSection}>
                <div style={styles.originalLabel}>📝 Original Review</div>
                <p style={styles.originalText}>{result.review_text}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  mainTitle: {
    fontSize: '42px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '12px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  subtitle: {
    fontSize: '18px',
    color: 'rgba(255,255,255,0.9)',
    margin: 0,
  },
  form: {
    backgroundColor: 'white',
    padding: '35px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    marginBottom: '30px',
  },
  formGroup: {
    marginBottom: '25px',
  },
  label: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '8px',
  },
  optional: {
    color: '#9ca3af',
    fontWeight: '400',
    fontSize: '13px',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '2px solid #e5e7eb',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '2px solid #e5e7eb',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'all 0.2s',
    outline: 'none',
    lineHeight: '1.6',
  },
  charCount: {
    textAlign: 'right',
    fontSize: '13px',
    color: '#9ca3af',
    marginTop: '6px',
  },
  button: {
    width: '100%',
    padding: '16px 24px',
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: 'none',
    borderRadius: '12px',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  spinner: {
    display: 'inline-block',
    animation: 'spin 1s linear infinite',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    padding: '20px',
    backgroundColor: '#fee2e2',
    border: '2px solid #fecaca',
    borderRadius: '12px',
    marginBottom: '25px',
  },
  errorIcon: {
    fontSize: '24px',
    flexShrink: 0,
  },
  errorTitle: {
    fontWeight: '700',
    color: '#991b1b',
    marginBottom: '4px',
    fontSize: '16px',
  },
  errorMessage: {
    color: '#dc2626',
    fontSize: '14px',
  },
  resultContainer: {
    animation: 'slideIn 0.5s ease-out',
  },
  resultHeader: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  resultTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    margin: 0,
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
  },
  resultCard: {
    backgroundColor: 'white',
    padding: '35px',
    borderRadius: '16px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  productSection: {
    marginBottom: '25px',
  },
  productBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    backgroundColor: '#dbeafe',
    borderRadius: '12px',
    border: '2px solid #93c5fd',
  },
  productIcon: {
    fontSize: '20px',
  },
  productText: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e40af',
  },
  sentimentContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '25px',
  },
  sentimentLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sentimentLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  sentimentBadgeWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sentimentEmoji: {
    fontSize: '32px',
  },
  sentimentBadge: {
    padding: '10px 20px',
    borderRadius: '25px',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  sentimentRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  scoreLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scoreBar: {
    width: '100%',
    height: '10px',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    transition: 'width 1s ease-out',
    borderRadius: '10px',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '25px 0',
  },
  keyPointsContainer: {
    marginBottom: '25px',
  },
  keyPointsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  keyPointsIcon: {
    fontSize: '24px',
  },
  keyPointsTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  keyPointsContent: {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    whiteSpace: 'pre-line',
    lineHeight: '1.8',
    fontSize: '15px',
    color: '#374151',
  },
  originalSection: {
    backgroundColor: '#f3f4f6',
    padding: '20px',
    borderRadius: '12px',
  },
  originalLabel: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: '12px',
  },
  originalText: {
    margin: 0,
    color: '#6b7280',
    lineHeight: '1.7',
    fontSize: '15px',
  },
};

export default ReviewForm;