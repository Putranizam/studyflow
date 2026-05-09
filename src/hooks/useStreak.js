import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { todayStr } from "../utils/date";

export function useStreak(tasks) {
  const [streak, setStreak] = useLocalStorage("sf_streak", {
    count: 0,
    lastActiveDate: null,
  });

  useEffect(() => {
    const today = todayStr();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const completedToday = tasks.some(
      (t) => t.done && t.completedAt?.slice(0, 10) === today
    );

    if (!completedToday) return;

    if (streak.lastActiveDate === today) return; // already counted today

    if (streak.lastActiveDate === yesterdayStr) {
      setStreak({ count: streak.count + 1, lastActiveDate: today });
    } else if (streak.lastActiveDate !== today) {
      setStreak({ count: 1, lastActiveDate: today });
    }
  }, [tasks]);

  return streak.count;
}