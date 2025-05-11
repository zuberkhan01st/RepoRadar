'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import gsap from 'gsap';

const AnimatedCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    // Initialize GSAP
    gsap.set([cursor, cursorDot], {
      scale: 0,
      opacity: 0,
    });

    let lastTime = 0;
    const throttleDelay = 16; // ~60fps

    const moveCursor = (e: MouseEvent) => {
      const currentTime = performance.now();
      if (currentTime - lastTime < throttleDelay) return;
      
      lastTime = currentTime;

      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.2,
        ease: 'power2.out',
        overwrite: true,
      });
      
      gsap.to(cursorDot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: true,
      });
    };

    const handleMouseEnter = () => {
      gsap.to([cursor, cursorDot], {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to([cursor, cursorDot], {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    // Add event listeners
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initial cursor position
    gsap.set([cursor, cursorDot], {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      pointerEvents="none"
      zIndex={9999}
    >
      <Box
        ref={cursorRef}
        position="absolute"
        width="40px"
        height="40px"
        borderRadius="50%"
        border="1px solid"
        borderColor="whiteAlpha.400"
        transform="translate(-50%, -50%)"
      />
      <Box
        ref={cursorDotRef}
        position="absolute"
        width="8px"
        height="8px"
        borderRadius="50%"
        bg="white"
        transform="translate(-50%, -50%)"
      />
    </Box>
  );
};

export default AnimatedCursor; 