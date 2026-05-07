import {Arrowleft, BarChart3, ClipboardList, MapPinned, Menu, RadioTower, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Loader from "./components/Loader.jsx";
import Toast from "./components/Toast.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ManagementPage from "./pages/ManagementPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import { api, getErrorMessage } from "./services/api.js";
import { socket } from "./services/socket.js";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "reports", label: "Report Pothole", icon: MapPinned },
  { id: "management", label: "Management", icon: ClipboardList }
];

export default function App() {
  const [active, setActive] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [reports, setReports] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const activeTitle = useMemo(() => navItems.find((item) => item.id === active)?.label, [active]);

  function showToast(message, type = "success") {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 3200);
  }

  async function loadData() {
    setLoading(true);
    try {
      const [reportRes, complaintRes, alertRes, analyticsRes] = await Promise.all([
        api.get("/reports"),
        api.get("/complaints"),
        api.get("/traffic-alerts"),
        api.get("/analytics")
      ]);
      setReports(reportRes.data);
      setComplaints(complaintRes.data);
      setAlerts(alertRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("report:created", (report) => {
      setReports((current) => {
        if (current.some((item) => item.id === report.id)) return current;
        return [report, ...current].sort((a, b) => b.priorityScore - a.priorityScore);
      });
      loadData();
    });

    socket.on("report:updated", (report) => {
      setReports((current) => current.map((item) => (item.id === report.id ? report : item)));
      loadData();
    });

    socket.on("complaint:created", (complaint) => {
      setComplaints((current) => {
        if (current.some((item) => item.id === complaint.id)) return current;
        return [complaint, ...current];
      });
      loadData();
    });

    socket.on("traffic:created", (alert) => {
      setAlerts((current) => {
        if (current.some((item) => item.id === alert.id)) return current;
        return [alert, ...current];
      });
      loadData();
    });

    return () => {
      socket.off("report:created");
      socket.off("report:updated");
      socket.off("complaint:created");
      socket.off("traffic:created");
      socket.disconnect();
    };
  }, []);

  function addReport(report) {
    setReports((current) => [report, ...current].sort((a, b) => b.priorityScore - a.priorityScore));
    setAnalytics((current) => ({
      ...current,
      totalReports: (current.totalReports || 0) + 1,
      pendingReports: (current.pendingReports || 0) + 1,
      highPriority: report.severity === "High" ? (current.highPriority || 0) + 1 : current.highPriority || 0
    }));
  }

  function updateReport(report) {
    setReports((current) => current.map((item) => (item.id === report.id ? report : item)));
    showToast("Report status updated.", "success");
    loadData();
  }

  const page = {
    dashboard: (
      <Dashboard
        analytics={analytics}
        reports={reports}
        complaints={complaints}
        alerts={alerts}
        onReportUpdated={updateReport}
      />
    ),
    reports: (
      <ReportsPage
        reports={reports}
        onCreated={addReport}
        onUpdated={updateReport}
        showToast={showToast}
      />
    ),
    management: (
      <ManagementPage
        complaints={complaints}
        alerts={alerts}
        onComplaintCreated={(item) => setComplaints((current) => [item, ...current])}
        onAlertCreated={(item) => setAlerts((current) => [item, ...current])}
        showToast={showToast}
      />
    )
  }[active];

  return (
    <div className="app">
      <Toast toast={toast} onClose={() => setToast(null)} />
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <button className="sidebar-back-btn" onclick={()=>setMenuOpen(false)}aria-label="Close sidebar">
        <Arrowleft size={20}/>
        Back
      </button>
        <div className="brand">
          <div className="brand-mark">
            <RadioTower size={24} />
          </div>
          <div>
            <strong>City Fix</strong>
            <span>Smart road safety</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={active === item.id ? "active" : ""}
                onClick={() => {
                  setActive(item.id);
                  setMenuOpen(false);
                }}
              >
                <Icon size={19} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main>
        <header className="topbar">
          <button className="icon-btn" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div>
            <h2>{activeTitle}</h2>
          </div>
          <button className="refresh-btn" onClick={loadData}>Refresh</button>
        </header>
        {loading ? <Loader label="Syncing road intelligence" /> : page}
      </main>
    </div>
  );
}
