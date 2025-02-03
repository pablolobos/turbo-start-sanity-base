import { cn } from "@workspace/ui/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
interface CTACardProps {
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  className?: string;
}

export function CTACard({
  href,
  icon: Icon,
  title,
  description,
  className,
}: CTACardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-3xl p-8 md:p-10 transition-colors bg-accent hover:bg-accent/60",
        className,
      )}
    >
      <div className="flex flex-col space-y-2">
        <Icon className="size-10 text-muted-foreground mb-6" />
        <h3 className="text-xl font-[500]">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
