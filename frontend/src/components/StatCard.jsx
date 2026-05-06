import { motion } from "framer-motion";

export default function StatCard({ icon: Icon, label, value, tone }) {
  return (
    <motion.article className={`stat-card ${tone}`} whileHover={{ y: -4 }}>
      <div className="stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
      </div>
    </motion.article>
  );
}
