export default function TextInputWithButton({
  setTempInputValue,
  setInputValue,
}) {
  // Text input that sets a temporary input, and a final input
  // final input value is set both when the button is clicked, and when the enter key is pressed
  // e.preventDefault() is required to make sure that the form isn't accidentally sent when the enter key is pressed.

  return (
    <div>
      <input
        type="text"
        onChange={(e) => setTempInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setInputValue(e);
          }
        }}
      />
      <div className="addButton" onClick={setInputValue}>
        Ajouter
      </div>
    </div>
  );
}
