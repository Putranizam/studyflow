export const todayStr = () => new Date().toISOString().slice(0, 10);

export const isToday = (dateStr) => dateStr === todayStr();

export const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return dateStr < todayStr();
};

export const isUpcoming = (dateStr) => {
  if (!dateStr) return false;
  return dateStr > todayStr();
};

export const formatDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d - today) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff <= 7) return `In ${diff}d`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export const startOfWeek = () => {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().slice(0, 10);
};