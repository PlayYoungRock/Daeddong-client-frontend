import styled from 'styled-components';
import { Map, InfoSheet, MapContext, Text } from '@/components';
import { useContext } from 'react';
import { useDistance } from '@/hooks';

export default function Home() {
  const { pointer } = useContext(MapContext);
  const { distance } = useDistance();

  return (
    <Container>
      <Map />
      <InfoSheet>
        {pointer ? (
          <>
            <Text>{pointer && pointer.coord.x}</Text>
            <Text>{pointer && pointer.coord.y}</Text>
            <Text>{distance.toFixed(2)}m</Text>
          </>
        ) : (
          <>
            <Text>선택되지않음</Text>
            <Text>{distance.toFixed(2)}m</Text>
          </>
        )}
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
