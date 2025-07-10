import { useState } from 'react';
import './UrlShortener.css';

interface UrlShortenerProps {
  onUrlShortened: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  token: string;
}

export default function UrlShortener({ onUrlShortened, isLoading, setIsLoading, token }: UrlShortenerProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [recentlyShortened, setRecentlyShortened] = useState<string | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl || !token) return;

    setIsLoading(true);
    setRecentlyShortened(null);

    try {
      const requestBody: { originalUrl: string; password?: string } = { originalUrl };
      
      // Add password if protection is enabled
      if (isPasswordProtected && password) {
        requestBody.password = password;
      }

      const response = await fetch(`${process.env.BACKEND_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        setOriginalUrl('');
        setPassword('');
        setIsPasswordProtected(false);
        setRecentlyShortened(data.shortUrl);
        onUrlShortened();
        
        setTimeout(() => {
          setRecentlyShortened(null);
        }, 5000);
      } else {
        const error = await response.json();
        console.error('Error shortening URL:', error);
      }
    } catch (error) {
      console.error('Error shortening URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="url-shortener">
      <div className="shortener-header">
        <h2>Create Short Link</h2>
        <p>Transform your long URLs into short, shareable links</p>
      </div>
      
      <form onSubmit={handleSubmit} className="shortener-form">
        <div className="input-container">
          <div className="input-wrapper">
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/your-very-long-url"
              required
              className="url-input"
            />
            <button type="submit" disabled={isLoading || !originalUrl} className="shorten-btn">
              {isLoading ? (
                <div className="loading-spinner" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Shorten
                </>
              )}
            </button>
          </div>
        </div>

        {/* Password Protection Section */}
        <div className="password-section">
          <div className="password-toggle">
            <label className="toggle-container">
              <input
                type="checkbox"
                checked={isPasswordProtected}
                onChange={(e) => setIsPasswordProtected(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Password Protection
              </span>
            </label>
          </div>
          
          {isPasswordProtected && (
            <div className="password-input-container">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password to protect this link"
                className="password-input"
                required={isPasswordProtected}
              />
              <div className="password-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Users will need this password to access the link
              </div>
            </div>
          )}
        </div>
      </form>
      
      {recentlyShortened && (
        <div className="success-message">
          <div className="success-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="success-content">
            <h3>URL Shortened Successfully!</h3>
            <div className="shortened-url-container">
              <div className="shortened-url">{recentlyShortened}</div>
              <button 
                onClick={() => copyToClipboard(recentlyShortened)}
                className="copy-success-btn"
                title="Copy to clipboard"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 