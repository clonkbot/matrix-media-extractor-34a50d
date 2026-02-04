import { useState, useEffect } from 'react';

interface LinkInputProps {
  mode: 'single' | 'multiple';
  singleLink: string;
  multipleLinks: string;
  onSingleLinkChange: (value: string) => void;
  onMultipleLinkChange: (value: string) => void;
}

const LinkInput = ({
  mode,
  singleLink,
  multipleLinks,
  onSingleLinkChange,
  onMultipleLinkChange
}: LinkInputProps) => {
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  const detectPlatform = (url: string): string => {
    if (url.includes('instagram')) return 'INSTAGRAM';
    if (url.includes('tiktok')) return 'TIKTOK';
    if (url.includes('twitter') || url.includes('x.com')) return 'TWITTER/X';
    if (url.includes('facebook')) return 'FACEBOOK';
    if (url.includes('youtube')) return 'YOUTUBE';
    if (url.includes('reddit')) return 'REDDIT';
    return 'UNKNOWN';
  };

  const platform = mode === 'single' && singleLink ? detectPlatform(singleLink) : null;

  return (
    <div className="link-input-container">
      <div className="input-label">
        <span className="prompt">&gt;</span>
        <span className="label-text">
          {mode === 'single' ? 'PASTE_MEDIA_LINK:' : 'PASTE_MULTIPLE_LINKS:'}
        </span>
        {platform && (
          <span className="platform-badge">[{platform}]</span>
        )}
      </div>

      {mode === 'single' ? (
        <div className="input-wrapper">
          <span className="input-prefix">$</span>
          <input
            type="url"
            value={singleLink}
            onChange={(e) => onSingleLinkChange(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="link-input"
            spellCheck={false}
          />
          <span className={`cursor-blink ${cursorVisible ? 'visible' : ''}`}>_</span>
        </div>
      ) : (
        <div className="textarea-wrapper">
          <div className="line-numbers">
            {multipleLinks.split('\n').map((_, i) => (
              <span key={i} className="line-num">{String(i + 1).padStart(2, '0')}</span>
            ))}
            {multipleLinks === '' && <span className="line-num">01</span>}
          </div>
          <textarea
            value={multipleLinks}
            onChange={(e) => onMultipleLinkChange(e.target.value)}
            placeholder="// Paste one link per line&#10;https://instagram.com/p/...&#10;https://tiktok.com/@user/video/...&#10;https://twitter.com/user/status/..."
            className="link-textarea"
            spellCheck={false}
            rows={6}
          />
        </div>
      )}

      <div className="input-hints">
        <span className="hint">
          <span className="hint-icon">◈</span>
          Supported: Instagram, TikTok, Twitter/X, Facebook, YouTube, Reddit
        </span>
      </div>
    </div>
  );
};

export default LinkInput;
