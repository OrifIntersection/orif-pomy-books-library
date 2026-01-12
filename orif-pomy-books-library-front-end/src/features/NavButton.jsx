import { Link } from "react-router";

export default function NavButton({ Route, Content, ClassName }) {
  return (
    <Link className={ClassName || "navButton"} to={Route}>
      {Content}
    </Link>
  );
}
