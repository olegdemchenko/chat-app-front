import React from "react";
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
  onSelect: (user: Participant) => void;
};

function FoundResults({
  results: { users: foundUsers, query },
  onSelect,
}: FoundResultsProps) {
  const { t } = useTranslation();

  if (query.length === 0) {
    return null;
  }

  return (
    <List
      component="ul"
      subheader={
        <ListSubheader
          component="div"
          sx={{ backgroundColor: "transparent", color: "white", paddingX: 5 }}
          color="inherit"
        >
          {t("chat.searchResults")}
        </ListSubheader>
      }
    >
      {foundUsers.length > 0 ? (
        foundUsers.map(({ userId, name, isOnline }) => (
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
