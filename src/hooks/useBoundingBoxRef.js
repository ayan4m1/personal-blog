import { useEffect, useState } from 'react';

export default function useBoundingBoxRef(ref, dependencies = []) {
  const [rect, setRect] = useState(null);

  useEffect(() => {
    if (ref.current) {
      setRect(ref.current.getBoundingClientRect());
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...dependencies]);

  return rect;
}
