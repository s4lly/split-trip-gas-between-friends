import { createTrip } from "./actions";
import classes from "./new.module.css";

export default function TripsNew() {
  return (
    <div>
      <h2>trips - new</h2>

      <form className={classes.inputContainer}>
        <div className={classes.input}>
          <label htmlFor="name">Name:</label>
          <input id="name" name="name" type="text" required />
        </div>

        <button formAction={createTrip}>Create</button>
      </form>
    </div>
  );
}
