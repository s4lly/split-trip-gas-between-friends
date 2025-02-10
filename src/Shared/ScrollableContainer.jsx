// import { useContext } from 'react'
// import { Context } from '../Context'

const ScrollAreaRoot = ({ children }) => {
  return (
    <div
      style={{
        border: "1px solid black",
        height: 125,
        borderRadius: 4,
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {children}
    </div>
  );
};

const ScrollableContaier = ({ children }) => {
  // const { state, dispatch } = useContext(Context);

  return <ScrollAreaRoot>{children}</ScrollAreaRoot>;
};

export default ScrollableContaier;
