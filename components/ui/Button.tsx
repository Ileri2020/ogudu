import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex-row items-center justify-center gap-2 active:opacity-70',
  {
    variants: {
      variant: {
        default: 'bg-accent shadow-sm',
        destructive: 'bg-red-500 shadow-sm',
        outline: 'border-2 border-accent bg-transparent',
        secondary: 'bg-gray-100',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
      },
      size: {
        default: 'h-12 px-8',
        sm: 'h-9 px-4',
        lg: 'h-16 px-10',
        icon: 'h-12 w-12 p-0',
      },
      rounded: {
        default: 'rounded-xl',
        full: 'rounded-full',
        none: 'rounded-none',
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: 'full',
    },
  }
);

const textVariants = cva('font-bold text-center', {
  variants: {
    variant: {
      default: 'text-white',
      destructive: 'text-white',
      outline: 'text-accent',
      secondary: 'text-gray-900',
      ghost: 'text-gray-900',
      link: 'text-accent underline',
    },
    size: {
      default: 'text-base',
      sm: 'text-xs',
      lg: 'text-xl',
      icon: 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children?: React.ReactNode;
  textClassName?: string;
}

const Button = ({
  className,
  variant,
  size,
  rounded,
  loading,
  children,
  textClassName,
  ...props
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={cn(buttonVariants({ variant, size, rounded, className }), loading && 'opacity-50')}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} />
      ) : (
        typeof children === 'string' ? (
          <Text className={cn(textVariants({ variant, size }), textClassName)}>
            {children}
          </Text>
        ) : (
          children
        )
      )}
    </TouchableOpacity>
  );
};

export { Button, buttonVariants };
