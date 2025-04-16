import React, { useState, useEffect, useContext } from "react";
import { useDebounceValue } from "usehooks-ts";
import ProfileContext from "contexts/ProfileContext";
import SocketContext from "contexts/SocketContext";
import { Participant, Profile } from "types";
import FoundResults from "./FoundResults";
import NameInput from "./NameInput";
import { ChatEvents } from "app/constants";
import { Socket } from "socket.io-client";
import { Results } from "./types";

const initialResults: Results = {
  users: [],
  count: 0,
  query: "",
};

type SearchProps = {
  onSelect: (participant: Participant) => void;
};

function Search({ onSelect }: SearchProps) {
  const { userId } = useContext(ProfileContext) as Profile;
  const socket = useContext(SocketContext) as Socket;
  const [results, setResults] = useState<Results>(initialResults);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounceValue(query, 100);

  const handleGetResults = (query: string) => {
    if (query.length === 0) {
      setResults(initialResults);
      return;
    }
    socket.emit(
      ChatEvents.findUsers,
      { userId, query, page: 0 },
      ([users, count]: [users: Participant[], count: number]) => {
        setResults({ query, users, count });
      },
    );
  };

  const handleLoadMoreResults = (page: number, successCallback: () => void) => {
    socket.emit(
      ChatEvents.findUsers,
      { query: results.query, page, userId },
      ([foundUsers]: [users: Participant[], count: number]) => {
        setResults({
          ...results,
          users: [...results.users, ...foundUsers],
        });
        successCallback();
      },
    );
  };

  const handleClearResults = () => setResults(initialResults);

  useEffect(() => {
    handleGetResults(debouncedQuery);
  }, [debouncedQuery]);

  const handleDropQuery = () => {
    setQuery("");
    handleClearResults();
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
        onLoadMore={handleLoadMoreResults}
      />
    </>
  );
}

export default Search;
