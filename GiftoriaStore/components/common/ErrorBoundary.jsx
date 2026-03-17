"use client";
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Auto-reload on ChunkLoadError (stale cache / first-load chunk not found)
    if (
      typeof window !== 'undefined' &&
      error &&
      (error.name === 'ChunkLoadError' || (error.message && error.message.includes('Loading chunk')))
    ) {
      // Prevent infinite reload loop using sessionStorage
      const reloadKey = 'chunk_error_reloaded';
      if (!sessionStorage.getItem(reloadKey)) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
        return;
      }
    }

    if (typeof window !== 'undefined') {
      console.error('🚨 ERROR BOUNDARY CAUGHT ERROR:');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo?.componentStack || 'No component stack');
    }

    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (!this.state.hasError && typeof window !== 'undefined') {
      sessionStorage.removeItem('chunk_error_reloaded');
    }

    if (this.state.hasError) {
      
      return (
        <div style={{ 
          padding: '20px', 
          border: '2px solid red', 
          backgroundColor: '#ffe6e6',
          margin: '10px',
          borderRadius: '5px'
        }}>
          <h2>🚨 Component Error Detected</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Error Details (click to expand)</summary>
            {this.state.error && this.state.error.toString()}
            <br />
            Component Stack:
            {this.state.errorInfo?.componentStack || 'No component stack available'}
          </details>
          <p>Component Name: <strong>{this.props.componentName || 'Unknown'}</strong></p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;