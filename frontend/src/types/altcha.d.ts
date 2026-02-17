declare namespace JSX {
  interface IntrinsicElements {
    'altcha-widget': {
      ref?: React.Ref<any>;
      challengeurl?: string;
      hidelogo?: boolean;
      floating?: 'auto' | 'top' | 'bottom';
      [key: string]: any;
    };
  }
}
