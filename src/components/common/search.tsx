import { Search } from "@mui/icons-material";
import {
  FormControl,
  FormControlOwnProps,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useState } from "react";

interface CommonSearchProps {
  size?: FormControlOwnProps["size"];
  onChange: (keyword: string) => void;
}

export const CommonSearch = ({ onChange, ...props }: CommonSearchProps) => {
  const [keyword, setKeyword] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newKeyword = event.target.value;
    setKeyword(newKeyword);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      onChange(newKeyword);
    }, 500); // Adjust the delay as needed

    setTimeoutId(newTimeoutId);
  };

  return (
    <FormControl size={props.size}>
      <InputLabel htmlFor="search-keyword">Search</InputLabel>
      <OutlinedInput
        id="search-keyword"
        endAdornment={
          <InputAdornment position="end">
            <Search />
          </InputAdornment>
        }
        label="Keyword"
        onChange={handleInputChange}
      />
    </FormControl>
  );
};
