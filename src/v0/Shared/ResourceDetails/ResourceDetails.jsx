import { styled } from "@stitches/react";

export const ResourceDetails = ({ children }) => {
  return <div>{children}</div>;
};

// styled("div", {
//   border: "1px solid black",
//   padding: "10px",
//   display: "flex",
//   flexDirection: "column",
//   gap: "10px",
// });

export const ResourceDetail = ({ children }) => {
  return <div>{children}</div>;
};

// styled("div", {
//   display: "flex",
//   justifyContent: "space-between",
// });

export const ResourceDetailText = styled("input", {
  width: "75%",
});

export const ResourceDetailInput = styled("input", {
  width: "75%",
});
