/* eslint-disable react/prop-types */

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { createFilterOptions } from "@mui/material/Autocomplete";

export default function CountrySelect({
  image,
  isOptionEqualToValue,
  options,
  title,
  name,
  onChange,
  defaultValue,
  onInputChange,
}) {
  const filterOptions = createFilterOptions({
    matchFrom: "start",
    stringify: (option) => option.label,
  });

  function isObjEmpty(obj) {
    if (obj === undefined) {
      return null;
    }

    return Object.keys(obj).length === 0;
  }
  return (
    <Autocomplete
      onChange={onChange}
      onInputChange={onInputChange}
      key={name}
      isOptionEqualToValue={isOptionEqualToValue}
      id={`country-select-${name}`}
      sx={{ width: 300 }}
      options={options}
      autoHighlight
      defaultValue={isObjEmpty(defaultValue) ? null : defaultValue}
      name={name}
      filterOptions={filterOptions}
      getOptionLabel={(option) => (option.label ? option.label : "")}
      renderOption={(props, option) => (
        <Box
          key={option.id}
          component="li"
          sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
          name={name}
          {...props}
        >
          {image === true && (
            <img
              name={name}
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.id.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.id.toLowerCase()}.png 2x`}
              alt=""
            />
          )}
          {option.label} {image === true && `(${option.id})`}
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          name={name}
          {...params}
          label={`Choose a ${title}`}
          inputProps={{
            ...params.inputProps,
            autoComplete: "new-password", // disable autocomplete and autofill
          }}
        />
      )}
    />
  );
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
