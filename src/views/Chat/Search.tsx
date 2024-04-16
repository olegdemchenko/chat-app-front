import React, { useState, useEffect } from "react";
import { Box, Input, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import SearchIcon from "@mui/icons-material/Search";
import { blue } from "@mui/material/colors";
import { useDebounceValue } from "usehooks-ts";
import chatService from "../../services/chat";
import { Participant } from "../../types";
import SearchResults from "./SearchResults";

function Search() {
  const { t } = useTranslation();
  const [text, setText] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState<ReadonlyArray<Participant>>([]);
  const [debouncedText] = useDebounceValue(text, 100);

  useEffect(() => {
    (async () => {
      if (debouncedText.length > 0) {
        try {
          const results = (await chatService.findUsers(
            debouncedText,
          )) as ReadonlyArray<Participant>;
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
    <Box component="div" sx={{ position: "relative", paddingY: "15px" }}>
      <Input
        fullWidth
        placeholder={t("chat.searchLabel")}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon
              sx={{
                color: "#fff",
                width: "30px",
                height: "30px",
                transition: "color 100ms ease-in",
                ".Mui-focused &": {
                  color: blue["900"],
                },
              }}
            />
          </InputAdornment>
        }
        disableUnderline
        value={text}
        onChange={handleTextChange}
        sx={{
          color: "#fff",
          padding: "10px 20px",
          bgcolor: blue["500"],
          borderRadius: "5px",
          transition: "background-color 100ms ease-in",
          "&.Mui-focused": {
            bgcolor: blue["200"],
            color: blue["900"],
          },
        }}
      />
      {debouncedText.length > 0 && <SearchResults results={foundUsers} />}
    </Box>
  );
}

export default Search;
