import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import { useContext } from "react";
import { Context } from "../Context";

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
  const { state, dispatch } = useContext(Context);

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, call it to clear and reset the suggestions data
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect = (suggestion) => {
    return async () => {
      const { description, place_id } = suggestion;

      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue("", false);
      clearSuggestions();

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

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

export default GSuggestions;
