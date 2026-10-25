export interface WeddingPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  location: string;
  date: string;
  order: number;
}

// Default romantic titles & captions for gallery photos
const PHOTO_METADATA: Record<number, { title: string; caption: string; location: string }> = {
  1: {
    title: 'Road Trips & Joyful Smiles',
    caption: 'Finding pure happiness in life’s spontaneous journeys, hand in hand.',
    location: 'Southern Expressway, Sri Lanka'
  },
  2: {
    title: 'Shaded Sunshine & Laughter',
    caption: 'Under the summer leaves, with hearts full of laughter and gentle joy.',
    location: 'Southern Province, Sri Lanka'
  },
  3: {
    title: 'Sunshine & Togetherness',
    caption: 'Every step of this journey is sweeter because we walk it side by side.',
    location: 'Scenic Southern Coast'
  },
  4: {
    title: 'A Promise for a Lifetime',
    caption: 'Two souls, one beautiful tomorrow—ready to celebrate forever.',
    location: 'Beliatta & Beyond'
  }
};

/**
 * SINGLE FOLDER SOURCE OF TRUTH:
 * All wedding photos live in wedding-photos/ in the wedding project directory.
 */
const photoModules = import.meta.glob<{ default: string }>(
  '../../wedding-photos/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true }
);

/**
 * 1. COUPLE PHOTO LOADER (RSVP PAGE & ENVELOPE)
 * Strictly loads ONLY couple.jpg (or couple.jpeg/png/webp) from wedding-photos/.
 * Does NOT use numbered images (1.jpg, 2.jpg) as the main photo.
 * If couple.jpg is missing, returns null so UI renders the fallback message/placeholder.
 */
export function getCouplePhotoUrl(): string | null {
  for (const [filePath, module] of Object.entries(photoModules)) {
    const filename = filePath.split('/').pop()?.toLowerCase() || '';
    if (filename.startsWith('couple.')) {
      return module.default;
    }
  }
  return null;
}

/**
 * 2. WEDDING ALBUM PHOTOS LOADER (CAROUSEL & LIGHTBOX)
 * Automatically loads every numbered image (1.jpg, 2.jpg, 3.jpg, ...) from wedding-photos/.
 * STRICTLY EXCLUDES couple.jpg so it only appears on the RSVP main section.
 * Automatically sorts by number (1, 2, 3, 4, 5, 10, etc.) without editing code!
 */
export function getWeddingPhotos(): WeddingPhoto[] {
  const photoMap = new Map<number, { url: string; order: number; filename: string }>();

  for (const [filePath, module] of Object.entries(photoModules)) {
    const filename = filePath.split('/').pop() || '';
    const baseName = filename.toLowerCase();

    // STRICTLY EXCLUDE couple photo and readme
    if (baseName.startsWith('couple') || baseName.startsWith('readme')) {
      continue;
    }

    // Must be a numbered image: 1.jpg, 2.jpg, 3.jpg, etc.
    const numMatch = filename.match(/^(\d+)\./);
    if (!numMatch) {
      continue;
    }

    const order = parseInt(numMatch[1], 10);
    photoMap.set(order, {
      url: module.default,
      order,
      filename
    });
  }

  const sortedList = Array.from(photoMap.values()).sort((a, b) => a.order - b.order);

  return sortedList.map((item, index) => {
    const num = item.order;
    const meta = PHOTO_METADATA[num] || {
      title: `Treasured Moment #${num}`,
      caption: 'Cherishing every beautiful step of our journey together.',
      location: 'Grand Landewela & Southern Coast'
    };

    return {
      id: `wedding-photo-${num}-${index}`,
      url: item.url,
      title: meta.title,
      caption: meta.caption,
      location: meta.location,
      date: '2026',
      order: num
    };
  });
}
