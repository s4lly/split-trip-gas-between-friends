import { useState } from "react";

import App from "./App.tsx";
import SignUp from "./SignUp.tsx";
import LogIn from "./LogIn.tsx";

import classes from "./Root.module.css";

type Tabs = "home" | "signup" | "login";

const Root = () => {
  const [tab, setTab] = useState<Tabs>("login");

  return (
    <div>
      <nav>
        <ul className={classes.nav}>
          <li tabIndex={0} onClick={() => setTab("home")}>
            home
          </li>
          <li tabIndex={0} onClick={() => setTab("signup")}>
            signup
          </li>
          <li tabIndex={0} onClick={() => setTab("login")}>
            login
          </li>
        </ul>
      </nav>

      {tab === "home" && <App />}
      {tab === "signup" && <SignUp />}
      {tab === "login" && <LogIn />}
    </div>
  );
};

export default Root;
