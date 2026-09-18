import Image from "next/image";
import { initials as toInitials, cn } from "@/lib/utils";

type Props = {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
  rounded?: boolean;
};

export function Avatar({ name, src, size = 40, className, rounded = true }: Props) {
  const dim = { width: size, height: size };
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("object-cover", rounded ? "rounded-full" : "rounded-2xl", className)}
        style={dim}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center bg-brand-100 font-semibold text-brand-700",
        rounded ? "rounded-full" : "rounded-2xl",
        className
      )}
      style={{ ...dim, fontSize: size * 0.36 }}
    >
      {toInitials(name)}
    </span>
  );
}
