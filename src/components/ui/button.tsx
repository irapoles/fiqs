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
  /* Dark fill inside a lit gold rule — see `.btn-lit`. Gold moves from the
     fill to the edge, which spends less of the 8% budget than a solid block
     while still marking this as the one action on the surface. */
  primary: "btn-lit text-paper hover:text-sand",
  secondary:
    "text-paper border border-[rgba(255,255,255,0.14)] bg-surface-2 hover:bg-surface-3 hover:border-[rgba(255,255,255,0.24)]",
  ghost: "text-mist hover:text-paper",
};

/* Buttons are pills. A deliberate departure from the guide's two-radius
   vocabulary (16px cards, 6px controls), which still governs every other
   control — inputs, chips, cards and the range pills inside the product
   surfaces all keep 6px. Ghost is included so its focus ring shares the
   shape, even though it carries no fill of its own. */
const RADIUS: Record<Variant, string> = {
  primary: "rounded-full",
  secondary: "rounded-full",
  ghost: "rounded-full",
};

const BASE =
  "pressable hitbox inline-flex items-center justify-center gap-2 text-[0.875rem] font-medium leading-none";

const PADDING: Record<Variant, string> = {
  primary: "px-[1.625rem] py-[0.875rem]",
  secondary: "px-[1.625rem] py-[0.875rem]",
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
      className={`${BASE} ${RADIUS[variant]} ${PADDING[variant]} ${VARIANTS[variant]} ${className}`}
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
      className={`${BASE} ${RADIUS[variant]} ${PADDING[variant]} ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
