import React, { FC } from "react";

type FormInputTextProps = {
  label: string;
  identifier: string;
};

export const FormInputText: FC<FormInputTextProps> = ({
  label,
  identifier,
}) => {
  return (
    <div>
      <label
        htmlFor={identifier}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        id={identifier}
        name={identifier}
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      />
    </div>
  );
};
