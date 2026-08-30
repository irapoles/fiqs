import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

/**
 * Gold is the action colour and nothing else — guide §03, 8% of the surface.
 * If a screen reads gold-first, there is a second primary on it that shouldn't be.
 *
 * No shadows on any variant: elevation is carried by the surface stack, and a
 * cast shadow here would be the one object on the page lit from outside it.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "bg-gold text-graphite hover:bg-[#E7C263]",
  secondary:
    "text-paper border border-[rgba(255,255,255,0.14)] bg-surface-2 hover:bg-surface-3 hover:border-[rgba(255,255,255,0.24)]",
  ghost: "text-mist hover:text-paper",
};

const BASE =
  "pressable hitbox inline-flex items-center justify-center gap-2 rounded-[var(--radius-small)] text-[0.875rem] font-medium leading-none";

const PADDING: Record<Variant, string> = {
  primary: "px-[1.375rem] py-[0.875rem]",
  secondary: "px-[1.375rem] py-[0.875rem]",
  ghost: "px-2 py-[0.875rem]",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & ComponentProps<"button">) {
  return (
    <button
      className={`${BASE} ${PADDING[variant]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  href,
  ...props
}: { variant?: Variant; children: ReactNode; href: string } & Omit<
  ComponentProps<typeof Link>,
  "href"
>) {
  return (
    <Link
      href={href}
      className={`${BASE} ${PADDING[variant]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
