import ComplaintForm from "../components/ComplaintForm.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import TrafficAlertForm from "../components/TrafficAlertForm.jsx";
import { formatDate } from "../utils/format.js";

export default function ManagementPage({ complaints, alerts, onComplaintCreated, onAlertCreated, showToast }) {
  return (
    <div className="split-layout">
      <div className="stack">
        <ComplaintForm onCreated={onComplaintCreated} showToast={showToast} />
        <TrafficAlertForm onCreated={onAlertCreated} showToast={showToast} />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <span>Operations</span>
          <strong>Complaints and alerts</strong>
        </div>
        <div className="table-list">
          {[...complaints, ...alerts].map((item) => (
            <article key={item.id}>
              <div>
                <StatusBadge severity={item.priority || item.severity}>{item.priority || item.severity}</StatusBadge>
                <h3>{item.category || item.type}</h3>
                <p>{item.message}</p>
              </div>
              <small>{item.location || item.area} • {formatDate(item.createdAt)}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
