/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "./itemTypes.js";
import * as React from "react";
// import AspectRatio from "@mui/material/AspectRatio";
import TimelineItem from "examples/Timeline/TimelineItem";
import api from "../../api";

import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import MDBox from "components/MDBox";
import CardMedia from "@mui/material/CardMedia";
import MDButton from "components/MDButton/index.js";
import MDAvatar from "components/MDAvatar/index.js";
const style = {
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
};
export const Container = ({ id, text, index, moveCard, fetchData, handleEdit, users }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  const onDelete = async (id) => {
    const token = localStorage.getItem("token");
    await api
      .delete(`/authority/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  };
  console.log(users);
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <TimelineItem color="success" icon="arrow_downward" title={text} badges={["design"]} />
      <MDBox display="flex">
        {users.map((user) => (
          <>
            <MDAvatar
              padding="5px"
              src={user.ProfilePictureLink}
              alt="name"
              variant="square"
              size="md"
            />
            {user.UserName}
          </>
        ))}
      </MDBox>
      <MDButton
        onClick={() => handleEdit(text, id)}
        sx={{ m: 2 }}
        variant="gradient"
        color="warning"
      >
        Edit
      </MDButton>
      <MDButton onClick={() => onDelete(id)} sx={{ m: 2 }} variant="gradient" color="error">
        delete
      </MDButton>
    </div>
  );
};
