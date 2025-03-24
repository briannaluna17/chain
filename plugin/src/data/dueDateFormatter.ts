import type { DueDate } from "@/data/dueDate";
import { t } from "@/i18n";
import { locale } from "@/infra/locale";
import { timezone } from "@/infra/time";

let formatStyles: Record<string, Intl.DateTimeFormatOptions> = {
  time: {
    timeStyle: "short",
  },
  weekday: {
    weekday: "long",
  },
  date: {
    month: "short",
    day: "numeric",
  },
  dateWithYear: {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
};

let formatterCache: Record<string, Intl.DateTimeFormat> = {};

let getFormatter = (style: string): Intl.DateTimeFormat => {
  if (formatterCache[style]) {
    return formatterCache[style];
  }

  formatterCache[style] = new Intl.DateTimeFormat(locale(), {
    timeZone: timezone(),
    ...formatStyles[style],
  });
  return formatterCache[style];
};

export let formatDueDate = (dueDate: DueDate): string => {
  let date = formatDate(dueDate);

  if (dueDate.hasTime()) {
    let i18n = t().dates;
    let time = dueDate.format(getFormatter("time"));

    return i18n.dateTime(date, time);
  }

  return date;
};

let formatDate = (dueDate: DueDate): string => {
  let i18n = t().dates;

  if (dueDate.isToday()) {
    return i18n.today;
  }

  if (dueDate.isTomorrow()) {
    return i18n.tomorrow;
  }

  if (dueDate.isYesterday()) {
    return i18n.yesterday;
  }

  if (dueDate.isInLastWeek()) {
    return i18n.lastWeekday(dueDate.format(getFormatter("weekday")));
  }

  if (dueDate.isInNextWeek()) {
    return dueDate.format(getFormatter("weekday"));
  }

  if (!dueDate.isCurrentYear()) {
    return dueDate.format(getFormatter("dateWithYear"));
  }

  return dueDate.format(getFormatter("date"));
};

export let formatAsHeader = (dueDate: DueDate): string => {
  let formatParts: string[] = [
    dueDate.format(getFormatter("date")),
    dueDate.format(getFormatter("weekday")),
  ];

  let i18n = t().dates;

  if (dueDate.isToday()) {
    formatParts.push(i18n.today);
  } else if (dueDate.isTomorrow()) {
    formatParts.push(i18n.tomorrow);
  }

  return formatParts.join(" ‧ ");
};
