import React, { useEffect, useState } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import { ListItem, Typography, ListItemAvatar, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Participant } from "../../../types";
import ContactAvatar from "../../../components/ContactAvatar";
import ScrollableList from "../../../components/ScrollableList";
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
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setPage(1);
  }, [query]);

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
    >
      {users.length > 0 ? (
        <Box component="div" sx={{ height: 160 }}>
          <ScrollableList
            direction="bottom"
            elements={users.map(({ userId, name, isOnline }) => (
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
                <ListItemAvatar>
                  <ContactAvatar isOnline={isOnline} />
                </ListItemAvatar>
                <ListItemText primary={name} sx={{ color: "white" }} />
              </ListItem>
            ))}
            onReachEnd={() =>
              onLoadMore(page, () => {
                setPage((prevPage) => prevPage + 1);
              })
            }
            isListExausted={users.length === count}
          />
        </Box>
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
