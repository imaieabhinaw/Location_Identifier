import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ScrambledTextProps {
  text: string;
  className?: string;
  trigger?: boolean;
  onComplete?: () => void;
}

export function ScrambledText({
  text,
  className = "",
  trigger = true,
  onComplete,
}: ScrambledTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!trigger || isAnimating) return;

    const scrambledChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    let iterations = 0;
    setIsAnimating(true);

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iterations) {
              return char;
            }
            return scrambledChars[
              Math.floor(Math.random() * scrambledChars.length)
            ];
          })
          .join("")
      );

      if (iterations >= text.length) {
        clearInterval(interval);
        setIsAnimating(false);
        onComplete?.();
      }

      iterations += 1 / 3;
    }, 50);

    return () => clearInterval(interval);
  }, [text, trigger, isAnimating, onComplete]);

  return (
    <motion.span
      className={`font-cinzel font-bold tracking-wide ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
    </motion.span>
  );
}
