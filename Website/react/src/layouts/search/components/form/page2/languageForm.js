/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MDSelect from "components/MDSelect";
import DeleteIcon from "@mui/icons-material/Delete";

const LanguageProficiencyForm = ({ pageData, formData, setFormData }) => {
  const [languages, setLanguages] = useState(formData?.languages || []);
  const [localPagedata, setlocalPagedata] = useState(pageData?.languages || []);
  const addLanguage = () => {
    setLanguages((prevLanguages) => [
      ...prevLanguages,
      {
        id: `special`,
        label: "",
        read: false,
        write: false,
        speak: false,
        listen: false,
      },
    ]);
  };
  const deleteLanguage = (id) => {
    const updatedItems = languages.filter((language) => language.id !== id);
    setLanguages(updatedItems);
    setFormData({
      ...formData,
      languages: languages.filter((language) => language.id !== id),
    });
    const filteredLanguages = pageData?.languages.filter((language) => {
      return !updatedItems.some((selected) => selected.id === language.id);
    });
    setlocalPagedata(filteredLanguages);
  };

  const handleCheckboxChange = (id, field) => {
    setFormData({
      ...formData,
      languages: languages.map((language) =>
        language.id === id ? { ...language, [field]: !language[field] } : language
      ),
    });

    setLanguages((prevLanguages) =>
      prevLanguages.map((language) =>
        language.id === id ? { ...language, [field]: !language[field] } : language
      )
    );
  };
  const updateItemValue = (newValue) => {
    if (newValue?.id === undefined) {
      return;
    }
    const updatedItems = languages.map((item) =>
      item.id === "special"
        ? {
            id: newValue.id,
            label: newValue.label,
            read: false,
            write: false,
            speak: false,
            listen: false,
          }
        : item
    );
    setLanguages(updatedItems);
    const filteredLanguages = localPagedata.filter((language) => {
      return !updatedItems.some((selected) => selected.id === language.id);
    });
    setlocalPagedata(filteredLanguages);
  };
  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={3}>Language</TableCell>
            <TableCell>Read</TableCell>
            <TableCell>Write</TableCell>
            <TableCell>Speak</TableCell>
            <TableCell>Listen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {languages.map((language, index) => (
            <TableRow key={languages[index].id}>
              <TableCell>
                <MDSelect
                  isOptionEqualToValue={(option, value) => {
                    return option.label === value.label;
                  }}
                  name="languages"
                  onChange={(event, newInputValue) => {
                    updateItemValue(newInputValue);
                  }}
                  options={localPagedata}
                  defaultValue={languages[index].label === undefined ? "" : languages[index]}
                  value={languages[index].label === undefined ? "" : languages[index]}
                  title="languages"
                ></MDSelect>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={languages[index].read}
                  onChange={() => {
                    handleCheckboxChange(languages[index].id, "read");
                  }}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={languages[index].write}
                  onChange={() => {
                    handleCheckboxChange(languages[index].id, "write");
                  }}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={languages[index].speak}
                  onChange={() => {
                    handleCheckboxChange(languages[index].id, "speak");
                  }}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={languages[index].listen}
                  onChange={() => {
                    handleCheckboxChange(languages[index].id, "listen");
                  }}
                />
              </TableCell>
              <TableCell>
                <IconButton
                  onClick={() => deleteLanguage(languages[index].id)}
                  color="secondary"
                  aria-label="Delete Language"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <IconButton onClick={addLanguage} color="primary" aria-label="Add Language">
        <AddIcon />
      </IconButton>
    </>
  );
};

export default LanguageProficiencyForm;
