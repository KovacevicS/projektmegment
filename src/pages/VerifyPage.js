import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/verify/${token}`);
        alert(response.data.message);
        navigate('/login');
      } catch (error) {
        console.error('Error verifying user:', error);
        alert('Verifikacija nije uspela.');
      }
    };

    verifyUser();
  }, [token, navigate]);

  return (
    <div>
      <h2>Verifikacija naloga</h2>
      <p>Molimo sačekajte dok se vaš nalog verifikuje...</p>
    </div>
  );
};

export default VerifyPage;
