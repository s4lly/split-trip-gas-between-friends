import classes from "./ScrollableContainer.module.css";

const ScrollAreaRoot = ({ children }) => {
  return <div className={classes.container}>{children}</div>;
};

const ScrollableContaier = ({ children }) => {
  return <ScrollAreaRoot>{children}</ScrollAreaRoot>;
};

export default ScrollableContaier;
