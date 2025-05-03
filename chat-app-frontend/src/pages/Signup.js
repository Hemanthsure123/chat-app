import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

import "./Login.css"

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(email, password);
      toast.success('Signed up successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Signup failed');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-heading">Signup</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <div className='email-input'>
          <label className="email-text">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full rounded"
            required
            placeholder='Enter email...'
          />
        </div>
        <div className='email-input' > 
          <label className="email-text">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
            placeholder='Enter password...'
          />
        </div>
        <button type="submit" className="login-button">
          Signup
        </button>
      </form>
    </div>
  );
};
export default Signup;