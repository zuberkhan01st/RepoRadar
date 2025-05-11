'use client';

import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('input');
      
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width={isHovering ? "24px" : "16px"}
      height={isHovering ? "24px" : "16px"}
      borderRadius="50%"
      bg="brand.500"
      opacity={0.5}
      pointerEvents="none"
      zIndex={9999}
      transform={`translate(${position.x - (isHovering ? 12 : 8)}px, ${position.y - (isHovering ? 12 : 8)}px)`}
      transition="all 0.1s ease-out"
      mixBlendMode="difference"
    />
  );
};

export default CustomCursor; 