import React, { useState } from 'react';
import ReviewForm from './components/ReviewForm';
import ReviewList from './components/ReviewList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewAnalyzed = () => {
    // Trigger refresh of review list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.headerTitle}>Product Review Analyzer_Aryasatya_164</h1>
        </div>
      </header>

      <main style={styles.main}>
        <ReviewForm onReviewAnalyzed={handleReviewAnalyzed} />
        <ReviewList refreshTrigger={refreshTrigger} />
      </main>

    </div>
  );
}

const styles = {
  header: {
    backgroundColor: '#1e40af',
    color: 'white',
    padding: '30px 20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  headerContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  headerTitle: {
    margin: '0 0 10px 0',
    fontSize: '36px',
    fontWeight: 'bold',
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '16px',
    opacity: 0.9,
  },
  main: {
    minHeight: 'calc(100vh - 250px)',
    paddingBottom: '40px',
  },
  footer: {
    backgroundColor: '#f3f4f6',
    padding: '20px',
    textAlign: 'center',
    marginTop: '40px',
  },
  footerText: {
    margin: 0,
    color: '#6b7280',
    fontSize: '14px',
  },
};

export default App;