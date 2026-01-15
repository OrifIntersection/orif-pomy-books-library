import Cross from "../styles/icons/cross";

export default function Tags({ values, onDelete }) {
  // Tag buttons that can be deleted onClick via the onDelete prop
  // the value simply represents the rendered name of the tag

  const tags = values.map((tag) => (
    <div
      key={tag}
      className="selectionButton"
      onClick={(e) => onDelete(e, tag)}
    >
      {tag} <Cross />
    </div>
  ));

  return tags;
}
