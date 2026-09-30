"use client";
import { useState } from "react";
export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const current = images[idx] || "https://placehold.co/600";
  return (
    <div>
      <img src={current} alt={name} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 12 }} />
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
          {images.map((url, i) => (
            <img key={i} src={url} onClick={() => setIdx(i)} alt=""
              style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, cursor: "pointer",
                border: i === idx ? "2px solid var(--primary)" : "1px solid #e2e8f0" }} />
          ))}
        </div>
      )}
    </div>
  );
}
