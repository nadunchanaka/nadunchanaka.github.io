export const EVENT_DETAILS = {
  title: "Nadun & Chathurika's Engagement Celebration",
  description: "Formal celebration of Nadun & Chathurika's engagement at Grand Landewela, Beliatta. Guest arrival at 9:00 AM, followed by formal betrothal & ring exchange, traditional tea table & photoshoot, lunch banquet, and sparkler send-off.",
  location: "Grand Landewela, Beliatte - Tangalle Rd, Beliatta, Sri Lanka",
  mapsUrl: "https://maps.app.goo.gl/HjQp3Kjc7KZ1MR14A",
  startTime: "20261120T033000Z", // 9:00 AM Sri Lanka Time (+05:30) in UTC
  endTime: "20261120T103000Z",   // 4:00 PM Sri Lanka Time in UTC
  startDateFormatted: "Friday, November 20, 2026",
  timeFormatted: "9:00 AM"
};

export function getGoogleCalendarUrl(): string {
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", EVENT_DETAILS.title);
  url.searchParams.set("dates", `${EVENT_DETAILS.startTime}/${EVENT_DETAILS.endTime}`);
  url.searchParams.set("details", `${EVENT_DETAILS.description}\nLocation Map: ${EVENT_DETAILS.mapsUrl}`);
  url.searchParams.set("location", EVENT_DETAILS.location);
  return url.toString();
}

export function downloadIcsFile(): void {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Nadun and Chathurika//Engagement RSVP//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${EVENT_DETAILS.title}`,
    `DESCRIPTION:${EVENT_DETAILS.description} - Location: ${EVENT_DETAILS.mapsUrl}`,
    `LOCATION:${EVENT_DETAILS.location}`,
    `DTSTART:${EVENT_DETAILS.startTime}`,
    `DTEND:${EVENT_DETAILS.endTime}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `UID:nadun-chathurika-engagement-20261120@grandlandewela`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "Nadun_and_Chathurika_Engagement_2026.ics");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
