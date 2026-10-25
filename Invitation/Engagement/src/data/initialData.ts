import { GuestRsvp, GuestbookNote } from '../types';

export const INITIAL_GUESTS: GuestRsvp[] = [
  {
    id: 'guest-1',
    names: 'Kasun Wickramasinghe & Dilini Silva',
    email: 'kasun.w@example.com',
    status: 'accept',
    partySize: 2,
    dietary: ['Vegetarian'],
    message: 'We are thrilled to celebrate with you both! Sending our deepest blessings for this wonderful journey.',
    createdAt: '2026-08-12T14:20:00Z'
  },
  {
    id: 'guest-2',
    names: 'Dr. Rohan & Anoma Senanayake',
    email: 'rohan.senanayake@example.com',
    status: 'accept',
    partySize: 2,
    dietary: ['Non-Vegetarian'],
    message: 'Warmest congratulations Nadun and Chathurika. May your love grow stronger each passing day.',
    createdAt: '2026-08-14T09:15:00Z'
  },
  {
    id: 'guest-3',
    names: 'Saman Jayasuriya',
    email: 'saman.j@example.com',
    status: 'accept',
    partySize: 1,
    dietary: ['Non-Vegetarian'],
    message: 'Cannot wait for the celebration and reunion at Grand Landewela!',
    createdAt: '2026-08-16T18:40:00Z'
  },
  {
    id: 'guest-4',
    names: 'Malik & Farah Fernando',
    email: 'malik.fernando@example.com',
    status: 'accept',
    partySize: 2,
    dietary: ['Non-Vegetarian'],
    message: 'So incredibly happy for you two! Looking forward to an unforgettable morning and lunch in Beliatta.',
    createdAt: '2026-08-18T11:05:00Z'
  },
  {
    id: 'guest-5',
    names: 'Kavinda & Tharushi Weerakkody',
    email: 'kavinda.w@example.com',
    status: 'decline',
    partySize: 2,
    dietary: [],
    message: 'Heartbroken we will be traveling overseas for work, but raising our glasses to you both in spirit!',
    createdAt: '2026-08-19T16:30:00Z'
  },
  {
    id: 'guest-6',
    names: 'Oshada & Natalie Peiris',
    email: 'oshada.peiris@example.com',
    status: 'accept',
    partySize: 2,
    dietary: ['Vegan'],
    message: 'Can’t wait to celebrate our favorite couple in Beliatta!',
    createdAt: '2026-08-22T20:10:00Z'
  }
];

export const INITIAL_GUESTBOOK_NOTES: GuestbookNote[] = [
  {
    id: 'note-1',
    author: 'Kasun & Dilini',
    location: 'Colombo, Sri Lanka',
    message: 'From college days to this magnificent celebration, witnessing your love unfold has been pure magic. Here’s to a lifetime of adventures together!',
    songRequest: 'Leon Bridges - Beyond',
    date: 'August 12, 2026'
  },
  {
    id: 'note-2',
    author: 'Aunty Sunethra',
    location: 'London, UK',
    message: 'Sending all our love and warmest blessings from overseas. You two bring out the absolute best in one another.',
    songRequest: 'Nat King Cole - L-O-V-E',
    date: 'August 15, 2026'
  },
  {
    id: 'note-3',
    author: 'Malik & Farah',
    location: 'Kandy, Sri Lanka',
    message: 'Nadun & Chathurika, your warmth and generosity light up every room. We cannot wait to celebrate with you at Grand Landewela.',
    songRequest: 'Earth, Wind & Fire - September',
    date: 'August 18, 2026'
  },
  {
    id: 'note-4',
    author: 'Devinda & Senali',
    location: 'Melbourne, Australia',
    message: 'Counting down the days! So excited to fly out and celebrate this unforgettable milestone with you both.',
    songRequest: 'Stevie Wonder - For Once In My Life',
    date: 'August 21, 2026'
  }
];

export interface ScheduleEvent {
  time: string;
  period: string;
  title: string;
  description: string;
  location: string;
  icon: string;
}

export const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    time: '9:00 AM',
    period: 'Morning Arrival',
    title: 'Guest Arrival & Welcome Refreshments',
    description: 'Complimentary valet and parking open at the main gates. Sip welcome tropical fresh fruit juices and iced herbal infusions upon entry into the courtyard.',
    location: 'Grand Landewela Courtyard',
    icon: 'local_bar'
  },
  {
    time: '10:05 AM',
    period: 'Auspicious Ceremony',
    title: 'Formal Betrothal & Ring Exchange',
    description: 'An intimate, auspicious ceremony celebrating our promise, family traditions, and exchange of rings surrounded by loved ones and serene lilacs.',
    location: 'The Main Celebration Pavilion',
    icon: 'favorite'
  },
  {
    time: '10:30 AM',
    period: 'Tradition & Memories',
    title: 'Traditional Tea Table & Keepsake Photographs',
    description: 'An opulent traditional Sri Lankan tea table featuring celebratory sweetmeats, hot Ceylon artisan tea, and group keepsake portrait sessions with Nadun & Chathurika.',
    location: 'Garden Verandah & Portrait Lawn',
    icon: 'photo_camera'
  },
  {
    time: '12:30 PM',
    period: 'Celebration Banquet',
    title: 'Celebratory Wedding Lunch',
    description: 'A lavish midday feast featuring authentic Southern coastal delicacies and international gourmet dishes, accompanied by champagne toasts and family speeches.',
    location: 'The Grand Banquet Hall',
    icon: 'restaurant'
  },
  {
    time: '4:00 PM',
    period: 'Grand Farewell',
    title: 'Farewell & Sparkler Send-Off',
    description: 'Warm congratulations, blessings, and an unforgettable celebration send-off honoring Nadun & Chathurika with sparkling fanfare.',
    location: 'Porte-Cochère Entrance',
    icon: 'flare'
  }
];

export interface HotelRecommendation {
  name: string;
  location: string;
  distance: string;
  description: string;
  bookingCode?: string;
  phone: string;
}

export const RECOMMENDED_HOTELS: HotelRecommendation[] = [
  {
    name: 'Anantara Peace Haven Tangalle Resort',
    location: 'Tangalle, Southern Province',
    distance: '15 mins from venue',
    description: 'Luxury 5-star oceanfront resort set on a secluded rocky outcrop with pristine golden beaches, infinity pools, and world-class dining.',
    bookingCode: 'NCENGAGE26',
    phone: '+94 47 703 6000'
  },
  {
    name: 'Buckingham Place Tangalle',
    location: 'Rekawa, Tangalle',
    distance: '18 mins from venue',
    description: 'Serene boutique sanctuary beside the Rekawa lagoon and ocean, renowned for attentive hospitality and peaceful gardens.',
    bookingCode: 'NCWEDDING26',
    phone: '+94 47 348 9447'
  },
  {
    name: 'Palm Paradise Cabanas & Beach Resort',
    location: 'Goyambokka, Tangalle',
    distance: '12 mins from venue',
    description: 'Charming beachfront cabanas surrounded by lush coconut groves and the tranquil turquoise waters of Goyambokka beach.',
    bookingCode: 'Courtesy Block Active',
    phone: '+94 47 224 0338'
  }
];
