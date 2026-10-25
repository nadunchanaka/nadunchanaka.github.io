import type { LucideProps } from 'lucide-react';
import {
  ArrowRight,
  Calendar,
  CalendarPlus,
  Camera,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardList,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileDown,
  Flower2,
  Gift,
  Hand,
  Heart,
  Info,
  Lock,
  LockOpen,
  LogOut,
  Mail,
  MailCheck,
  MapPin,
  Maximize,
  Menu,
  Music,
  Navigation,
  NotebookPen,
  ParkingCircle,
  PartyPopper,
  Pause,
  Plane,
  Play,
  RotateCcw,
  ScrollText,
  Search,
  Shirt,
  Table,
  TrainFront,
  ExternalLink,
  X,
  ShieldCheck,
  Flower,
  Map,
  User,
  CheckCheck,
  Loader2,
  RefreshCw,
  CloudCheck,
} from 'lucide-react';

const ICON_MAP = {
  favorite: Heart,
  favorite_border: Heart,
  location_on: MapPin,
  navigation: Navigation,
  directions: Navigation,
  near_me: Navigation,
  map: Map,
  person: User,
  done_all: CheckCheck,
  progress_activity: Loader2,
  info: Info,
  check: Check,
  close: X,
  arrow_forward: ArrowRight,
  celebration: PartyPopper,
  calendar_add_on: CalendarPlus,
  expand_more: ChevronDown,
  event: Calendar,
  download: Download,
  filter_vintage: Flower2,
  touch_app: Hand,
  local_florist: Flower,
  replay: RotateCcw,
  pause: Pause,
  play_arrow: Play,
  fullscreen: Maximize,
  chevron_left: ChevronLeft,
  chevron_right: ChevronRight,
  open_in_new: ExternalLink,
  local_parking: ParkingCircle,
  directions_car: Car,
  train: TrainFront,
  flight: Plane,
  file_download: FileDown,
  search: Search,
  pin_drop: MapPin,
  calendar_today: Calendar,
  schedule: Clock,
  mark_email_read: MailCheck,
  mail: Mail,
  list_alt: ClipboardList,
  logout: LogOut,
  lock: Lock,
  menu: Menu,
  edit_note: NotebookPen,
  music_note: Music,
  checkroom: Shirt,
  photo_camera: Camera,
  card_giftcard: Gift,
  history_edu: ScrollText,
  admin_panel_settings: ShieldCheck,
  visibility: Eye,
  visibility_off: EyeOff,
  error: CircleAlert,
  lock_open: LockOpen,
  verified_user: ShieldCheck,
  table_chart: Table,
  sync: RefreshCw,
  refresh: RefreshCw,
  cloud_done: CloudCheck,
} as const;

export type IconName = keyof typeof ICON_MAP;

type IconProps = {
  name: IconName;
  className?: string;
  size?: number | string;
  strokeWidth?: number;
  fill?: string;
  absoluteStrokeWidth?: boolean;
} & Omit<LucideProps, 'ref'>;

/** Tree-shaken Lucide icon mapped from Material Symbols names. */
export function Icon({
  name,
  className,
  size = '1em',
  strokeWidth = 1.75,
  fill,
  ...rest
}: IconProps) {
  const Cmp = ICON_MAP[name];
  const resolvedFill =
    fill ??
    (name === 'favorite'
      ? 'currentColor'
      : name === 'filter_vintage'
        ? 'currentColor'
        : 'none');

  return (
    <Cmp
      className={className}
      size={size}
      strokeWidth={strokeWidth}
      fill={resolvedFill}
      aria-hidden
      {...rest}
    />
  );
}
