export function calculatePriority({ aiResult, description = "", address = "" }) {
  const text = `${description} ${address}`.toLowerCase();
  let score = 35;

  if (aiResult.detected) score += 25;
  score += Math.round((aiResult.confidence || 0) * 20);
  score += Math.min(15, (aiResult.potholeCount || 0) * 5);

  if (text.includes("accident") || text.includes("danger") || text.includes("deep")) score += 15;
  if (text.includes("traffic") || text.includes("signal") || text.includes("junction")) score += 10;
  if (text.includes("school") || text.includes("hospital") || text.includes("bus")) score += 8;
  if (text.includes("rain") || text.includes("water")) score += 5;

  const priorityScore = Math.min(99, Math.max(1, score));
  const severity = priorityScore >= 75 ? "High" : priorityScore >= 50 ? "Medium" : "Low";

  return { priorityScore, severity };
}
