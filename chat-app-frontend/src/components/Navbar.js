import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navigation-bar">
      <div className="nav-items">
        <Link to="/" className="chat-app-name">Nxt-Chat</Link>
        {user && (
          <button onClick={handleLogout} className="log-out-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};
export default Navbar;