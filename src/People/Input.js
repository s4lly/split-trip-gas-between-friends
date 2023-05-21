import { useState } from 'react'
import { styled } from '@stitches/react'

import * as Label from "@radix-ui/react-label"

const Container = styled("div", {

})

/*

name:

number:

payment app:

*/

const Input = () => {
  const [name, setName] = useState()
  const [number, setNumber] = useState()
  const [paymentApp, setPaymentApp] = useState()

  const handleChangeName = () => {}
  const handleChangeNumber = () => {}
  const handleChangePaymentApp = () => {}

  return (
    <Container>
      <div>
        <Label.Root htmlFor='name'>
          name:
        </Label.Root>
        <input type="text" id="name" value={name} onChange={handleChangeName}></input>
      </div>
      <div>
        <Label.Root htmlFor='number'>
          number:
        </Label.Root>
        <input type="tel" id="number" value={number} onChange={handleChangeNumber}></input>
      </div>
      <div>
        <Label.Root htmlFor='payment-app'>
          payment app:
        </Label.Root>
        <input type="text" id="payment-app" value={paymentApp} onChange={handleChangePaymentApp}></input>
      </div>
    </Container>
  )
}

export default Input