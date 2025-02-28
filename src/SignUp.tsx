import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";

import classes from "./Auth.module.css";

import supabase from "./utils/supabase";
import { isBlank } from "./Shared/Utils";

export default function AuthApp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  console.log(session);

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSignUpClick = async () => {
    if ([email, password].some(isBlank)) {
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/",
      },
    });

    console.log("data: ", data, "error: ", error);

    setSession(session);
  };

  if (!session) {
    return (
      <div className={classes.inputContainer}>
        <h1>SignUp</h1>

        <div className={classes.input}>
          <label className={classes.inputLabel} htmlFor="email">
            email
          </label>
          <input
            className={classes.inputBox}
            value={email}
            onChange={onEmailChange}
            id="email"
            type="tel"
          />
        </div>

        <div className={classes.input}>
          <label className={classes.inputLabel} htmlFor="password">
            password
          </label>
          <input
            className={classes.inputBox}
            value={password}
            onChange={onPasswordChange}
            id="password"
            type="password"
          />
        </div>

        <div className={classes.inputButton}>
          <button onClick={onSignUpClick}>sign up</button>
        </div>
      </div>
    );
  } else {
    return <div>Logged in!</div>;
  }
}
