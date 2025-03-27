import { useRef, useEffect } from 'react';

export const useAlreadyMounted = () => {
  const isMountRef = useRef(true);
 
  useEffect(() => {
    isMountRef.current = false;
    return () => {
      isMountRef.current = true;
    };
  }, []);

  return isMountRef.current;
};
