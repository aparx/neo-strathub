"use client";
import { useSignIn, useSignOut } from "@/utils/hooks";
import { Button, ButtonProps } from "@repo/ui/components";

export interface AuthButtonProps extends Omit<ButtonProps, "onClick"> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function SignIn({
  children,
  asChild,
  color = "cta",
  appearance = "cta",
  ...restProps
}: AuthButtonProps) {
  return (
    <Button
      asChild={asChild}
      onClick={useSignIn()}
      color={color}
      appearance={appearance}
      {...restProps}
    >
      {children}
    </Button>
  );
}

export function SignOut({
  children,
  asChild,
  color = "default",
  ...restProps
}: AuthButtonProps) {
  return (
    <Button
      asChild={asChild}
      onClick={useSignOut()}
      color={color}
      {...restProps}
    >
      {children}
    </Button>
  );
}
