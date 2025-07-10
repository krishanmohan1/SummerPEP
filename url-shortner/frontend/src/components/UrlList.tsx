import { useState } from 'react';
import './UrlList.css';
import QRCodeComponent from './QRCode';

interface Url {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
  isPasswordProtected: boolean;
  isActive: boolean;
  passwordAttempts: number;
}

interface UrlListProps {
  urls: Url[];
  onUrlsChange: () => void;
}

export default function UrlList({ urls, onUrlsChange }: UrlListProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [qrModalUrl, setQrModalUrl] = useState<string | null>(null);
  const [togglingUrls, setTogglingUrls] = useState<Set<string>>(new Set());
  const [resettingUrls, setResettingUrls] = useState<Set<string>>(new Set());

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`${process.env.BACKEND_URL}/${url}`);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const formatUrl = (url: string) => {
    if (url.length > 50) {
      return url.substring(0, 50) + '...';
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const toggleUrlStatus = async (urlId: string) => {
    setTogglingUrls(prev => new Set(prev).add(urlId));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.BACKEND_URL}/api/toggle/${urlId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await response.json();
        onUrlsChange(); // Refresh the URLs list
      } else {
        console.error('Failed to toggle URL status');
      }
    } catch (error) {
      console.error('Error toggling URL status:', error);
    } finally {
      setTogglingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(urlId);
        return newSet;
      });
    }
  };

  const resetPasswordAttempts = async (urlId: string) => {
    setResettingUrls(prev => new Set(prev).add(urlId));
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.BACKEND_URL}/api/reset-attempts/${urlId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await response.json();
        onUrlsChange(); // Refresh the URLs list
      } else {
        console.error('Failed to reset password attempts');
      }
    } catch (error) {
      console.error('Error resetting password attempts:', error);
    } finally {
      setResettingUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(urlId);
        return newSet;
      });
    }
  };

  return (
    <div className="url-list">
      <div className="list-header">
        <h2>Your Shortened URLs</h2>
        <div className="list-stats">
          <span className="stat-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {urls.length} URLs
          </span>
          <span className="stat-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {urls.reduce((total, url) => total + url.clicks, 0)} Clicks
          </span>
        </div>
      </div>

      <div className="urls-container">
        {urls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No URLs yet</h3>
            <p>Start by shortening your first URL above to see it here</p>
          </div>
        ) : (
          <div className="urls-grid">
            {urls.map((url) => (
              <div key={url._id} className={`url-card ${!url.isActive ? 'disabled' : ''}`}>
                <div className="url-header">
                  <div className="url-info">
                    <div className="original-url">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="9" y1="9" x2="9.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="15" y1="9" x2="15.01" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span className="url-domain">{formatUrl(url.originalUrl)}</span>
                      {url.isPasswordProtected && (
                        <div className="lock-indicator" title="Password protected">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </div>
                      )}
                      <div className={`status-indicator ${url.isActive ? 'active' : 'inactive'}`} title={url.isActive ? 'Active' : 'Disabled'}>
                        {url.isActive ? '●' : '○'}
                      </div>
                    </div>
                    <div className="url-meta">
                      <span className="url-date">{formatDate(url.createdAt)}</span>
                      {url.isPasswordProtected && url.passwordAttempts > 0 && (
                        <span className="password-attempts">
                          {url.passwordAttempts} failed attempts
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="url-stats">
                    <div className="click-count">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>{url.clicks} clicks</span>
                    </div>
                  </div>
                </div>
                
                {!url.isActive && (
                  <div className="disabled-warning">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    This link is disabled and cannot be accessed
                  </div>
                )}
                
                <div className="short-url-section">
                  <div className="short-url-container">
                    <a 
                      href={`${process.env.BACKEND_URL}/${url.shortUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="short-url-link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {
                        process.env.BACKEND_URL?.includes('localhost') ? 
                          `${process.env.BACKEND_URL?.replace('http://', '')}/${url.shortUrl}` : 
                          `${process.env.BACKEND_URL?.replace('https://', '')}/${url.shortUrl}`
                      }
                    </a>
                    <button 
                      onClick={() => copyToClipboard(url.shortUrl)}
                      className={`copy-btn ${copiedUrl === url.shortUrl ? 'copied' : ''}`}
                      title="Copy to clipboard"
                    >
                      {copiedUrl === url.shortUrl ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="20,6 9,17 4,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="short-url-actions">
                    <button 
                      onClick={() => setQrModalUrl(`${process.env.BACKEND_URL}/${url.shortUrl}`)}
                      className="qr-btn"
                      title="Generate QR Code"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                        <rect x="3" y="16" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                        <rect x="16" y="3" width="5" height="5" stroke="currentColor" strokeWidth="2"/>
                        <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
                        <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
                        <rect x="11" y="15" width="2" height="2" fill="currentColor"/>
                        <rect x="15" y="11" width="2" height="2" fill="currentColor"/>
                        <rect x="17" y="13" width="2" height="2" fill="currentColor"/>
                        <rect x="13" y="17" width="2" height="2" fill="currentColor"/>
                        <rect x="17" y="17" width="2" height="2" fill="currentColor"/>
                      </svg>
                    </button>
                    <button 
                      onClick={() => toggleUrlStatus(url._id)}
                      className={`toggle-btn ${url.isActive ? 'active' : 'inactive'}`}
                      title={url.isActive ? 'Disable Link' : 'Enable Link'}
                      disabled={togglingUrls.has(url._id)}
                    >
                      {togglingUrls.has(url._id) ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2v6m0 8v6m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : url.isActive ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 3m0 2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2"/>
                          <path d="M6 8h12l-1 13H7z" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                    {url.isPasswordProtected && url.passwordAttempts > 0 && (
                      <button 
                        onClick={() => resetPasswordAttempts(url._id)}
                        className="reset-btn"
                        title="Reset Password Attempts"
                        disabled={resettingUrls.has(url._id)}
                      >
                        {resettingUrls.has(url._id) ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2v6m0 8v6m-6-6h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {qrModalUrl && (
        <QRCodeComponent 
          value={qrModalUrl} 
          showModal={true}
          onClose={() => setQrModalUrl(null)}
        />
      )}
    </div>
  );
} 