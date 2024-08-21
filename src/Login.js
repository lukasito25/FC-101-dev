import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (username === 'LUHO' && password === 'passwordLESS') {
        onLogin();
      } else {
        setError('Invalid username or password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={styles.container}>
      <div style={styles.background}></div>
      <div style={styles.loginBox}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Please sign in to your account</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Enter your username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            {loading ? (
              <span style={styles.loadingSpinner}></span>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p style={styles.forgotPassword}>
          <a href="#" style={styles.forgotPasswordLink}>
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    overflow: 'hidden',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(/src/assets/images/background-image.jpeg)', // Ensure the correct path to your image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
    zIndex: 1,
    animation: 'zoomInFade 10s infinite alternate',
  },
  loginBox: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white background
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 6px 30px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    animation: 'slideInBounce 1s ease-in-out',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '10px',
    color: '#333',
    fontFamily: 'San Francisco, Arial, sans-serif',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px',
    fontFamily: 'San Francisco, Arial, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: '#555',
    fontFamily: 'San Francisco, Arial, sans-serif',
  },
  input: {
    padding: '14px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    width: '100%',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.3s',
    fontFamily: 'San Francisco, Arial, sans-serif',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)',
  },
  inputFocus: {
    borderColor: '#000',
    boxShadow: '0 0 0 4px rgba(0, 0, 0, 0.1)',
    transform: 'scale(1.05)',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    backgroundColor: '#000',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s, transform 0.3s',
    fontFamily: 'San Francisco, Arial, sans-serif',
    transform: 'scale(1)',
  },
  buttonHover: {
    backgroundColor: '#333',
    transform: 'scale(1.05)',
  },
  loadingSpinner: {
    width: '16px',
    height: '16px',
    border: '3px solid #fff',
    borderRadius: '50%',
    borderTop: '3px solid #000',
    animation: 'spin 1s linear infinite',
  },
  error: {
    color: '#ff4d4f',
    fontSize: '14px',
    marginBottom: '20px',
    fontFamily: 'San Francisco, Arial, sans-serif',
  },
  forgotPassword: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  forgotPasswordLink: {
    color: '#1890ff',
    textDecoration: 'none',
    transition: 'color 0.3s',
  },
  '@keyframes slideInBounce': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-100px)',
    },
    '60%': {
      opacity: 1,
      transform: 'translateY(20px)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
  '@keyframes zoomInFade': {
    '0%': {
      transform: 'scale(1)',
      opacity: 0.7,
    },
    '100%': {
      transform: 'scale(1.1)',
      opacity: 1,
    },
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
};

export default Login;




