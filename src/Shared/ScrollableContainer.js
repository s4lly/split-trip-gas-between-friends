import { useContext, useState } from 'react'

import * as ScrollArea from '@radix-ui/react-scroll-area'
import { styled } from '@stitches/react'

import { Context } from '../Context'

const ScrollAreaRoot = styled(ScrollArea.Root, {
  border: "1px solid black",
  height: 125,
  borderRadius: 4,
  overflow: 'hidden',
  backgroundColor: 'white',
})

const ScrollableContaier = ({ children }) => {
  const { state, dispatch } = useContext(Context);

  return (
    <ScrollAreaRoot>
      <ScrollArea.Viewport className="ScrollAreaViewport">
        {children}
      </ScrollArea.Viewport>

      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="vertical"
      >
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Scrollbar
        className="ScrollAreaScrollbar"
        orientation="horizontal"
      >
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>

      <ScrollArea.Corner />
    </ScrollAreaRoot>
  );
};

export default ScrollableContaier;
