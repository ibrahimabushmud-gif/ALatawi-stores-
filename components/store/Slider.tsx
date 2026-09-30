"use client";
import { useState, useEffect } from 'react';

export default function Slider({ banners }: { banners: any[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (banners.length === 0) return null;

  return (
    <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden' }}>
      {banners.map((banner, idx) => (
        <div
          key={banner.id}
          style={{
            display: idx === current ? 'block' : 'none',
            width: '100%',
            aspectRatio: '3/1',
          }}
        >
          <img src={banner.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ))}
      {banners.length > 1 && (
        <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                border: 'none',
                background: idx === current ? 'var(--primary)' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
