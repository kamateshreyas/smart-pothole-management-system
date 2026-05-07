import { Activity, AlertTriangle, ClipboardList, Gauge, MapPinned, RadioTower } from "lucide-react";
import { motion } from "framer-motion";
import MapView from "../components/MapView.jsx";
import ReportCard from "../components/ReportCard.jsx";
import StatCard from "../components/StatCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/format.js";

export default function Dashboard({ analytics, reports, complaints, alerts, onReportUpdated }) {
  return (
    <div className="dashboard-grid">
      <section className="hero">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <span className="eyebrow">RoadIQ Command Center</span>
          <h1>Detect potholes, prioritize road repairs, and keep traffic moving.</h1>
          <p>
            A single civic dashboard for image-based reporting, GPS mapping, complaint tracking,
            and traffic alerts built for a quick hackathon demo.
          </p>
        </motion.div>
        <div className="hero-panel">
          <strong>{analytics.avgPriority || 0}</strong>
          <span>Average priority score</span>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard icon={MapPinned} label="Total Reports" value={analytics.totalReports || 0} tone="mint" />
        <StatCard icon={AlertTriangle} label="High Priority" value={analytics.highPriority || 0} tone="coral" />
        <StatCard icon={RadioTower} label="Live Alerts" value={analytics.liveAlerts || 0} tone="violet" />
        <StatCard icon={Gauge} label="AI Score" value={`${analytics.avgPriority || 0}%`} tone="green" />
      </section>

      <section className="panel wide">
        <div className="panel-heading">
          <span>Live Road Intelligence</span>
          <strong>Mapped pothole reports</strong>
        </div>
        <MapView reports={reports} />
      </section>

      <section className="panel scroll-panel">
        <div className="panel-heading">
          <span>Priority Queue</span>
          <strong>Repair order</strong>
        </div>
        <div className="report-list scroll-list priority-scroll">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onUpdated={onReportUpdated} />
          ))}
        </div>
      </section>

      <section className="panel scroll-panel">
        <div className="panel-heading">
          <span>Citizen Complaints</span>
          <strong>Latest tickets</strong>
        </div>
        <div className="mini-list scroll-list compact-scroll">
          {complaints.map((item) => (
            <article key={item.id}>
              <StatusBadge severity={item.priority}>{item.priority}</StatusBadge>
              <h3>{item.category}</h3>
              <p>{item.message}</p>
              <small>{item.location}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="panel scroll-panel">
        <div className="panel-heading">
          <span>Traffic Alerts</span>
          <strong>Real-time notices</strong>
        </div>
        <div className="mini-list scroll-list compact-scroll">
          {alerts.map((item) => (
            <article key={item.id}>
              <StatusBadge severity={item.severity}>{item.severity}</StatusBadge>
              <h3>{item.area}</h3>
              <p>{item.message}</p>
              <small>{formatDate(item.createdAt)}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}