/* eslint-disable react/prop-types */
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import update from "immutability-helper";
import { useCallback, useEffect, useState } from "react";
import { Container } from "./card.js";
import TimelineList from "examples/Timeline/TimelineList";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";
import api from "../../api";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDButton from "components/MDButton/index.js";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MDSnackbar from "components/MDSnackbar/index.js";
import { MenuItem, Select } from "@mui/material";

const style = {
  width: 400,
};
export const AllContainer = ({ fillter, tabid }) => {
  {
    useEffect(() => {
      fetchData();
    }, []);

    async function fetchData() {
      const token = localStorage.getItem("token");
      await api
        .get(`/authority/${fillter}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log(response.data);
          setCards(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
      await api
        .get(`/users/type/Provider`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }
    const [errorSB, setErrorSB] = useState(false);
    const [message, setMessage] = useState("");
    const openErrorSB = () => setErrorSB(true);
    const closeErrorSB = () => setErrorSB(false);
    const [successSB, setSuccessSB] = useState(false);
    const openSuccessSB = () => setSuccessSB(true);
    const closeSuccessSB = () => setSuccessSB(false);
    const [cards, setCards] = useState([]);
    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);
    const renderErrorSB = (
      <MDSnackbar
        color="error"
        icon="warning"
        title="Publice Finance Budget Manager"
        content={message}
        dateTime="Now"
        open={errorSB}
        onClose={closeErrorSB}
        close={closeErrorSB}
        bgWhite
      />
    );
    const renderSuccessSB = (
      <MDSnackbar
        color="success"
        icon="right"
        title="Publice Finance Budget Manager"
        content={message}
        dateTime="Now"
        open={successSB}
        onClose={closeSuccessSB}
        close={closeSuccessSB}
        bgWhite
      />
    );
    const renderCard = useCallback((card, index) => {
      return (
        <Container
          key={card.AuthorityID}
          index={index}
          id={card.AuthorityID}
          text={card.AuthorityName}
          users={card.child}
          moveCard={moveCard}
          fetchData={fetchData}
          handleEdit={handleEditOpen}
        />
      );
    }, []);
    const [open, setOpen] = useState(false);
    const [editer, setEditor] = useState(false);
    const [editerid, setEditorid] = useState("");
    const [inputText, setInputText] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState("");
    const handleClickOpen = () => {
      setSelectedUsers("");
      setInputText("");
      setEditor(false);
      setEditorid("");
      setOpen(true);
    };
    const handleEditOpen = (text, id) => {
      setEditor(true);
      setSelectedUsers("");
      setInputText(text);
      setEditorid(id);
      setOpen(true);
    };
    const handleClose = () => {
      setInputText("");
      setOpen(false);
      setEditor(false);
    };

    const handleTextChange = (event) => {
      setInputText(event.target.value);
    };

    const handleSubmit = async () => {
      const token = localStorage.getItem("token");
      await api
        .post(
          `/authority/`,
          {
            BudgetTypeID: tabid,
            AuthorityName: inputText,
            selectedUsers: selectedUsers,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setMessage(response.data.message);
          openSuccessSB(true);
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setMessage(error.response.data.error);
          openErrorSB(true);
        });

      // Close the modal
      setOpen(false);
    };
    const handleEditSubmit = async () => {
      const token = localStorage.getItem("token");
      await api
        .put(
          `/authority/${editerid}`,
          {
            AuthorityName: inputText,
            selectedUsers: selectedUsers,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setMessage(response.data.message);
          openSuccessSB(true);
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setMessage(error.response.data.error);
          openErrorSB(true);
        });

      setOpen(false);
    };
    const handleOrderingSubmit = async () => {
      const token = localStorage.getItem("token");
      await api
        .put(
          `/authority/ordering/`,
          {
            cards,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setMessage(response.data.message);
          openSuccessSB(true);
          fetchData();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
          setMessage(error.response.data.error);
          openErrorSB(true);
        });
    };

    return (
      <>
        {renderErrorSB}
        {renderSuccessSB}
        <MDButton onClick={handleClickOpen} sx={{ m: 2 }} variant="gradient" color="success">
          Create New
        </MDButton>
        <MDButton onClick={handleOrderingSubmit} sx={{ m: 2 }} variant="gradient" color="success">
          Save Hierarchy
        </MDButton>
        <TimelineList fetchData={fetchData} title={`${fillter} Budgets`}>
          {cards.map((card, i) => renderCard(card, i))}
        </TimelineList>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Create a new Position</DialogTitle>
          <DialogContent>
            <TextField
              label="Name The Position"
              variant="outlined"
              fullWidth
              value={inputText}
              onChange={handleTextChange}
            />
            <Select
              label="Users"
              name="Users"
              value={selectedUsers}
              onChange={(value) => setSelectedUsers(value.target.value)}
            >
              {users.map((user) => (
                <MenuItem value={user.UserID} key={user.UserID}>
                  {user.Username}
                </MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={editer ? handleEditSubmit : handleSubmit} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
};
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function DragOrder() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <DndProvider backend={HTML5Backend}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Normal Budget" {...a11yProps(0)} />
            <Tab label="Capital Budget" {...a11yProps(1)} />
            <Tab label="Emergency Budget" {...a11yProps(2)} />
            <Tab label="Internal Budget" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <AllContainer fillter={"Normal"} tabid={1} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <AllContainer fillter={"Capital"} tabid={2} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <AllContainer fillter={"Emergency"} tabid={3} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          <AllContainer fillter={"Internal"} tabid={4} />
        </CustomTabPanel>
      </DndProvider>
      <Footer />
    </DashboardLayout>
  );
}
export default DragOrder;
