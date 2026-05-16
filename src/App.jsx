import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, useScroll as useFramerScroll, useTransform as useFramerTransform } from 'framer-motion';
import { wrap } from "framer-motion";
import Lenis from 'lenis';
import { Github, Linkedin, Mail, ExternalLink, Code2, Cpu, Globe, Rocket, ChevronDown } from 'lucide-react';

const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);