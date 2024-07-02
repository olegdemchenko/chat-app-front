import React, { useEffect, useRef, useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { ListItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Participant } from "../../../types";
import ContactAvatar from "../RoomsList/ContactAvatar";
import { Results } from "..";

type FoundResultsProps = {
  results: Results;
  onLoadMore: (page: number, successCallback: () => void) => void;
  onSelect: (user: Participant) => void;
};

function FoundResults({
  results: { users, query, count },
  onLoadMore,
  onSelect,
}: FoundResultsProps) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [page, setPage] = useState<number>(1);
  const loadingRef = useRef<boolean>(false);

  useEffect(() => {
    setPage(1);
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [query]);

  const handleScroll = (e: React.UIEvent<HTMLUListElement, UIEvent>) => {
    const hasScrollReachedBottom =
      e.currentTarget.clientHeight + e.currentTarget.scrollTop >
      e.currentTarget.scrollHeight - 20;
    if (hasScrollReachedBottom && !loadingRef.current && users.length < count) {
      loadingRef.current = true;
      onLoadMore(page, () => {
        loadingRef.current = false;
        setPage((prevPage) => prevPage + 1);
      });
    }
  };

  if (query.length === 0) {
    return null;
  }

  return (
    <List
      component="ul"
      subheader={
        <ListSubheader
          component="div"
          sx={{
            backgroundColor: "primary.main",
            color: "white",
            paddingX: 5,
          }}
          color="inherit"
        >
          {t("chat.searchResults")}
        </ListSubheader>
      }
      onScroll={handleScroll}
      sx={{ maxHeight: 200, overflow: "auto" }}
      ref={listRef}
    >
      {users.length > 0 ? (
        users.map(({ userId, name, isOnline }) => (
          <ListItem
            key={userId}
            sx={{
              paddingX: 5,
              "&.selected, &:hover": {
                backgroundColor: "primary.light",
              },
            }}
            onClick={() => {
              onSelect({ userId, name, isOnline });
            }}
          >
            <ContactAvatar isOnline={isOnline} />
            <ListItemText primary={name} sx={{ color: "white" }} />
          </ListItem>
        ))
      ) : (
        <Typography variant="body2" sx={{ paddingX: 5, color: "white" }}>
          {t("chat.noUsersFound", {
            query,
          })}
        </Typography>
      )}
    </List>
  );
}

export default FoundResults;
