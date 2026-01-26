import { useState, useCallback } from 'react';

interface ProcessedImage {
  id: string;
  originalName: string;
  processedUrl: string;
  publicId: string;
  createdAt: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

function App() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setPreviewUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE}/api/images/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to process image');
      }

      setProcessedImages((prev) => [result.data, ...prev]);
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/images/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to delete image');
      }

      setProcessedImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="app">
      <div className="background-pattern" />
      
      <header className="header">
        <h1>
          <span className="gradient-text">Image</span> Transformer
        </h1>
        <p className="subtitle">Remove background & flip horizontally</p>
      </header>

      <main className="main">
        <div
          className={`upload-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="processing-indicator">
              <div className="spinner" />
              <p>Processing your image...</p>
              <span className="processing-steps">Removing background → Flipping</span>
            </div>
          ) : (
            <>
              <div className="upload-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17,8 12,3 7,8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <p className="upload-text">
                Drag & drop your image here
              </p>
              <span className="upload-or">or</span>
              <label className="upload-button" htmlFor="file-input">
                Browse Files
              </label>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <span className="upload-hint">Supports JPG, PNG, WebP, GIF (max 10MB)</span>
            </>
          )}
        </div>

        {error && (
          <div className="error-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            {error}
          </div>
        )}

        {previewUrl && isProcessing && (
          <div className="preview-section">
            <h3>Original Image</h3>
            <div className="preview-image">
              <img src={previewUrl} alt="Preview" />
            </div>
          </div>
        )}

        {processedImages.length > 0 && (
          <section className="results-section">
            <h2>Processed Images</h2>
            <div className="image-grid">
              {processedImages.map((image) => (
                <div key={image.id} className="image-card">
                  <div className="image-preview">
                    <img src={image.processedUrl} alt={image.originalName} />
                  </div>
                  <div className="image-info">
                    <span className="image-name" title={image.originalName}>
                      {image.originalName}
                    </span>
                    <span className="image-date">
                      {new Date(image.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="image-actions">
                    <a
                      href={image.processedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="action-btn view"
                      title="Open in new tab"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15,3 21,3 21,9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                    <button
                      className="action-btn copy"
                      onClick={() => copyToClipboard(image.processedUrl)}
                      title="Copy URL"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(image.id)}
                      title="Delete image"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3,6 5,6 21,6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Powered by <a href="https://www.remove.bg/" target="_blank" rel="noopener noreferrer">remove.bg</a> & <a href="https://cloudinary.com/" target="_blank" rel="noopener noreferrer">Cloudinary</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
