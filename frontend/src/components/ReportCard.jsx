import { AlertTriangle, MapPin } from "lucide-react";
import { ASSET_URL, api } from "../services/api.js";
import { formatDate } from "../utils/format.js";
import StatusBadge from "./StatusBadge.jsx";

export default function ReportCard({ report, onUpdated }) {
  const imageSrc = report.annotatedImageUrl || (report.imageUrl ? `${ASSET_URL}${report.imageUrl}` : "");

  async function updateStatus(event) {
    const { data } = await api.patch(`/reports/${report.id}/status`, { status: event.target.value });
    onUpdated(data);
  }

  return (
    <article className="report-card">
      <div className="report-media">
        {imageSrc ? (
          <img src={imageSrc} alt={report.title} />
        ) : (
          <AlertTriangle size={42} />
        )}
      </div>
      <div className="report-body">
        <div className="row-between">
          <StatusBadge severity={report.severity}>{report.severity}</StatusBadge>
          <span className="score">{report.priorityScore}</span>
        </div>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
        {report.ai && (
          <span className="muted-line">
            AI: {report.ai.detected ? "Pothole detected" : "No confident detection"} -
            {" "}{Math.round((report.ai.confidence || 0) * 100)}% - {report.ai.potholeCount || 0} region(s)
          </span>
        )}
        <span className="muted-line">
          <MapPin size={15} /> {report.address}
        </span>
        <div className="row-between report-footer">
          <small>{formatDate(report.createdAt)}</small>
          <select value={report.status} onChange={updateStatus}>
            <option>Pending</option>
            <option>Assigned</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
      </div>
    </article>
  );
}
