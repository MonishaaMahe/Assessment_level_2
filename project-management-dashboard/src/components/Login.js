import React, { useState } from 'react';

function Login({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const loginData = isSignUp ? formData : { username: formData.username, password: formData.password };
      
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        if (isSignUp) {
          setError('');
          setIsSignUp(false);
          setFormData({ username: '', password: '', email: '', fullName: '', role: '' });
          alert('Registration successful! Please login.');
        } else {
          const data = await response.json();
          localStorage.setItem('token', data.token);
          localStorage.setItem('username', data.username);
          localStorage.setItem('fullName', data.fullName);
          localStorage.setItem('userRole', data.role || 'Admin');
          onLogin(data);
        }
      } else {
        setError(isSignUp ? 'Registration failed' : 'Invalid username or password');
      }
    } catch (error) {
      setError(isSignUp ? 'Registration failed. Please try again.' : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="card" style={{ width: '400px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '2rem', color: '#2d3748' }}>
          {isSignUp ? 'Sign Up' : 'Project Management Dashboard'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </>
          )}
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          {isSignUp && (
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="Developer">Developer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Designer">Designer</option>
                <option value="Tester">Tester</option>
              </select>
            </div>
          )}
          
          {error && (
            <div style={{ color: '#e74c3c', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setFormData({ username: '', password: '', email: '', fullName: '', role: '' });
            }}
            style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer' }}
          >
            {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
          </button>
        </div>
        

      </div>
    </div>
  );
}

export default Login;