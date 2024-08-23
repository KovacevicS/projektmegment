import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div>
      <main>
        <p>This is the home page of my application.</p>
        <Link to="/signup">
          <button>Sign Up</button>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
