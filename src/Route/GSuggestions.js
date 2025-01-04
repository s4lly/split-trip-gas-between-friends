import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useContext } from "react";
import { Context } from "../Context";

const Suggestions = ({ suggestions, handleClearInput }) => {
  const { dispatch } = useContext(Context);

  if (!Array.isArray(suggestions)) {
    return <></>;
  }

  const handleSelect = (suggestion) => {
    return async () => {
      const { description, place_id } = suggestion;

      handleClearInput();

      // Get latitude and longitude via utility functions
      const results = await getGeocode({ address: description });
      const { lat, lng } = getLatLng(results[0]);

      console.log("📍 Coordinates: ", { lat, lng });

      dispatch({
        type: "stops:list:add",
        payload: { name: description, gMapsData: { place_id, lat, lng } },
      });
    };
  };

  return (
    <ul>
      {suggestions.map(
        ({
          description,
          place_id,
          structured_formatting: { main_text, secondary_text },
        }) => (
          <li key={place_id} onClick={handleSelect({ description, place_id })}>
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </li>
        )
      )}
    </ul>
  );
};

const GSuggestions = () => {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const outsideElementRef = useOnclickOutside(() => {
    // When user clicks outside of the component, call it to clear and reset the suggestions data
    clearSuggestions();
  });

  const handleClearInput = () => {
    // When user selects a place, we can replace the keyword without request
    // data from API by setting the second parameter to "false"
    setValue("", false);
    clearSuggestions();
  };

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  return (
    <div ref={outsideElementRef}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />

      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && (
        <Suggestions suggestions={data} handleClearInput={handleClearInput} />
      )}
    </div>
  );
};

export default GSuggestions;
