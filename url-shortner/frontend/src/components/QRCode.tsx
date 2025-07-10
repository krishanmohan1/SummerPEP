import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import './QRCode.css';

interface QRCodeProps {
  value: string;
  size?: number;
  showModal?: boolean;
  onClose?: () => void;
}

export default function QRCodeComponent({ 
  value, 
  size = 128, 
  showModal = false, 
  onClose 
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQRCode = async () => {
      if (!canvasRef.current) return;
      
      setIsGenerating(true);
      setError(null);

      try {
        await QRCode.toCanvas(canvasRef.current, value, {
          width: size,
          margin: 2,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff'
          }
        });
      } catch (err) {
        console.error('Error generating QR code:', err);
        setError('Failed to generate QR code');
      } finally {
        setIsGenerating(false);
      }
    };

    generateQRCode();
  }, [value, size]);

  const downloadQRCode = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  if (showModal) {
    return (
      <div className="qr-modal-overlay" onClick={onClose}>
        <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
          <div className="qr-modal-header">
            <h3>QR Code</h3>
            <button className="close-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <div className="qr-modal-content">
            <div className="qr-canvas-container">
              {isGenerating && <div className="qr-loading">Generating QR code...</div>}
              {error && <div className="qr-error">{error}</div>}
              <canvas ref={canvasRef} className="qr-canvas" />
            </div>
            <div className="qr-url-display">
              <p>Scan to visit: <strong>{value}</strong></p>
            </div>
            <div className="qr-actions">
              <button onClick={downloadQRCode} className="download-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-code-container">
      {isGenerating && <div className="qr-loading-small">Loading...</div>}
      {error && <div className="qr-error-small">{error}</div>}
      <canvas ref={canvasRef} className="qr-canvas-small" />
    </div>
  );
} 