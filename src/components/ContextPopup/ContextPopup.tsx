import React, { memo, useEffect, isValidElement, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';

import { layoutId } from '@/constants';

interface PositionType {
  x: number;
  y: number;
}

interface ContextPopupProps {
  $contents: React.ReactNode;
  children?: React.ReactNode;
}

export const ContextPopup = memo<ContextPopupProps>(({ $contents, children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contextRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<PositionType | null>(null);

  useEffect(() => {
    if (!contextRef.current || !containerRef.current || !window) return;

    const container = containerRef.current;
    const contextPopupContainer = contextRef.current;

    const isMobile = /iPhone|iPad|iPod|Android|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

    const onOpen = (e: MouseEvent) => {
      const dom = e.target as HTMLElement;

      // note 자기자신을 눌렀을 때
      if (contextPopupContainer.contains(dom)) return e.preventDefault();

      if (!document.getElementById(layoutId)?.contains(dom)) return;

      e.preventDefault();

      const contextWidth = contextPopupContainer.getBoundingClientRect().width;
      const contextHeight = contextPopupContainer.getBoundingClientRect().height;

      const x = e.clientX;
      const y = e.clientY;

      const cx = x + contextWidth > container.getBoundingClientRect().right ? x - contextWidth : x;
      const cy =
        y + contextHeight > container.getBoundingClientRect().bottom ? y - contextHeight : y;

      const dx = isMobile ? cx : cx - container.getBoundingClientRect().left;
      const dy = isMobile ? cy : cy - container.getBoundingClientRect().top;

      setPosition({ x: dx, y: dy });
    };

    const onClose = (e: MouseEvent) => {
      const dom = e.target as HTMLElement;

      if (contextPopupContainer.contains(dom)) return;

      setPosition(null);
    };

    container.addEventListener('contextmenu', onOpen);
    document.body.addEventListener('click', onClose);

    return () => {
      container.removeEventListener('contextmenu', onOpen);
      document.body.removeEventListener('click', onClose);
    };
  }, []);

  if (isValidElement(children)) {
    return (
      <Container ref={containerRef}>
        {children}
        <ContextContainer ref={contextRef} $position={position}>
          <Content>{$contents}</Content>
        </ContextContainer>
      </Container>
    );
  }

  return null;
});

ContextPopup.displayName = 'ContextPopup';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const ContextContainer = styled.div<{ $position: PositionType | null }>`
  display: ${({ $position }) => ($position ? 'block' : 'none')};
  position: absolute;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #000;
  background-color: #fff;
  z-index: 1000;
  ${({ $position }) =>
    $position &&
    css`
      top: ${$position.y}px;
      left: ${$position.x}px;
    `}
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;
