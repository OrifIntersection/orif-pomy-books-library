import TextInputWithButton from "./TextInputWithButton.jsx";
import Tags from "./Tags.jsx";
import DropDownList from "./DropDownList.jsx";
import { useState } from "react";

export default function SelectWithOther({
  label,
  formName,
  formState,
  setFormState,
  listValues,
}) {
  const [isOther, setIsOther] = useState(false);
  const [otherValue, setOtherValue] = useState();

  function selectDropdown(e) {
    e.preventDefault(e);
    if (e.target.value === "-- Autre --") {
      setIsOther(true);
    } else if (formState[formName].includes(e.target.value)) {
      setIsOther(false);
      return;
    } else {
      setIsOther(false);
      setFormState((prev) => ({
        ...prev,
        [formName]: [...prev[formName], e.target.value],
      }));
    }
  }

  function deleteTag(e, value) {
    e.preventDefault();

    setFormState((prev) => ({
      ...prev,
      [formName]: prev[formName].filter((el) => el !== value),
    }));
  }

  function addCustomTag(e) {
    e.preventDefault();

    if (formState[formName].includes(otherValue)) {
      return;
    } else {
      setFormState((prev) => ({
        ...prev,
        [formName]: [...prev[formName], otherValue],
      }));
    }
  }

  return (
    <>
      <DropDownList
        label={label}
        selectDropdown={selectDropdown}
        listValues={listValues}
      />

      {isOther && (
        <TextInputWithButton
          setTempInputValue={setOtherValue}
          setInputValue={addCustomTag}
        />
      )}

      <div>
        <Tags values={formState[formName]} onDelete={deleteTag} />
      </div>
    </>
  );
}
