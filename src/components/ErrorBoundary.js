import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Oseti grešku i ažurira stanje
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Možete logovati greške ovde
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Možete prikazati bilo koju korisnički definisanu poruku
      return <h1>Nešto je pošlo po zlu.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
