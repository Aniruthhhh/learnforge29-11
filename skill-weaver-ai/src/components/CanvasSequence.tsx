"use client";

import { useEffect, useRef, useState } from "react";
import { useTransform, useMotionValueEvent, MotionValue } from "framer-motion";

interface CanvasSequenceProps {
  progress: MotionValue<number>;
}

export default function CanvasSequence({ progress }: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCount = 240;

  // Preload images once on mount
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${num}.jpg`;
      img.onload = () => {
        loadedCount++;
        // Trigger a draw when the first few images load or all finish
        if (loadedCount === 1 || loadedCount === 10 || loadedCount === frameCount) {
          renderCanvas(frameIndex.get());
        }
      };
      loadedImages.push(img);
    }
    imagesRef.current = loadedImages;
  }, [frameCount]);

  // Derived frame index from scroll progress (0 to 1)
  const frameIndex = useTransform(progress, [0, 1], [0, frameCount - 1]);

  const renderCanvas = (indexValue: number) => {
    const images = imagesRef.current;
    if (images.length === 0) return;
    
    const index = Math.round(indexValue);
    const img = images[index];
    
    if (img && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      const width = rect.width * dpr;
      const height = rect.height * dpr;

      if (canvasRef.current.width !== width || canvasRef.current.height !== height) {
        canvasRef.current.width = width;
        canvasRef.current.height = height;
      }

      // We calculate ratios against the newly high-res canvas width/height
      const hRatio = canvasRef.current.width / img.width;
      const vRatio = canvasRef.current.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      
      const centerShift_x = (canvasRef.current.width - img.width * ratio) / 2;
      const centerShift_y = (canvasRef.current.height - img.height * ratio) / 2;
      
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      // Optional: Turn on image smoothing for high-quality upscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img, 
        0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio
      );
    }
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderCanvas(latest);
  });

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full object-cover" 
      />
    </div>
  );
}
