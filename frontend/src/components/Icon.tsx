import type { ComponentProps } from 'react';

// Import all icon SVGs
import ClipboardIcon from '../assets/icons/clipboard.svg?react';
import LocationIcon from '../assets/icons/location.svg?react';
import EditIcon from '../assets/icons/edit.svg?react';
import NewspaperIcon from '../assets/icons/newspaper.svg?react';
import BeltIcon from '../assets/icons/belt.svg?react';
import EmailIcon from '../assets/icons/email.svg?react';
import GroupIcon from '../assets/icons/group.svg?react';
import PaymentsIcon from '../assets/icons/payments.svg?react';
import HistoryIcon from '../assets/icons/history.svg?react';
import CalendarIcon from '../assets/icons/calendar.svg?react';
import InfoIcon from '../assets/icons/info.svg?react';

const iconMap = {
  clipboard: ClipboardIcon,
  location: LocationIcon,
  edit: EditIcon,
  newspaper: NewspaperIcon,
  belt: BeltIcon,
  email: EmailIcon,
  group: GroupIcon,
  payments: PaymentsIcon,
  history: HistoryIcon,
  calendar: CalendarIcon,
  info: InfoIcon
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps extends Omit<ComponentProps<'svg'>, 'name'> {
  name: IconName;
  size?: number;
}

export const Icon = ({ name, size = 24, className = '', ...props }: IconProps) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={className}
      {...props}
    />
  );
};
