import { RadioTower } from "lucide-react";
import { useState } from "react";
import { api, getErrorMessage } from "../services/api.js";

const initial = { area: "", type: "Heavy Congestion", severity: "Medium", message: "" };

export default function TrafficAlertForm({ onCreated, showToast }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/traffic-alerts", form);
      onCreated(data);
      setForm(initial);
      showToast("Traffic alert published.", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel compact-form" onSubmit={submit}>
      <div className="panel-heading">
        <span>Traffic Control</span>
        <strong>Broadcast live alert</strong>
      </div>
      <input name="area" value={form.area} onChange={updateField} placeholder="Area / junction" required />
      <div className="two-col">
        <select name="type" value={form.type} onChange={updateField}>
          <option>Heavy Congestion</option>
          <option>Road Work</option>
          <option>Accident Risk</option>
          <option>Suggested Diversion</option>
        </select>
        <select name="severity" value={form.severity} onChange={updateField}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <textarea name="message" value={form.message} onChange={updateField} placeholder="Alert message" required />
      <button className="primary-btn" disabled={loading}>
        <RadioTower size={18} /> {loading ? "Publishing..." : "Publish alert"}
      </button>
    </form>
  );
}
