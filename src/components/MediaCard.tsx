import { useState, useEffect } from 'react';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail: string;
  platform: string;
  extracted: boolean;
}

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onDownload: (item: MediaItem) => void;
}

const MediaCard = ({ item, index, onDownload }: MediaCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (isVisible && scanProgress < 100) {
      const interval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 10, 100));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isVisible, scanProgress]);

  return (
    <div
      className={`media-card ${isVisible ? 'visible' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="card-frame">
        <div className="corner tl"></div>
        <div className="corner tr"></div>
        <div className="corner bl"></div>
        <div className="corner br"></div>

        <div className="thumbnail-container">
          <img
            src={item.thumbnail}
            alt={`Extracted ${item.type}`}
            className="thumbnail"
          />

          <div className={`scan-overlay ${scanProgress < 100 ? 'scanning' : ''}`}>
            <div
              className="scan-line"
              style={{ top: `${scanProgress}%` }}
            ></div>
          </div>

          <div className={`media-overlay ${isHovered ? 'visible' : ''}`}>
            <button
              className="download-btn"
              onClick={() => onDownload(item)}
            >
              <span className="download-icon">⬇</span>
              <span>DOWNLOAD</span>
            </button>
          </div>

          <div className="type-badge">
            {item.type === 'video' ? '▶ VIDEO' : '◻ IMAGE'}
          </div>
        </div>

        <div className="card-info">
          <div className="info-row">
            <span className="info-label">PLATFORM:</span>
            <span className="info-value">{item.platform}</span>
          </div>
          <div className="info-row">
            <span className="info-label">STATUS:</span>
            <span className="info-value status-success">EXTRACTED</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
