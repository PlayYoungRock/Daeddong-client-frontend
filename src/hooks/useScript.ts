import { useState, useEffect, useRef } from 'react';

interface ScriptElementType extends HTMLScriptElement {
  [key: string]: any;
}

interface ScriptsType {
  loading: boolean;
  error: ErrorEvent | null;
  element: ScriptElementType;
}

interface useScriptType {
  src?: string | null;
  checkForExisting?: boolean;
  [key: string]: any;
}

const isScriptElement = (el: ScriptElementType | null): el is ScriptElementType => {
  return !!el;
};

// 지역상수, 유틸
const scripts: Record<string, ScriptsType> = {};

const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';

const getScriptFromDom = (src: string) => {
  const element = document.querySelector<ScriptElementType>(`script[src="${src}"]`);
  if (!isScriptElement(element)) return;

  return (scripts[src] = {
    loading: false,
    error: null,
    element,
  });
};

export const useScript = ({ src, checkForExisting = false, ...attributes }: useScriptType) => {
  const ref = useRef<ScriptsType>();
  ref.current = src ? scripts[src] : undefined;

  if (isBrowser && src && checkForExisting && !ref.current) {
    ref.current = getScriptFromDom(src);
  }

  const [loading, setLoading] = useState(ref.current ? ref.current.loading : Boolean(src));
  const [error, setError] = useState(ref.current ? ref.current.error : null);

  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!isBrowser || !src || !loading || error || scriptLoaded) return;

    ref.current = scripts[src];
    if (!ref.current && checkForExisting) {
      ref.current = getScriptFromDom(src);
    }

    let scriptEl: ScriptElementType;

    if (ref.current) {
      scriptEl = ref.current.element;
    } else {
      scriptEl = document.createElement('script');
      scriptEl.src = src;

      Object.keys(attributes).forEach((key) => {
        if (scriptEl[key] === undefined) {
          scriptEl.setAttribute(key, attributes[key]);
        } else {
          scriptEl[key] = attributes[key];
        }
      });

      ref.current = scripts[src] = {
        loading: true,
        error: null,
        element: scriptEl,
      };
    }

    const handleLoad = () => {
      if (ref.current) ref.current.loading = false;
      setLoading(false);
      setScriptLoaded(true);
    };
    const handleError = (error: ErrorEvent) => {
      if (ref.current) ref.current.error = error;
      setError(error);
    };

    scriptEl.addEventListener('load', handleLoad);
    scriptEl.addEventListener('error', handleError);

    document.body.appendChild(scriptEl);

    return () => {
      scriptEl.removeEventListener('load', handleLoad);
      scriptEl.removeEventListener('error', handleError);
    };
  }, [src, attributes, loading, error, scriptLoaded, checkForExisting]);

  return [loading, error];
};
