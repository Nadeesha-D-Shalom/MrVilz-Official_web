import { Link } from "react-router-dom";

/** Route links — scroll to top handled by ScrollRestoration on forward navigation only. */
export default function ScrollLink({ to, onClick, children, ...rest }) {
  return (
    <Link to={to} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}
