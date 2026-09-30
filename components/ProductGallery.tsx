"use client";

import Image from "next/image";
import { useState } from "react";

type Props = { images: string[]; name: string };

export default function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  return (
    <div className="gallery-wrap">
      <div className="gallery-main-frame">
        <Image
          className="gallery-main"
          src={images[active]}
          alt={`${name} view ${active + 1}`}
          width={1536}
          height={1536}
          priority
        />
      </div>
      <div className="thumbs" aria-label="Product photos">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            className={`thumb-btn ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`View ${name} photo ${i + 1}`}
          >
            <Image className="thumb" src={src} alt={`${name} thumbnail ${i + 1}`} width={100} height={100} />
          </button>
        ))}
      </div>
      <p className="gallery-hint">Tap a photo to view it</p>
    </div>
  );
}
