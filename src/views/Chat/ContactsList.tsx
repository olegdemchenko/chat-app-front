import React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Participant } from "../../types";
import { Avatar, ListItem, Typography } from "@mui/material";

type ContactsListProps = {
  header: string;
  contacts: readonly Participant[];
  emptyListPlaceholder: string;
};

const statusIconStyles = {
  position: "absolute",
  bottom: "-5px",
  right: "-5px",
  backgroundColor: "white",
  clipPath: "circle(35% at 50% 50%)",
};

function ContactsList({
  header,
  contacts,
  emptyListPlaceholder,
}: ContactsListProps) {
  return (
    <List
      component="ul"
      subheader={
        <ListSubheader
          component="div"
          sx={{ backgroundColor: "transparent", color: "white", paddingX: 5 }}
          color="inherit"
        >
          {header}
        </ListSubheader>
      }
    >
      {contacts.length > 0 ? (
        contacts.map(({ userId, name, isOnline }) => (
          <ListItem
            key={userId}
            sx={{
              paddingX: 5,
              "&:hover": {
                backgroundColor: "primary.light",
              },
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ overflow: "visible" }}>
                <AccountCircleIcon />
                {isOnline ? (
                  <CheckCircleIcon
                    sx={statusIconStyles}
                    fontSize="small"
                    color="success"
                  />
                ) : (
                  <RemoveCircleIcon
                    sx={statusIconStyles}
                    fontSize="small"
                    color="error"
                  />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={name} sx={{ color: "white" }} />
          </ListItem>
        ))
      ) : (
        <Typography variant="body2" sx={{ paddingX: 5, color: "white" }}>
          {emptyListPlaceholder}
        </Typography>
      )}
    </List>
  );
}

export default ContactsList;
