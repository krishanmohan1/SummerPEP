import { useMemo } from 'react';
import './Analytics.css';

interface Url {
  _id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

interface AnalyticsProps {
  urls: Url[];
}

export default function Analytics({ urls }: AnalyticsProps) {
  const analytics = useMemo(() => {
    const totalUrls = urls.length;
    const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
    const avgClicksPerUrl = totalUrls > 0 ? (totalClicks / totalUrls).toFixed(1) : '0';
    
    const mostClickedUrl = urls.reduce((max, url) => 
      url.clicks > max.clicks ? url : max, 
      { clicks: 0, originalUrl: '', shortUrl: '' }
    );
    
    const recentUrls = urls
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);
    
    const topUrls = urls
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5);
    
    const clickDistribution = urls.map(url => ({
      shortUrl: url.shortUrl,
      clicks: url.clicks,
      percentage: totalClicks > 0 ? (url.clicks / totalClicks) * 100 : 0
    })).filter(item => item.clicks > 0);
    
    return {
      totalUrls,
      totalClicks,
      avgClicksPerUrl,
      mostClickedUrl,
      recentUrls,
      topUrls,
      clickDistribution
    };
  }, [urls]);

  const formatUrl = (url: string) => {
    if (url.length > 30) {
      return url.substring(0, 30) + '...';
    }
    return url;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <p>Track your URL performance and engagement metrics</p>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{analytics.totalUrls}</div>
            <div className="stat-label">Total URLs</div>
          </div>
        </div>
        
        <div className="stat-card secondary">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{analytics.totalClicks}</div>
            <div className="stat-label">Total Clicks</div>
          </div>
        </div>
        
        <div className="stat-card success">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{analytics.avgClicksPerUrl}</div>
            <div className="stat-label">Avg. Clicks/URL</div>
          </div>
        </div>
        
        <div className="stat-card warning">
          <div className="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{analytics.mostClickedUrl.clicks}</div>
            <div className="stat-label">Best Performer</div>
          </div>
        </div>
      </div>
      
      <div className="analytics-content">
        <div className="analytics-section">
          <h3>Top Performing URLs</h3>
          <div className="top-urls">
            {analytics.topUrls.length > 0 ? (
              analytics.topUrls.map((url, index) => (
                <div key={url._id} className="top-url-item">
                  <div className="url-rank">#{index + 1}</div>
                  <div className="url-info">
                    <div className="url-title">{formatUrl(url.originalUrl)}</div>
                    <div className="url-short">/{url.shortUrl}</div>
                  </div>
                  <div className="url-clicks">
                    <span className="clicks-number">{url.clicks}</span>
                    <span className="clicks-label">clicks</span>
                  </div>
                </div>
              ))
            ) : (
                             <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p>No click data available yet</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="analytics-section">
          <h3>Recent Activity</h3>
          <div className="recent-activity">
            {analytics.recentUrls.length > 0 ? (
              analytics.recentUrls.map((url) => (
                <div key={url._id} className="activity-item">
                                   <div className="activity-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                  <div className="activity-content">
                    <div className="activity-title">{formatUrl(url.originalUrl)}</div>
                    <div className="activity-time">{formatDate(url.createdAt)}</div>
                  </div>
                  <div className="activity-clicks">{url.clicks} clicks</div>
                </div>
              ))
            ) : (
                             <div className="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {analytics.clickDistribution.length > 0 && (
        <div className="analytics-section">
          <h3>Click Distribution</h3>
          <div className="click-chart">
            {analytics.clickDistribution.slice(0, 10).map((item, index) => (
              <div key={item.shortUrl} className="chart-bar">
                <div className="bar-info">
                  <span className="bar-label">/{item.shortUrl}</span>
                  <span className="bar-value">{item.clicks}</span>
                </div>
                <div className="bar-container">
                  <div 
                    className="bar-fill" 
                    style={{ 
                      width: `${Math.max(item.percentage, 5)}%`,
                      backgroundColor: `hsl(${220 + index * 20}, 70%, 50%)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 