import { useState } from "react";

function useThrowOnRender() {
  const [error, setError] = useState<Error | null>(null);
  if (error) {
    throw error;
  }
  return setError;
}

export default useThrowOnRender;
