"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypingAnimation = forwardRef<HTMLDivElement, TypingAnimationProps>(
  ({ text, speed = 1, onComplete }, ref) => {
    const [displayedText, setDisplayedText] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const internalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => internalRef.current as HTMLDivElement);

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
          <div
            ref={internalRef}
            className="prose dark:prose-invert max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: displayedText }}
          />
          {currentIndex < text.length && (
            <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse" />
          )}
        </div>
      </div>
    );
  }
);

TypingAnimation.displayName = "TypingAnimation";
export default TypingAnimation;
