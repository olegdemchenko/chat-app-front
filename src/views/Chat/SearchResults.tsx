import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useTranslation } from "react-i18next";
import { green, red } from "@mui/material/colors";
import { Participant } from "../../types";

type SearchResultsProps = {
  results: ReadonlyArray<Participant>;
};

function SearchResults({ results }: SearchResultsProps) {
  const { t } = useTranslation();
  return (
    <List
      sx={{
        position: "absolute",
        top: "80px",
        left: 0,
        width: "100%",
        maxHeight: "300px",
        overflow: "hidden",
        borderRadius: "5px",
        bgcolor: "background.paper",
      }}
    >
      {results.length === 0 ? (
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <HelpOutlineIcon sx={{ width: "40px", height: "40px" }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("chat.notFound")} />
        </ListItem>
      ) : (
        results.map(({ name, isOnline }, index) => (
          <>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ overflow: "visible" }}>
                  <AccountCircleIcon sx={{ width: "40px", height: "40px" }} />
                  {isOnline ? (
                    <CheckCircleIcon
                      sx={{
                        width: "20px",
                        height: "20px",
                        position: "absolute",
                        bottom: "-5px",
                        right: "-10px",
                        color: green["500"],
                      }}
                    />
                  ) : (
                    <RemoveCircleIcon
                      sx={{
                        width: "20px",
                        height: "20px",
                        position: "absolute",
                        bottom: "-5px",
                        right: "-10px",
                        color: red["500"],
                      }}
                    />
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={name} />
            </ListItem>
            {index < results.length - 1 && <Divider />}
          </>
        ))
      )}
    </List>
  );
}

export default SearchResults;
