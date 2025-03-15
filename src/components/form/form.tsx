import React, { FC } from "react";

import classes from "./form.module.css";
// import { debounce } from "@/utils/shared";

type FormInputTextProps = {
  label: string;
  identifier: string;
};

export const FormInputText: FC<FormInputTextProps> = ({
  label,
  identifier,
}) => {
  return (
    <div className={classes.input}>
      <label htmlFor={identifier}>{label}</label>
      <input id={identifier} name={identifier} type="text" />
    </div>
  );
};

type FormProps = {
  children: React.ReactNode;
};

export const Form: FC<FormProps> = ({ children }) => {
  return <form className={classes.inputContainer}>{children}</form>;
};
