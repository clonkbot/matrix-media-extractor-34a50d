import { useState, useEffect, useCallback, useRef } from 'react';
import MatrixRain from './components/MatrixRain';
import LinkInput from './components/LinkInput';
import MediaCard from './components/MediaCard';
import ScanLines from './components/ScanLines';
import './styles.css';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail: string;
  platform: string;
  extracted: boolean;
}

const SAMPLE_MEDIA: MediaItem[] = [
  { id: '1', url: '', type: 'image', thumbnail: 'https://picsum.photos/seed/matrix1/400/300', platform: 'Instagram', extracted: false },
  { id: '2', url: '', type: 'video', thumbnail: 'https://picsum.photos/seed/matrix2/400/300', platform: 'TikTok', extracted: false },
  { id: '3', url: '', type: 'image', thumbnail: 'https://picsum.photos/seed/matrix3/400/300', platform: 'Twitter', extracted: false },
  { id: '4', url: '', type: 'image', thumbnail: 'https://picsum.photos/seed/matrix4/400/300', platform: 'Facebook', extracted: false },
];

function App() {
  const [mode, setMode] = useState<'single' | 'multiple'>('single');
  const [singleLink, setSingleLink] = useState('');
  const [multipleLinks, setMultipleLinks] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedMedia, setExtractedMedia] = useState<MediaItem[]>([]);
  const [glitchText, setGlitchText] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const triggerGlitch = useCallback(() => {
    setGlitchText(true);
    setTimeout(() => setGlitchText(false), 200);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [triggerGlitch]);

  const handleExtract = async () => {
    const links = mode === 'single'
      ? [singleLink].filter(l => l.trim())
      : multipleLinks.split('\n').filter(l => l.trim());

    if (links.length === 0) return;

    setIsExtracting(true);
    setExtractedMedia([]);

    // Simulate extraction with staggered reveals
    for (let i = 0; i < Math.min(links.length, 4); i++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setExtractedMedia(prev => [...prev, {
        ...SAMPLE_MEDIA[i % SAMPLE_MEDIA.length],
        id: `${Date.now()}-${i}`,
        extracted: true
      }]);
    }

    setIsExtracting(false);
  };

  const handleDownload = (item: MediaItem) => {
    // Simulate download
    const link = document.createElement('a');
    link.href = item.thumbnail;
    link.download = `matrix-extract-${item.id}.jpg`;
    link.click();
  };

  const handleDownloadAll = () => {
    extractedMedia.forEach((item, index) => {
      setTimeout(() => handleDownload(item), index * 200);
    });
  };

  return (
    <div className="app-container">
      <MatrixRain />
      <ScanLines />

      <div className="content-wrapper">
        <header className="header">
          <div className="logo-section">
            <div className="matrix-symbol">⬡</div>
            <h1
              ref={titleRef}
              className={`main-title ${glitchText ? 'glitch' : ''}`}
              data-text="MEDIA_EXTRACTOR"
            >
              MEDIA_EXTRACTOR
            </h1>
          </div>
          <p className="tagline">
            <span className="bracket">[</span>
            <span className="typing-text">EXTRACT // DOWNLOAD // LIBERATE</span>
            <span className="bracket">]</span>
          </p>
        </header>

        <main className="main-content">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="terminal-title">neo@matrix:~/extractor</span>
            </div>

            <div className="terminal-body">
              <div className="mode-toggle">
                <button
                  className={`mode-btn ${mode === 'single' ? 'active' : ''}`}
                  onClick={() => setMode('single')}
                >
                  <span className="mode-icon">◉</span> SINGLE_LINK
                </button>
                <button
                  className={`mode-btn ${mode === 'multiple' ? 'active' : ''}`}
                  onClick={() => setMode('multiple')}
                >
                  <span className="mode-icon">◎</span> BATCH_MODE
                </button>
              </div>

              <LinkInput
                mode={mode}
                singleLink={singleLink}
                multipleLinks={multipleLinks}
                onSingleLinkChange={setSingleLink}
                onMultipleLinkChange={setMultipleLinks}
              />

              <button
                className={`extract-btn ${isExtracting ? 'extracting' : ''}`}
                onClick={handleExtract}
                disabled={isExtracting}
              >
                {isExtracting ? (
                  <>
                    <span className="spinner"></span>
                    <span>EXTRACTING_DATA...</span>
                  </>
                ) : (
                  <>
                    <span className="extract-icon">⟁</span>
                    <span>INITIATE_EXTRACTION</span>
                  </>
                )}
              </button>

              {isExtracting && (
                <div className="extraction-log">
                  <div className="log-line">
                    <span className="log-prefix">&gt;</span> Establishing connection...
                  </div>
                  <div className="log-line delay-1">
                    <span className="log-prefix">&gt;</span> Bypassing security protocols...
                  </div>
                  <div className="log-line delay-2">
                    <span className="log-prefix">&gt;</span> Extracting media assets...
                  </div>
                </div>
              )}
            </div>
          </div>

          {extractedMedia.length > 0 && (
            <div className="results-section">
              <div className="results-header">
                <h2 className="results-title">
                  <span className="flash">▶</span> EXTRACTED_MEDIA
                  <span className="count">[{extractedMedia.length}]</span>
                </h2>
                <button className="download-all-btn" onClick={handleDownloadAll}>
                  <span>⬇</span> DOWNLOAD_ALL
                </button>
              </div>

              <div className="media-grid">
                {extractedMedia.map((item, index) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    index={index}
                    onDownload={handleDownload}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="footer-line"></div>
          <p className="footer-text">
            Requested by <span className="credit">@_knone_</span> · Built by <span className="credit">@clonkbot</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
