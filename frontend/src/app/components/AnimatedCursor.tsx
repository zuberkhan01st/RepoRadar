'use client';

import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const AnimatedCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top = `${e.clientY}px`;
    };

    const handleMouseEnter = () => {
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
    };

    // Set initial position
    cursor.style.left = `${window.innerWidth / 2}px`;
    cursor.style.top = `${window.innerHeight / 2}px`;
    cursorDot.style.left = `${window.innerWidth / 2}px`;
    cursorDot.style.top = `${window.innerHeight / 2}px`;

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

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
        transition="opacity 0.3s ease"
        opacity="0"
      />
      <Box
        ref={cursorDotRef}
        position="absolute"
        width="8px"
        height="8px"
        borderRadius="50%"
        bg="white"
        transform="translate(-50%, -50%)"
        transition="opacity 0.3s ease"
        opacity="0"
      />
    </Box>
  );
};

export default AnimatedCursor; 