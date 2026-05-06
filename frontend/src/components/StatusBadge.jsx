import { severityClass } from "../utils/format.js";

export default function StatusBadge({ children, severity }) {
  return <span className={severity ? severityClass(severity) : "status-badge"}>{children}</span>;
}
