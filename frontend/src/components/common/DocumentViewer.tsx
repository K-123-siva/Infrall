import { useState } from 'react';
import { X, FileText, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Converts a Cloudinary raw/upload URL to a Google Docs Viewer URL.
 * Images and already-inline PDFs are returned as-is.
 */
export const toViewableUrl = (url: string): string => {
  if (!url) return url;
  // raw/upload PDFs → Google Docs Viewer
  if (url.includes('/raw/upload/')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  // image/upload with .pdf extension (wrongly uploaded via resource_type:auto)
  // These are Unauthorized on Cloudinary — route through Google Docs Viewer anyway
  if (url.includes('/image/upload/') && url.toLowerCase().endsWith('.pdf')) {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  }
  return url;
};

/**
 * Returns true if the URL points to a PDF (raw or image/upload .pdf).
 */
const isPdf = (url: string) =>
  url.includes('/raw/upload/') ||
  url.toLowerCase().endsWith('.pdf');

/**
 * Returns true if the URL points to an image.
 */
const isImage = (url: string) =>
  /\.(jpg|jpeg|png|webp|gif)$/i.test(url) ||
  (url.includes('cloudinary') && !isPdf(url) && !url.includes('/raw/upload/'));

// ─── Inline viewer modal ──────────────────────────────────────────────────────
interface ViewerModalProps {
  url: string;
  label: string;
  onClose: () => void;
}

function ViewerModal({ url, label, onClose }: ViewerModalProps) {
  const viewUrl = toViewableUrl(url);
  const image = isImage(url);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 12, overflow: 'hidden',
          width: '90vw', maxWidth: 900, height: '85vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color="#4f46e5" />
            <span style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{label}</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href={toViewableUrl(url)}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 12px', borderRadius: 6,
                background: '#eff6ff', color: '#2563eb',
                fontSize: 12, fontWeight: 600, textDecoration: 'none',
                border: '1px solid #bfdbfe',
              }}
            >
              <ExternalLink size={13} /> Open in new tab
            </a>
            <button
              onClick={onClose}
              style={{
                background: '#fee2e2', border: 'none', borderRadius: 6,
                padding: '6px 10px', cursor: 'pointer', color: '#dc2626',
                display: 'flex', alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          {image ? (
            <img
              src={url}
              alt={label}
              style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f1f5f9' }}
            />
          ) : (
            <iframe
              src={viewUrl}
              title={label}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="fullscreen"
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Single document button ───────────────────────────────────────────────────
interface DocumentButtonProps {
  url: string;
  label: string;
}

export function DocumentButton({ url, label }: DocumentButtonProps) {
  const [open, setOpen] = useState(false);

  if (!url) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 6,
          background: '#eff6ff', color: '#2563eb',
          fontSize: 12, fontWeight: 600,
          border: '1px solid #bfdbfe', cursor: 'pointer',
        }}
      >
        <FileText size={13} />
        {label}
        <ExternalLink size={11} />
      </button>
      {open && <ViewerModal url={url} label={label} onClose={() => setOpen(false)} />}
    </>
  );
}

// ─── Document list (multiple docs for a listing) ──────────────────────────────
interface DocumentListProps {
  ownerDocuments?: string[];
  thalukaDocuments?: string[];
  agreementDocument?: string | null;
  emptyMessage?: string;
}

export function DocumentList({
  ownerDocuments = [],
  thalukaDocuments = [],
  agreementDocument,
  emptyMessage = 'No documents uploaded',
}: DocumentListProps) {
  const docs: { label: string; url: string }[] = [
    ...ownerDocuments.map((url, i) => ({ label: `Owner Doc ${i + 1}`, url })),
    ...thalukaDocuments.map((url, i) => ({ label: `Thaluka Doc ${i + 1}`, url })),
    ...(agreementDocument ? [{ label: 'Agreement', url: agreementDocument }] : []),
  ];

  if (docs.length === 0) {
    return (
      <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
        <FileText size={13} /> {emptyMessage}
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <FileText size={14} /> Documents ({docs.length})
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {docs.map((doc, i) => (
          <DocumentButton key={i} url={doc.url} label={doc.label} />
        ))}
      </div>
    </div>
  );
}

// ─── Image gallery viewer ─────────────────────────────────────────────────────
interface ImageGalleryProps {
  images: string[];
  title?: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${title || 'Image'} ${i + 1}`}
            onClick={() => { setIdx(i); setOpen(true); }}
            style={{
              width: 80, height: 80, objectFit: 'cover', borderRadius: 8,
              cursor: 'pointer', border: '2px solid #e2e8f0',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#6366f1')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e8f0')}
          />
        ))}
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={images[idx]}
              alt={`${title} ${idx + 1}`}
              style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 8 }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setIdx((idx - 1 + images.length) % images.length)}
                  style={{
                    position: 'absolute', left: -48, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><ChevronLeft size={20} /></button>
                <button
                  onClick={() => setIdx((idx + 1) % images.length)}
                  style={{
                    position: 'absolute', right: -48, top: '50%', transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%',
                    width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                ><ChevronRight size={20} /></button>
              </>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute', top: -16, right: -16,
                background: '#fff', border: 'none', borderRadius: '50%',
                width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            ><X size={16} /></button>
            <div style={{ textAlign: 'center', color: '#fff', marginTop: 8, fontSize: 13 }}>
              {idx + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
