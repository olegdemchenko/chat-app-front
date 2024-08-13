import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

type ScrollableListProps = {
  direction: "top" | "bottom";
  elements: Array<React.JSX.Element>;
  isListExausted: boolean;
  onReachEnd: () => void;
};

function ScrollableList({
  elements,
  direction,
  isListExausted,
  onReachEnd,
}: ScrollableListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current && direction === "top") {
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      let isLoading = false;

      const onScroll = () => {
        const container = containerRef.current as HTMLDivElement;
        const isEndReached =
          direction === "bottom"
            ? container.clientHeight + container.scrollTop ===
              container.scrollHeight
            : container.scrollTop === 0;
        if (!isEndReached || isLoading || isListExausted) {
          return;
        }
        isLoading = true;
        onReachEnd();
      };

      containerRef.current.addEventListener("scroll", onScroll);

      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener("scroll", onScroll);
        }
      };
    }
  }, [elements, isListExausted]);

  return (
    <Box
      component="div"
      ref={containerRef}
      sx={{ height: "100%", overflowY: "auto" }}
    >
      {elements}
    </Box>
  );
}

export default ScrollableList;
