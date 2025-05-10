import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [allUsernames, setAllUsernames] = useState([]);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = () => {
      const user = sessionStorage.getItem('user');
      if (user) {
        navigate('/');
      }
    };
    
    // Fetch all usernames for signup validation
    const fetchUsernames = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        const data = await response.json();
        setAllUsernames(data.map(user => user.username));
      } catch (err) {
        console.error('Error fetching usernames:', err);
      }
    };

    checkAuth();
    fetchUsernames();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateUsername = (username) => {
    // Must contain lowercase letters and at least one number
    return /^(?=.*[a-z])(?=.*\d).+$/.test(username);
  };

  const validatePassword = (password) => {
    // At least 6 chars with one letter and one number
    return /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login logic
      try {
        const response = await fetch('http://localhost:5000/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const data = await response.json();
        
        if (data.message === 'Login successful!') {
          sessionStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        } else {
          setError(data.message || 'Login failed');
        }
      } catch (err) {
        setError('An error occurred during login');
      }
    } else {
      // Signup logic
      if (!validateUsername(formData.username)) {
        setError('Username must contain lowercase letters and at least one number');
        return;
      }

      if (allUsernames.includes(formData.username)) {
        setError('Username already exists');
        return;
      }

      if (!validatePassword(formData.password)) {
        setError('Password must be at least 6 characters with at least one letter and one number');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password,
            email: formData.email,
            role: 'User',
            statusID: 1
          })
        });

        const data = await response.json();
        
        if (data.success) {
          sessionStorage.setItem('user', JSON.stringify(data.user));
          navigate('/');
        } else {
          setError(data.message || 'Registration failed');
        }
      } catch (err) {
        setError('An error occurred during registration');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          )}
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="auth-toggle">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span onClick={() => setIsLogin(false)}>Sign Up</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}