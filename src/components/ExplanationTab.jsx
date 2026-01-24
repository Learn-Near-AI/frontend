import React, { useState, useEffect, useRef } from "react";
import { getContractExplanation } from "../data/contractExplanations";

const STORAGE_KEY = "explanation_typed_examples";

function ExplanationTab({ example }) {
  const fullExplanation = getContractExplanation(example.id);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const currentExampleIdRef = useRef(null);

  // Get stored examples that have been typed
  const getTypedExamples = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Mark example as typed in localStorage
  const markExampleAsTyped = (exampleId) => {
    try {
      const typed = getTypedExamples();
      if (!typed.includes(exampleId)) {
        typed.push(exampleId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(typed));
      }
    } catch (error) {
      console.error("Failed to save typed examples:", error);
    }
  };

  // Check if example has been typed before
  const hasExampleBeenTyped = (exampleId) => {
    return getTypedExamples().includes(exampleId);
  };

  useEffect(() => {
    // Clear any ongoing typing when example changes
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    // Update current example reference
    currentExampleIdRef.current = example.id;

    // Reset state when example changes
    setDisplayedText("");
    setIsTyping(false);

    if (!fullExplanation) {
      return;
    }

    // Check if this example has been typed before
    const hasBeenTyped = hasExampleBeenTyped(example.id);

    if (hasBeenTyped) {
      // If already typed, show full text immediately
      setDisplayedText(fullExplanation);
      setIsTyping(false);
      return;
    }

    // Start typing animation
    setIsTyping(true);
    let currentIndex = 0;
    let hasStartedTyping = false;

    // Variable typing speed to simulate thinking
    const getTypingSpeed = () => {
      // Base speed
      let speed = 30;
      
    
      const variation = Math.random();
      if (variation < 0.3) {
        // Fast typing (15-30ms)
        speed = 15 + Math.random() * 15;
      } else if (variation < 0.6) {
        // Normal typing (30-45ms)
        speed = 30 + Math.random() * 15;
      } else if (variation < 0.85) {
        // Slower typing (50-80ms) - thinking
        speed = 50 + Math.random() * 30;
      } else {
        // Very slow typing (100-150ms) - deep thinking
        speed = 100 + Math.random() * 50;
      }
      
      return speed;
    };

    const typeCharacter = () => {
      // Check if example has changed during typing
      if (currentExampleIdRef.current !== example.id) {
        return;
      }

      if (currentIndex < fullExplanation.length) {
        if (!hasStartedTyping) {
          hasStartedTyping = true;
          // Mark as started typing in localStorage
          markExampleAsTyped(example.id);
        }

        setDisplayedText(fullExplanation.slice(0, currentIndex + 1));
        currentIndex++;
        
        const nextSpeed = getTypingSpeed();
        typingTimeoutRef.current = setTimeout(typeCharacter, nextSpeed);
      } else {
        setIsTyping(false);
        typingTimeoutRef.current = null;
      }
    };

    // Start typing after a short delay
    typingTimeoutRef.current = setTimeout(() => {
      typeCharacter();
    }, 300);

    return () => {
      // Cleanup on unmount or example change
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [example.id, fullExplanation]);

  return (
    <div className="space-y-4 bg-[#0d0f14] rounded-lg p-2 h-[400px] overflow-y-auto">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">
          {example.name}
        </h2>
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Contract Explanation
        </p>
      </div>
      <div className="relative">
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {displayedText}
         
        </p>
      </div>
    </div>
  );
}

export default ExplanationTab;
