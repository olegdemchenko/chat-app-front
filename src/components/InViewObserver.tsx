import React, { useState, useEffect } from "react";
import { InView } from "react-intersection-observer";

type InViewObserverProps = {
  children: React.ReactNode;
  onInView: () => void;
};

function InViewObserver({ children, onInView }: InViewObserverProps) {
  const [inView, setInView] = useState<boolean>(false);

  const handleChange = (inView: boolean) => setInView(inView);

  useEffect(() => {
    if (inView) {
      onInView();
    }
  }, [inView]);

  return (
    <InView onChange={handleChange} triggerOnce>
      {children}
    </InView>
  );
}

export default InViewObserver;
