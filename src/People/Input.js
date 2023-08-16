import { useContext, useState } from 'react'
import { styled } from '@stitches/react'

import * as Label from "@radix-ui/react-label"

import { Context } from '../Context'
import { getStringOrEmpty } from '../Shared'
import { ResourceDetails, ResourceDetail, ResourceDetailInput } from "../Shared/ResourceDetails";

export const InputContainer = styled("div", {
  width: "400px",
  "> div": {
    marginBottom: "10px",
  },
})

const InputControlContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
})

const Input = () => {
  const {
    state: {
      vertices: { people: vertex },
      selectedPersonId,
      people,
    },
    dispatch,
  } = useContext(Context);

  const selectedPerson = people.find(person => person.id === selectedPersonId)

  const [name, setName] = useState(() => selectedPerson?.name ?? "")
  const [number, setNumber] = useState(() => selectedPerson?.number ?? "")
  const [paymentApp, setPaymentApp] = useState(() => selectedPerson?.paymentApp ?? "")

  const handleChangeName = (e) => {
    setName(getStringOrEmpty(e?.target?.value))
  }

  const handleChangeNumber = (e) => {
    const number = parseInt(e.target?.value, 10)

    if (Number.isNaN(number)) {
      return;
    }

    setNumber(number)
  }

  const handleChangePaymentApp = (e) => {
    setPaymentApp(getStringOrEmpty(e.target?.value))
  }

  const handleSave = () => {
    dispatch({
      type: vertex === "CREATE" ? "people:create" : "people:edit",
      // need to pass id along with all other person props so can spread rest
      payload: { id: selectedPersonId, name, number, paymentApp }
    })
    dispatch({
      type: "people:select",
      payload: { personId: undefined },
    });
    dispatch({
      type: "transition:state", payload: { vertex: { people: "START" } }
    })
  }

  const content = (
    <ResourceDetails>
      <ResourceDetail>
        <Label.Root htmlFor='name'>name:</Label.Root>
        <ResourceDetailInput disabled={vertex === "READ"} type="text" id="name" value={name} onChange={handleChangeName}></ResourceDetailInput>
      </ResourceDetail>

      <ResourceDetail>
        <Label.Root htmlFor='number'>number:</Label.Root>
        <ResourceDetailInput disabled={vertex === "READ"} type="tel" id="number" value={number} onChange={handleChangeNumber}></ResourceDetailInput>
      </ResourceDetail>

      <ResourceDetail>
        <Label.Root htmlFor='payment-app'>payment app:</Label.Root>
        <ResourceDetailInput disabled={vertex === "READ"} type="text" id="payment-app" value={paymentApp} onChange={handleChangePaymentApp}></ResourceDetailInput>
      </ResourceDetail>
    </ResourceDetails>
  )

  const handleGoBack = () => {
  }
  const handleGoEdit = () => {
  }
  const handleCancelCreate = () => {
    // TODO consider saving prev, otherwise just go back to start
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "START" } },
    });
  }
  const handleCancelEdit = () => {
    // TODO consider saving prev, otherwise just go back to start
    dispatch({
      type: "people:select",
      payload: { personId: undefined },
    });
    dispatch({
      type: "transition:state",
      payload: { vertex: { people: "START" } },
    });
  }

  let controls
  switch(vertex) {
    case "READ":
      controls = (
      <>
        <div>
          <button onClick={handleGoEdit}>edit</button>
        </div>
        <div>
          <button onClick={handleGoBack}>go back</button>
        </div>
      </>
      )
      break;

    case "CREATE":
      controls = (
      <>
        {people.length > 0 && (
        <div>
          <button onClick={handleCancelCreate}>cancel</button>
        </div>
        )}
        <div>
          <button onClick={handleSave}>save</button>
        </div>
      </>
      )
      break;

    case "EDIT":
      controls = (
      <>
        <div>
          <button onClick={handleCancelEdit}>cancel</button>
        </div>
        <div>
          <button onClick={handleSave}>save</button>
        </div>
      </>
      )
      break;

    default:
      throw new Error(`People/Input - controls - cannot apply controls for vertex: ${vertex}`)
  }

  return (
    <InputContainer>
      {content}

      <InputControlContainer>
        {controls}
      </InputControlContainer>
    </InputContainer>
  )
}

export default Input