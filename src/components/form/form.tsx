import React, { FC } from "react";

type FormProps = {
  children: React.ReactNode;
};

export const Form: FC<FormProps> = ({ children }) => {
  return <form className="flex flex-col gap-3 p-1">{children}</form>;
};
