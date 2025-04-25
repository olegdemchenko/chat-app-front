import React from "react";
import { InView } from "react-intersection-observer";

type InViewObserverProps = {
  children: React.ReactNode;
  onInView: () => void;
};

function InViewObserver({ children, onInView }: InViewObserverProps) {
  const handleInView = (inView: boolean) => {
    if (inView) {
      onInView();
    }
  };

  return (
    <InView onChange={handleInView} triggerOnce>
      {children}
    </InView>
  );
}

export default InViewObserver;
