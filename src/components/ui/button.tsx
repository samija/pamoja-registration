import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-pamoja-lime text-pamoja-green-deep hover:bg-pamoja-lime/90 font-semibold",
  secondary:
    "bg-pamoja-orange text-white hover:bg-pamoja-orange/90 font-semibold",
  outline:
    "border border-pamoja-border text-pamoja-charcoal hover:bg-pamoja-cream",
  ghost:
    "text-pamoja-charcoal hover:bg-pamoja-charcoal/5",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-8 py-3.5 text-base rounded-lg",
};

function baseClasses(variant: Variant, size: Size, className: string) {
  return `inline-flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={baseClasses(variant, size, className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

/** ButtonLink — renders as a Next.js Link styled like a Button. Use instead of <Link><Button>. */
interface ButtonLinkProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
  download?: boolean | string;
}

export function ButtonLink({ href, variant = "primary", size = "md", className = "", children, target, rel, download }: ButtonLinkProps) {
  // External links or downloads use <a>
  if (target || download || href.startsWith("http")) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        download={download}
        className={baseClasses(variant, size, className)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={baseClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
