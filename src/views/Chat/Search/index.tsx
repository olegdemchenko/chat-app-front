import React, { useState, useEffect } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Results } from "..";
import { Participant } from "../../../types";
import FoundResults from "./FoundResults";
import NameInput from "./NameInput";

type SearchProps = {
  results: Results;
  onSubmit: (query: string) => void;
  onLoadMore: (page: number, successCallback: () => void) => void;
  onClear: () => void;
  onSelect: (participant: Participant) => void;
};

function Search({
  results,
  onSubmit,
  onLoadMore,
  onClear,
  onSelect,
}: SearchProps) {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounceValue(query, 100);

  useEffect(() => {
    onSubmit(debouncedQuery);
  }, [debouncedQuery]);

  const handleDropQuery = () => {
    setQuery("");
    onClear();
  };

  const handleSelect = (user: Participant) => {
    onSelect(user);
    handleDropQuery();
  };

  return (
    <>
      <NameInput query={query} onEnter={setQuery} onDrop={handleDropQuery} />
      <FoundResults
        results={results}
        onSelect={handleSelect}
        onLoadMore={onLoadMore}
      />
    </>
  );
}

export default Search;
