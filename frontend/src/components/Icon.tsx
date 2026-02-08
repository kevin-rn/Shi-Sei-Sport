import type { ComponentProps } from 'react';

// Import all icon SVGs
import ClipboardIcon from '../assets/icons/clipboard.svg?react';
import LocationIcon from '../assets/icons/location.svg?react';
import EditIcon from '../assets/icons/edit.svg?react';
import NewspaperIcon from '../assets/icons/newspaper.svg?react';
import MartialArtsIcon from '../assets/icons/sports-martial-arts.svg?react';
import EmailIcon from '../assets/icons/email.svg?react';
import GroupIcon from '../assets/icons/group.svg?react';

const iconMap = {
  clipboard: ClipboardIcon,
  location: LocationIcon,
  edit: EditIcon,
  newspaper: NewspaperIcon,
  'martial-arts': MartialArtsIcon,
  email: EmailIcon,
  group: GroupIcon,
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
