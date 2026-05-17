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