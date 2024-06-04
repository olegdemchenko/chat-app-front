import React, { useState, useEffect } from "react";
import { Box, Input, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import { blue } from "@mui/material/colors";
import { useDebounceValue } from "usehooks-ts";
import chatService from "../../../services/chat";
import { Participant } from "../../../types";
import SearchResults from "./SearchResults";

const searchIconStyles = {
  color: "#fff",
  width: "30px",
  height: "30px",
  transition: "color 100ms ease-in",
  ".Mui-focused &": {
    color: blue["900"],
  },
};

const searchInputStyles = {
  color: "#fff",
  padding: "10px 20px",
  bgcolor: blue["500"],
  borderRadius: "5px",
  transition: "background-color 100ms ease-in",
  "&.Mui-focused": {
    bgcolor: blue["200"],
    color: blue["900"],
  },
};

function Search() {
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<ReadonlyArray<Participant>>([]);
  const [debouncedText] = useDebounceValue(text, 100);

  const handleFocusIn = () => setIsFocused(true);
  const handleFocusOut = () => setIsFocused(false);

  useEffect(() => {
    (async () => {
      if (debouncedText.length > 0) {
        try {
          const results = (await chatService.findUsers(
            debouncedText,
          )) as ReadonlyArray<Participant>;
          console.log("search results", results);
          setFoundUsers(results);
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [debouncedText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  return (
    <Box
      component="div"
      sx={{ position: "relative", paddingY: "15px" }}
      onFocus={handleFocusIn}
      onBlur={handleFocusOut}
    >
      <Input
        fullWidth
        placeholder={t("chat.searchLabel")}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={searchIconStyles} />
          </InputAdornment>
        }
        disableUnderline
        value={text}
        onChange={handleTextChange}
        sx={searchInputStyles}
      />
      {debouncedText.length > 0 && isFocused && (
        <SearchResults results={foundUsers} />
      )}
    </Box>
  );
}

export default Search;
