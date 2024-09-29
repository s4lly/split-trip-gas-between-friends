import { styled } from "@stitches/react";

const Container = styled("div", {
  marginLeft: "10px",
  padding: "5px",
});

const Stop = ({ stop }) => {
  return <Container>{stop.name}</Container>;
};

export default Stop;
