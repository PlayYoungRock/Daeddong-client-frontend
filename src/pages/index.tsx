import styled from 'styled-components';
import { Map, InfoSheet, MapContext, Text } from '@/components';
import { useContext } from 'react';

export default function Home() {
  const { pointer } = useContext(MapContext);
  return (
    <Container>
      <Map />
      <InfoSheet>
        {pointer ? (
          <>
            <Text>{pointer && pointer.coord.x}</Text>
            <Text>{pointer && pointer.coord.y}</Text>
          </>
        ) : (
          <Text>선택되지않음</Text>
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
