import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

interface InfoSheetProps extends React.PropsWithChildren {}

export const InfoSheet = memo<InfoSheetProps>(({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !toggleRef.current || !window) return;

    const maxHeight = window.innerHeight * 0.9;
    const minBottomY = maxHeight * -1 + 64;

    const container = containerRef.current;
    const toggle = toggleRef.current;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      setIsDragging(true);
      setStartY(touch.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isDragging) {
        const touch = event.touches[0];
        const offsetY = startY - touch.clientY;
        const newBottom = Math.min(Math.max(minBottomY, offsetY + currentY), 0);
        container.style.bottom = `${newBottom}px`;
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (isDragging) {
        setCurrentY(parseFloat(container.style.bottom) || 0);
        setIsDragging(false);
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      setIsDragging(true);
      setStartY(event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const offsetY = startY - event.clientY;

        const newBottom = Math.min(Math.max(minBottomY, offsetY + currentY), 0);
        container.style.bottom = `${newBottom}px`;
      }
    };
    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging) {
        setCurrentY(parseFloat(container.style.bottom) || 0);
        setIsDragging(false);
      }
    };

    toggle.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    toggle.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      toggle.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      toggle.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentY, isDragging, startY]);

  return (
    <Container ref={containerRef}>
      <Toggle ref={toggleRef} />
      {children}
    </Container>
  );
});

InfoSheet.displayName = 'InfoSheet';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 16px 16px 0px 16px;

  @media (max-width: 760px) {
    position: absolute;
    height: 90%;
    bottom: 0;
    left: 0;
    padding-top: 32px;
    z-index: 1000;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2);
  }
`;

const Toggle = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);

  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 32px;

  cursor: grab;

  &::before {
    content: '';
    display: block;
    width: 40%;
    height: 2px;
    border-radius: 20px;
    background-color: #000;
  }

  @media (min-width: 760px) {
    display: none;
  }
`;
