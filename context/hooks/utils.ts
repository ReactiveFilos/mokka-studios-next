type DateUI = {
  dayName: string;
  monthDayYear: string;
}

export const dateUtils = {
  // returns YYYY-MM-DD
  getCalendarDate(): string {
    const now = Date.now();
    const yearNumber = new Date(now).getFullYear();
    const monthNumber = new Date(now).getMonth() + 1;
    const dayNumber = new Date(now).getDate();
    return `${yearNumber}-${monthNumber}-${dayNumber}`;
  },

  // For created_at timestamp - returns full ISO
  getTimeStamp(): string {
    const now = Date.now();
    const result = new Date(now).toLocaleString("sv").replace(" ", "T");
    return result;
  },

  // For UI clean date
  formatDisplayDate(date: Date | string, month: "long" | "short" = "long"): DateUI {
    const parsedDate = date instanceof Date ? date : new Date(date);
    return {
      dayName: parsedDate.toLocaleDateString("en-US", { weekday: "long" }),
      monthDayYear: parsedDate.toLocaleDateString("en-US", {
        month: month,
        day: "numeric",
        year: "numeric"
      }),
    };
  },

  formatDisplayTime(date: Date | string): string {
    if (!date) return "";
    const parsedDate = date instanceof Date ? date : new Date(date);
    return parsedDate.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric"
    });
  },

  formatDisplayDateTime(date: Date | string): string {
    if (!date) return "";
    const parsedDate = date instanceof Date ? date : new Date(date);
    const dayName = parsedDate.toLocaleDateString("en-US", { weekday: "long" });
    const rest = parsedDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
    return `${dayName} ${rest}`;
  },

  isSameDay(date1: string, date2: string): boolean {
    const parsedDate1 = new Date(date1);
    const parsedDate2 = new Date(date2);
    return parsedDate1.getFullYear() === parsedDate2.getFullYear() &&
      parsedDate1.getMonth() === parsedDate2.getMonth() &&
      parsedDate1.getDate() === parsedDate2.getDate();
  },
};