"use client";

import { motion, MotionValue, useTransform } from "framer-motion";

interface ScrollSectionProps {
  headline: string;
  subhead: string;
  alignment: "left" | "right" | "center";
  progress: MotionValue<number>;
  range: [number, number, number, number];
}

export default function ScrollSection({
  headline,
  subhead,
  alignment,
  progress,
  range,
}: ScrollSectionProps) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [50, 0, 0, -50]);

  const alignClass =
    alignment === "left"
      ? "items-center md:items-start text-center md:text-left justify-center px-6 md:px-0 md:pl-[2%] lg:pl-[2%]"
      : alignment === "right"
      ? "items-center md:items-end text-center md:text-right justify-center px-6 md:px-0 md:pr-[2%] lg:pr-[2%]"
      : "items-center text-center justify-center px-6";

  const widthClass = alignment === "center" ? "max-w-2xl" : "max-w-md lg:max-w-lg";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 w-full h-full flex flex-col ${alignClass} z-20 pointer-events-none`}
    >
      <div className={`w-full ${widthClass} p-8`}>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 drop-shadow-[0_0_25px_rgba(0,180,255,0.6)] [text-shadow:0_0_10px_rgba(0,214,255,0.3)]">
          {headline}
        </h2>
        <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium drop-shadow-[0_0_15px_rgba(0,214,255,0.4)]">
          {subhead}
        </p>
      </div>
    </motion.div>
  );
}
