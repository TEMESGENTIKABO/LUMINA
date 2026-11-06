import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      <Icon size={32} className="text-obsidian-grey/30 mx-auto mb-4" />
      <p className="font-headline-en text-lg text-obsidian-grey">{title}</p>
      {description && <p className="font-ui text-sm text-obsidian-grey/60 mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
