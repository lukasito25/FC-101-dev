import React, { useState } from 'react';
import userAvatar from './assets/images/user_avatar.png'; // Ensure the path is correct
import enFlag from './assets/images/en_flag.png'; // Add your flag image paths
import skFlag from './assets/images/sk_flag.png'; // Add your flag image paths

const Header = ({ onLanguageChange, onLogout }) => {
  const [language, setLanguage] = useState('EN');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleLanguageToggle = (lang) => {
    setLanguage(lang);
    onLanguageChange(lang); // Call the function to change the language in the parent component
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <div style={styles.header}>
      <div style={styles.languageToggle}>
        <img
          src={enFlag}
          alt="English"
          style={{
            ...styles.flag,
            opacity: language === 'EN' ? 1 : 0.5,
          }}
          onClick={() => handleLanguageToggle('EN')}
        />
        <img
          src={skFlag}
          alt="Slovak"
          style={{
            ...styles.flag,
            opacity: language === 'SK' ? 1 : 0.5,
          }}
          onClick={() => handleLanguageToggle('SK')}
        />
      </div>
      <h1 style={styles.title}>
        {language === 'EN' ? 'Training Dashboard' : 'Tréningový Dashboard'}
      </h1>
      <div style={styles.userInfo} onClick={toggleDropdown}>
        <img src={userAvatar} alt="User Avatar" style={styles.avatar} />
        <span style={styles.userName}>Lukas</span>
        {dropdownVisible && (
          <div style={styles.dropdown}>
            <button onClick={onLogout} style={styles.logoutButton}>
              {language === 'EN' ? 'Logout' : 'Odhlásiť sa'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  languageToggle: {
    display: 'flex',
    alignItems: 'center',
  },
  flag: {
    width: '30px',
    height: '20px',
    cursor: 'pointer',
    marginRight: '10px',
    transition: 'opacity 0.3s',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative', // To position the dropdown
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginRight: '10px',
    border: '1px solid #ddd',
  },
  userName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: '60px', // Position below the user info
    right: '0px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '10px',
    zIndex: 1000,
  },
  logoutButton: {
    padding: '10px 20px',
    fontSize: '14px',
    borderRadius: '4px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
  },
};

export default Header;








