import { Camera, LocateFixed, Send } from "lucide-react";
import { useState } from "react";
import { api, getErrorMessage } from "../services/api.js";

const initial = {
  title: "",
  reporterName: "",
  phone: "",
  description: "",
  latitude: "",
  longitude: "",
  address: ""
};

export default function ReportForm({ onCreated, showToast }) {
  const [form, setForm] = useState(initial);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported in this browser.", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6)
        }));
        showToast("GPS location captured.", "success");
      },
      () => showToast("Unable to get location. Enter coordinates manually.", "error")
    );
  }

  async function submit(event) {
    event.preventDefault();
    if (!/^[0-9]{10}$/.test(form.phone)) {
      showToast("Enter a valid 10-digit phone number.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => payload.append(key, value));
      if (image) payload.append("image", image);
      const { data } = await api.post("/reports", payload);
      onCreated(data);
      setForm(initial);
      setImage(null);
      showToast("Pothole report submitted and prioritized.", "success");
    } catch (error) {
      showToast(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="panel form-grid" onSubmit={submit}>
      <div className="panel-heading">
        <span>Citizen Report</span>
        <strong>Upload pothole proof</strong>
      </div>
      <input name="title" value={form.title} onChange={updateField} placeholder="Issue title" required />
      <div className="two-col">
        <input name="reporterName" value={form.reporterName} onChange={updateField} placeholder="Your name" required />
        <input name="phone" value={form.phone} onChange={updateField} placeholder="10-digit phone" required />
      </div>
      <textarea name="description" value={form.description} onChange={updateField} placeholder="Describe severity, traffic impact, nearby landmarks" required />
      <div className="two-col">
        <input name="latitude" value={form.latitude} onChange={updateField} placeholder="Latitude" required />
        <input name="longitude" value={form.longitude} onChange={updateField} placeholder="Longitude" required />
      </div>
      <input name="address" value={form.address} onChange={updateField} placeholder="Road name / area" required />
      <div className="action-row">
        <label className="file-picker">
          <Camera size={18} />
          {image ? image.name : "Attach image"}
          <input type="file" accept="image/*" onChange={(event) => setImage(event.target.files[0])} />
        </label>
        <button type="button" className="ghost-btn" onClick={useCurrentLocation}>
          <LocateFixed size={18} /> GPS
        </button>
      </div>
      <button className="primary-btn" disabled={loading}>
        <Send size={18} /> {loading ? "Submitting..." : "Submit report"}
      </button>
    </form>
  );
}
