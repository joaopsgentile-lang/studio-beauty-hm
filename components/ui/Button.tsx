import Link from "next/link";
import clsx from "clsx";
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  outline:
    "border border-foreground/20 text-foreground hover:border-foreground/40",
  ghost: "text-foreground hover:bg-foreground/5",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none";

type Variant = keyof typeof variants;

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: Variant;
};

type NativeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: undefined;
  variant?: Variant;
};

export function Button(props: LinkProps | NativeButtonProps) {
  const { variant = "primary", className, ...rest } = props;
  const classes = clsx(baseClasses, variants[variant], className);

  if ("href" in rest && rest.href) {
    const { href, ...anchorProps } = rest as LinkProps;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {props.children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as NativeButtonProps)}>
      {props.children}
    </button>
  );
}
