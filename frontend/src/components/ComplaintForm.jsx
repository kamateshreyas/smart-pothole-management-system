import { Send } from "lucide-react";
import { useState } from "react";
import { api, getErrorMessage } from "../services/api.js";

const initial = { citizenName: "", category: "Road Damage", location: "", priority: "Medium", message: "" };

export default function ComplaintForm({ onCreated, showToast }) {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/complaints", form);
      onCreated(data);
      setForm(initial);
      showToast("Complaint registered successfully.", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel compact-form" onSubmit={submit}>
      <div className="panel-heading">
        <span>Complaint Desk</span>
        <strong>Track citizen issues</strong>
      </div>
      <input name="citizenName" value={form.citizenName} onChange={updateField} placeholder="Citizen name" required />
      <div className="two-col">
        <select name="category" value={form.category} onChange={updateField}>
          <option>Road Damage</option>
          <option>Traffic Signal</option>
          <option>Waterlogging</option>
          <option>Unsafe Driving Zone</option>
        </select>
        <select name="priority" value={form.priority} onChange={updateField}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <input name="location" value={form.location} onChange={updateField} placeholder="Location" required />
      <textarea name="message" value={form.message} onChange={updateField} placeholder="Complaint details" required />
      <button className="primary-btn" disabled={loading}>
        <Send size={18} /> {loading ? "Saving..." : "Add complaint"}
      </button>
    </form>
  );
}
