declare namespace JSX {
  interface IntrinsicElements {
    'altcha-widget': {
      ref?: React.Ref<HTMLElement>;
      challengeurl?: string;
      hidelogo?: boolean;
      floating?: 'auto' | 'top' | 'bottom';
      style?: React.CSSProperties;
      [key: string]: string | boolean | React.Ref<HTMLElement> | React.CSSProperties | undefined;
    };
  }
}
