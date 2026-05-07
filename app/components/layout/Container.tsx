import type { ComponentPropsWithoutRef } from "react";

import { cn } from "~/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div">;

const Container = ({ className, ...props }: ContainerProps) => (
  <div className={cn("mx-auto w-full max-w-5xl px-5 sm:px-6 lg:px-8", className)} {...props} />
);

export { Container };
