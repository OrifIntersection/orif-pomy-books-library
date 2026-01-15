import DropDownList from "./DropDownList";
import { useState } from "react";

export default function SingleSelectWithOther({
  label,
  formName,
  listValues,
  formState,
  setFormState,
}) {
  const [isOther, setIsOther] = useState(false);

  function selectDropdown(e) {
    e.preventDefault(e);
    if (e.target.value === "-- Autre --") {
      setIsOther(true);
    } else {
      setIsOther(false);
      setFormState((prev) => ({
        ...prev,
        [formName]: e.target.value,
      }));
    }
  }

  return (
    <>
      <DropDownList
        label={label}
        selectDropdown={selectDropdown}
        listValues={listValues}
        defaultValue={formState && formState[formName]}
      />

      {isOther && (
        <input
          type="text"
          onChange={(e) =>
            setFormState((prev) => ({
              ...prev,
              [formName]: e.target.value,
            }))
          }
        />
      )}
    </>
  );
}
