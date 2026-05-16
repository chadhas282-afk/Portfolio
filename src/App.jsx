import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, useScroll as useFramerScroll, useTransform as useFramerTransform } from 'framer-motion';
import { wrap } from "framer-motion";
import Lenis from 'lenis';