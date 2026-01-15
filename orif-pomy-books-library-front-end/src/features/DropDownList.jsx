import { useState } from "react";

export default function DropDownList({
  label,
  selectDropdown,
  listValues,
  defaultValue,
}) {
  // A dropdown list for a form that populates the select dropdown with an array of listValues
  // requires a handler for when a value is selected, and a label value

  const [selectedValue, setSelectedValue] = useState("");

  return (
    <>
      <label>
        {label} <span style={{ color: "red" }}>*</span>:{" "}
      </label>
      <select
        onChange={(e) => {
          setSelectedValue(e.target.value);
          selectDropdown(e);
        }}
        value={selectedValue}
      >
        <option value="" hidden>
          {defaultValue ? defaultValue : "--Veuillez Choisir--"}
        </option>
        {listValues.map((value) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    </>
  );
}
