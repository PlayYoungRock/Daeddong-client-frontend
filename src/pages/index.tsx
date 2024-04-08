import styled from 'styled-components';
import { Map, InfoSheet, MapContext, Text } from '@/components';
import { useContext } from 'react';
import { useCenter, useCurrentMarker, useDistance } from '@/hooks';

export default function Home() {
  useContext(MapContext);
  const { distance } = useDistance();
  useCurrentMarker();
  useCenter();

  return (
    <Container>
      <Map />
      <InfoSheet>
        <Text>{distance.toFixed(2)}m</Text>
      </InfoSheet>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  overflow: hidden;

  @media (min-width: 760px) {
    display: flex;
    gap: 20px;
  }
`;
