export type TabType = 'rsvp' | 'details' | 'schedule' | 'travel';

export type AttendanceStatus = 'accept' | 'decline';

export interface GuestRsvp {
  id: string;
  names: string;
  email: string;
  status: AttendanceStatus;
  partySize: number;
  dietary: string[];
  message: string;
  createdAt: string;
}

export interface GuestbookNote {
  id: string;
  author: string;
  location?: string;
  message: string;
  songRequest?: string;
  date: string;
}
