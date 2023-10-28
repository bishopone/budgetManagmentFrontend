/* eslint-disable react/prop-types */
import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  card: {
    maxWidth: 300,
    margin: "auto",
  },
  media: {
    height: 200,
  },
});

function IDCard({ name, phoneNumber, age, gender, imageSrch, imageSrcl }) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={imageSrch} title="ID Card" loading="lazy" />
      <CardContent>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Phone: {phoneNumber}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Age: {age}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Gender: {gender}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default IDCard;
