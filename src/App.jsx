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

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = texts[currentTextIndex];

      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1));
        if (currentText === fullText) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1));
        if (currentText === "") {
          setIsDeleting(false);
          setCurrentTextIndex((currentTextIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? delay / 2 : delay);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts, delay, pause]);

  return (
    <span style={{ color: 'var(--accent-cyan)', borderRight: '2px solid var(--accent-cyan)', paddingRight: '5px' }}>
      {currentText}
    </span>
  );
};

const TiltSection = ({ children }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useFramerScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], [5, -5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      style={{ rotateX, scale, perspective: '1000px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 30 }}
    >
      {children}
    </motion.div>
  );
};

const FloatingObject = ({ color1, color2, delay = 0 }) => {
  return (
    <motion.div
      className="floating-shape"
      animate={{
        x: [0, 100, -50, 0],
        y: [0, -100, 50, 0],
        scale: [1, 1.2, 0.8, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        delay,
        ease: "linear"
      }}
      style={{
        background: `linear-gradient(45deg, ${color1}, ${color2})`,
        left: `${Math.random() * 80}%`,
        top: `${Math.random() * 80}%`,
      }}
    />
  );
};

const NeuralNetwork = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const particles = [];
    const particleCount = 80;
    const connectionDistance = 150;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / connectionDistance})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
          };
  }, []);

  return <canvas ref={canvasRef} className="neural-bg" />;
};


const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleHover = (e) => {
      if (e.target.closest('a, button, .interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <motion.div
        className="cursor-dot"
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: isHovering ? 2.5 : 1,
        }}
         transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.5 }}
      />
      <motion.div
        className="cursor-outline"
        animate={{
          x: position.x - 20,
          y: position.y - 20,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.3 : 1,
          backgroundColor: isHovering ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 1 }}
      />
    </>
  );
};

const Navbar = () => {
  return (
    <nav className="navbar">
      <Magnetic>
        <div className="nav-logo interactive">SAHIL.</div>
        </Magnetic>
      <div className="nav-links">
        {['About', 'Projects', 'Skills', 'Education', 'Experience', 'Contact'].map((item) => (
          <Magnetic key={item} scale={0.2}>
            <a 
            href={`#${item.toLowerCase()}`} 
              className="nav-link interactive" 
            >
              {item}
            </a>
            </Magnetic>
        ))}
      </div>
    </nav>
  );
};

const SkillBar = ({ name, level, delay, color = "var(--accent-cyan)" }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className="glass-card interactive"
    style={{ padding: '1.2rem', width: '100%' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
      <h4 style={{ fontSize: '1.1rem' }}>{name}</h4>
      <span style={{ color, fontWeight: 800 }}>{level}</span>
    </div>