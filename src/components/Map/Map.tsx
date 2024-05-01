import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { useNaverMap } from '@/hooks/useNaverMap';
import { isBrowser } from '@/constants';
import { ClientMapContext } from '@/states';

export const Map = memo(() => {
  const [_, setIsLoadingClientMap] = useContext(ClientMapContext);
  const [mapDiv, setMapDiv] = useState<HTMLDivElement | null>(null);
  const { isLoading, map } = useNaverMap(mapDiv);

  const moveCenter = useCallback(async () => {
    if (!navigator.permissions || !map || !setIsLoadingClientMap) return;

    const { state } = await navigator.permissions.query({ name: 'geolocation' });
    if (state === 'denied') {
      return setIsLoadingClientMap(false);
    }

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      map.setCenter(new naver.maps.LatLng(coords.latitude, coords.longitude));
    });
    setIsLoadingClientMap(false);
  }, [map, setIsLoadingClientMap]);

  useEffect(() => {
    if (isBrowser && !isLoading) {
      moveCenter();
    }
  }, [isLoading, moveCenter]);

  useEffect(() => {
    if (setIsLoadingClientMap === null) {
      throw Error('ClientMapProvider 를 선언해주세요');
    }
  }, [setIsLoadingClientMap]);

  if (isLoading) {
    return (
      <Container>
        {/* TODO Icon component*/}
        <Wrapper>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              opacity="0.1"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4C9.87827 4 7.84344 4.84285 6.34315 6.34315C4.84285 7.84344 4 9.87827 4 12C4 14.1217 4.84285 16.1566 6.34315 17.6569C7.84344 19.1571 9.87827 20 12 20C14.1217 20 16.1566 19.1571 17.6569 17.6569C19.1571 16.1566 20 14.1217 20 12C20 9.87827 19.1571 7.84344 17.6569 6.34315C16.1566 4.84285 14.1217 4 12 4ZM2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12Z"
              fill="#111111"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 4.00001C9.93738 3.99566 7.95366 4.7923 6.46698 6.22201C6.37216 6.31289 6.26038 6.3842 6.138 6.43187C6.01563 6.47955 5.88507 6.50265 5.75376 6.49986C5.62246 6.49708 5.49299 6.46846 5.37275 6.41564C5.25251 6.36282 5.14385 6.28683 5.05298 6.19201C4.9621 6.0972 4.89079 5.98541 4.84312 5.86304C4.79545 5.74067 4.77234 5.6101 4.77513 5.4788C4.77791 5.3475 4.80653 5.21803 4.85935 5.09779C4.91218 4.97755 4.98816 4.86889 5.08298 4.77801C6.94205 2.99145 9.42161 1.9956 12 2.00001C12.2652 2.00001 12.5195 2.10537 12.7071 2.29291C12.8946 2.48044 13 2.7348 13 3.00001C13 3.26523 12.8946 3.51958 12.7071 3.70712C12.5195 3.89466 12.2652 4.00001 12 4.00001Z"
              fill="#111111"
            />
          </svg>
        </Wrapper>
      </Container>
    );
  }

  return <Container ref={(ref) => setMapDiv(ref)} />;
});

Map.displayName = 'Map';

// TODO Loading component
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  animation: ${spin} 1s linear infinite;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
