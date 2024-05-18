export const layoutId = 'layout';
export const NoneOption = { label: '없음', value: '' };
export const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
export const isMobile =
  isBrowser &&
  window?.navigator.userAgent.match(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
  );
export const markerUrl = '/toilet.svg';
