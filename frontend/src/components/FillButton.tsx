import { useState } from 'react';
import { Link } from 'react-router-dom';

type BaseProps = {
  className?: string;
  children: React.ReactNode;
  download?: boolean;
  'aria-label'?: string;
  onClick?: (e: React.MouseEvent) => void;
  pressedClass?: string;
};

type AnchorProps = BaseProps & { href: string; target?: string; rel?: string; to?: never; as?: never };
type LinkProps = BaseProps & { to: string; href?: never; target?: never; rel?: never; as?: never };
type ButtonProps = BaseProps & { as: 'button'; type?: 'button' | 'submit'; disabled?: boolean; href?: never; to?: never };

type FillButtonProps = AnchorProps | LinkProps | ButtonProps;

export const FillButton = (props: FillButtonProps) => {
  const [pressed, setPressed] = useState(false);

  const pressedClass = props.pressedClass ?? 'download-button-fill--pressed';

  const isDisabled = 'disabled' in props && props.disabled;

  const pressHandlers = {
    onMouseDown: () => { if (!isDisabled) setPressed(true); },
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
  };

  const className = `${props.className ?? ''}${pressed ? ` ${pressedClass}` : ''}`;

  if ('to' in props && props.to) {
    const { to, className: _cls, children, pressedClass: _pc, ...rest } = props as LinkProps & { pressedClass?: string };
    return (
      <Link to={to} className={className} {...pressHandlers} {...rest}>
        {children}
      </Link>
    );
  }

  if ('as' in props && props.as === 'button') {
    const { as: _as, className: _cls, children, pressedClass: _pc, ...rest } = props as ButtonProps & { pressedClass?: string };
    return (
      <button className={className} {...pressHandlers} {...rest}>
        {children}
      </button>
    );
  }

  const { href, className: _cls, children, pressedClass: _pc, ...rest } = props as AnchorProps & { pressedClass?: string };
  return (
    <a href={href} className={className} {...pressHandlers} {...rest}>
      {children}
    </a>
  );
};
