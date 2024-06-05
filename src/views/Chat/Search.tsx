import React from "react";
import { Box, Input, InputAdornment } from "@mui/material";
import { useTranslation } from "react-i18next";
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

type SearchProps = {
  text: string;
  onChange: (text: string) => void;
  onDropText: () => void;
};

function Search({ text, onChange, onDropText }: SearchProps) {
  const { t } = useTranslation();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange(e.target.value);

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
            {text.length > 0 && (
              <CloseIcon onClick={onDropText} sx={closeIconStyles} />
            )}
          </InputAdornment>
        }
        disableUnderline
        value={text}
        onChange={handleTextChange}
        sx={searchInputStyles}
      />
    </Box>
  );
}

export default Search;
