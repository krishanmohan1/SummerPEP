import { useEffect, useState } from 'react';
import PasswordModal from './PasswordModal';
import './UrlAccess.css';


interface UrlAccessProps {
  shortUrl: string;
}

export default function UrlAccess({ shortUrl }: UrlAccessProps) {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shortUrl) {
      handleUrlAccess(shortUrl);
    }
  }, [shortUrl]);

  const handleUrlAccess = async (shortUrl: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.BACKEND_URL}/api/${shortUrl}`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.requiresPassword) {
          setIsPasswordModalOpen(true);
          setIsLoading(false);
        } else {
          // This shouldn't happen since the backend should redirect, but just in case
          window.location.href = data.originalUrl;
        }
      } else {
        setError('URL not found');
        setIsLoading(false);
      }
         } catch {
       setError('Failed to access URL');
       setIsLoading(false);
     }
  };

  const handlePasswordSuccess = (originalUrl: string) => {
    setIsPasswordModalOpen(false);
    window.location.href = originalUrl;
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    // Redirect to home page or show a message
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="url-access-container">
        <div className="url-access-loading">
          <div className="loading-spinner-large"></div>
          <h2>Accessing URL...</h2>
          <p>Please wait while we process your request</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="url-access-container">
        <div className="url-access-error">
          <div className="error-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <h2>URL Not Found</h2>
          <p>{error}</p>
          <button onClick={() => window.location.href = '/'} className="home-btn">
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="url-access-container">
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={handlePasswordModalClose}
        shortUrl={shortUrl || ''}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
} 