import { cva } from 'class-variance-authority';

export const headingVariants = cva('font-medium tracking-tight', {
  variants: {
    variant: {
      h2: 'text-3xl lg:text-4xl',
      h3: 'text-xl lg:text-2xl',
    },
  },
});

export const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-fd-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-fd-primary text-fd-primary-foreground shadow-inner shadow-fd-background/20 hover:bg-fd-primary/90',
        outline: 'border hover:bg-fd-accent hover:text-fd-accent-foreground',
        grow: 'border bg-gradient-to-t from-fd-primary/10 shadow-inner shadow-fd-primary/10 hover:bg-fd-accent/50 hover:text-fd-accent-foreground',
        secondary:
          'border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
        ghost: 'hover:bg-fd-accent hover:text-fd-accent-foreground',
        link: 'text-fd-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'p-1.5',
        sm: 'px-3 py-1.5',
        lg: 'h-11 px-6',
        xs: 'px-2 py-1.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export const cardVariants = cva(
  'rounded-2xl text-sm p-6 bg-origin-border shadow-lg',
  {
    variants: {
      variant: {
        secondary: 'bg-brand-secondary text-brand-secondary-foreground',
        default: 'border bg-fd-card',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);
