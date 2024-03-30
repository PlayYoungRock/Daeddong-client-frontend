import styled from 'styled-components';
import { Map, InfoSheet, MapProvider } from '@/components';

export default function Home() {
  return (
    <MapProvider>
      <Container>
        <Map />
        <InfoSheet>{/* TODO inner 추가할것  */}</InfoSheet>
      </Container>
    </MapProvider>
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
