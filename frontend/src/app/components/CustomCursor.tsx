'use client';

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input')
      );
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <MotionBox
      position="fixed"
      top={0}
      left={0}
      width="20px"
      height="20px"
      borderRadius="50%"
      backgroundColor="brand.500"
      pointerEvents="none"
      zIndex={9999}
      animate={{
        x: position.x - 10,
        y: position.y - 10,
        scale: isHovering ? 1.5 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
      style={{
        mixBlendMode: 'difference',
      }}
    />
  );
} 