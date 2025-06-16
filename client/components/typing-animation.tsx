"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingAnimation({
  text,
  speed = 3,
  onComplete,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <div className="relative">
      <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-normal">
        <div className="prose dark:prose-invert max-w-none gap-0 my-8" dangerouslySetInnerHTML={{ __html: displayedText }}></div>
        {/* {displayedText} */}

        {currentIndex < text.length && (
          <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />
        )}
      </div>
    </div>
  );
}
