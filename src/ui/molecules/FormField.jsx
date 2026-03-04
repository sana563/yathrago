import React from "react";
import Input from "../atoms/Input";
import Texts from "../atoms/Texts";

const FormField = ({ label, type, placeholder, name, value, onChange, required = true }) => (
  <div className="mb-6 w-full">
    <Texts type="label">{label}</Texts>
    <Input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default FormField;
