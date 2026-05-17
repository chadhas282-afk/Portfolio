import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, useScroll as useFramerScroll, useTransform as useFramerTransform } from 'framer-motion';
import { wrap } from "framer-motion";
import Lenis from 'lenis';
import { Github, Linkedin, Mail, ExternalLink, Code2, Cpu, Globe, Rocket, ChevronDown } from 'lucide-react';

const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  
  useEffect(() => {
    let frame = 0;
    const duration = 20;
     const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, i) => {
        if (frame > (i * 2)) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      frame++;
      if (frame > text.length * 3) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
};

const Magnetic = ({ children, className, scale = 0.4 }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
   const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * scale);
    y.set((e.clientY - centerY) * scale);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >{children}
    </motion.div>
  );
};

const SmoothReveal = ({ text }) => {
  return (
    <div className="reveal-wrapper">
      <motion.h2
        className="reveal-text interactive glitch-hover"
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }} 
        transition={{ duration: 1, ease: [0.33, 1, 0.68, 1] }}
      >
        {text}
      </motion.h2>
    </div>
  );
};

const ParallaxText = ({ children, baseVelocity = 100 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
};

const Typewriter = ({ texts, delay = 100, pause = 2000 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);