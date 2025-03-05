import { login, signup } from "./actions";
import classes from "@/app/login/login.module.css";

export default function LoginPage() {
  return (
    <form className={classes.inputContainer}>
      <div className={classes.input}>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
      </div>

      <div className={classes.input}>
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
      </div>

      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
    </form>
  );
}
