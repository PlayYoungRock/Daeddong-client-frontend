import React, { memo } from 'react';
import styled from 'styled-components';

interface InfoSheetProps extends React.PropsWithChildren {}

export const InfoSheet = memo<InfoSheetProps>(({ children }) => {
  return (
    <Container>
      <Toggle />
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
    position: fixed;
    height: 80%;
    bottom: 0;
    left: 0;
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
  height: 16px;

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
