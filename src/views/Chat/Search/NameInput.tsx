import React, { useState, useEffect } from "react";
import { Box, Input, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDebounceValue } from "usehooks-ts";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { blue } from "@mui/material/colors";

const iconStyles = {
  color: "#fff",
  width: "30px",
  height: "30px",
  ".Mui-focused &": {
    color: blue["900"],
  },
};

const searchIconStyles = {
  ...iconStyles,
  transition: "color 100ms ease-in",
};

const closeIconStyles = {
  ...iconStyles,
  cursor: "pointer",
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

type NameInputProps = {
  query: string;
  onEnter: (text: string) => void;
  onDrop: () => void;
};

function NameInput({ query, onEnter, onDrop }: NameInputProps) {
  const { t } = useTranslation();
  // const [text, setText] = useState(initialText);
  // const [debouncedText] = useDebounceValue(text, 100);

  // useEffect(() => {
  //   onEnter(debouncedText);
  // }, [debouncedText]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onEnter(e.target.value);

  // const handleDrop = () => {
  //   setText("");
  //   onDrop();
  // };

  return (
    <Box
      component="div"
      sx={{ position: "relative", paddingY: "15px", paddingX: 5 }}
    >
      <Input
        fullWidth
        placeholder={t("chat.searchLabel")}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon sx={searchIconStyles} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            {query.length > 0 && (
              <CloseIcon onClick={onDrop} sx={closeIconStyles} />
            )}
          </InputAdornment>
        }
        disableUnderline
        value={query}
        onChange={handleTextChange}
        sx={searchInputStyles}
      />
    </Box>
  );
}

export default NameInput;
