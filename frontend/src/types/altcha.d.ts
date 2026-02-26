declare namespace JSX {
  interface IntrinsicElements {
    'altcha-widget': {
      ref?: React.Ref<HTMLElement>;
      challengeurl?: string;
      hidelogo?: boolean;
      floating?: 'auto' | 'top' | 'bottom';
      [key: string]: string | boolean | React.Ref<HTMLElement> | undefined;
    };
  }
}
