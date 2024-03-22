import { layoutId } from '@/constants';
import dynamic from 'next/dynamic';
import React from 'react';
import styled from 'styled-components';

const Layouts = ({ children }: React.PropsWithChildren) => {
  return (
    <Container>
      <Wrapper id={layoutId}>{children}</Wrapper>
    </Container>
  );
};

export const Layout = dynamic(() => Promise.resolve(Layouts), { ssr: false });

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;
  max-width: 410px;

  @media (min-width: 760px) {
    width: 760px;
  }
`;
