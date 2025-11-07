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
    console.error('🚨 ERROR BOUNDARY CAUGHT ERROR:');
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo?.componentStack || 'No component stack');
    console.error('Error Info:', errorInfo);
    
    // Check if it's the specific error we're looking for
    if (error.message && error.message.includes('Objects are not valid as a React child')) {
      console.error('🎯 THIS IS THE OBJECT RENDERING ERROR!');
      console.error('Component that failed:', errorInfo?.componentStack || 'Unknown component');
    }
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
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