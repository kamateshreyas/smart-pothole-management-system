import ReportForm from "../components/ReportForm.jsx";
import ReportCard from "../components/ReportCard.jsx";

export default function ReportsPage({ reports, onCreated, onUpdated, showToast }) {
  return (
    <div className="split-layout">
      <ReportForm onCreated={onCreated} showToast={showToast} />
      <section className="panel">
        <div className="panel-heading">
          <span>Reports</span>
          <strong>All pothole submissions</strong>
        </div>
        <div className="report-list">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onUpdated={onUpdated} />
          ))}
        </div>
      </section>
    </div>
  );
}
