import { useEffect, useRef } from 'react';
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

interface PerfectScrollbarOptions {
  suppressScrollX?: boolean;
  wheelPropagation?: boolean;
}

const usePerfectScrollbar = (options: PerfectScrollbarOptions = {}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<PerfectScrollbar | null>(null);

  useEffect(() => {
    if (scrollRef.current && !psRef.current) {
      //@ts-expect-error error
      psRef.current = new PerfectScrollbar(scrollRef.current, options);
    }

    return () => {
      if (psRef.current && scrollRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        psRef.current.destroy(scrollRef.current);
        psRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (psRef.current && scrollRef.current) {
      psRef.current.update(scrollRef.current);
    }
  });

  return scrollRef;
};

export default usePerfectScrollbar;
