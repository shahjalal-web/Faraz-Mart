"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Sunrise } from "lucide-react";
import { ADMIN_NAV_SECTIONS } from "@/lib/admin-nav";
import { cn } from "@/lib/utils";

const DEFAULT_CLASSNAME = "hidden w-64 shrink-0 flex-col border-r border-border bg-surface lg:flex";

function SectionRow({ label, enabled, isActive }: { label: string; enabled: boolean; isActive?: boolean }) {
  return (
    <span
      className={cn(
        "flex flex-1 items-center justify-between gap-2 rounded-button px-3 py-2 text-sm font-medium",
        isActive && "bg-primary/10 text-primary",
        !enabled && "text-muted-foreground/60"
      )}
    >
      {label}
      {!enabled && (
        <span className="rounded-pill bg-surface-alt px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Soon
        </span>
      )}
    </span>
  );
}

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [openSection, setOpenSection] = useState<string | null>(
    () => ADMIN_NAV_SECTIONS.find((section) => section.items?.some((item) => item.href.split("?")[0] === pathname))?.label ?? null
  );

  return (
    <aside className={className ?? DEFAULT_CLASSNAME}>
      <Link href="/admin" className="flex items-center gap-2 border-b border-border px-5 py-4">
        <span className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-[#FF6A3D] via-[#FF3D77] to-[#6D5DF6]">
          <Sunrise className="size-4 text-white" strokeWidth={2.25} />
        </span>
        <span className="font-heading text-base font-bold text-foreground">
          Faraz<span className="text-primary">Mart</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        {ADMIN_NAV_SECTIONS.map((section) => {
          const Icon = section.icon;

          if (!section.items) {
            const isActive = pathname === section.href;
            return section.enabled && section.href ? (
              <Link key={section.label} href={section.href} className="flex items-center gap-3">
                <Icon className={cn("size-4.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                <SectionRow label={section.label} enabled={section.enabled} isActive={isActive} />
              </Link>
            ) : (
              <div key={section.label} className="flex cursor-not-allowed items-center gap-3">
                <Icon className="size-4.5 shrink-0 text-muted-foreground/60" />
                <SectionRow label={section.label} enabled={section.enabled} />
              </div>
            );
          }

          const isOpen = openSection === section.label;
          return (
            <div key={section.label} className="flex flex-col">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? null : section.label)}
                className="flex items-center gap-3"
              >
                <Icon className="size-4.5 shrink-0 text-muted-foreground" />
                <span className="flex flex-1 items-center justify-between gap-2 rounded-button px-3 py-2 text-sm font-medium text-foreground">
                  {section.label}
                  <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                </span>
              </button>
              {isOpen && (
                <div className="ml-[1.625rem] flex flex-col gap-0.5 border-l border-border pl-3">
                  {section.items.map((item) =>
                    item.enabled ? (
                      <Link key={item.label} href={item.href}>
                        <SectionRow label={item.label} enabled={item.enabled} isActive={pathname === item.href.split("?")[0]} />
                      </Link>
                    ) : (
                      <div key={item.label} className="cursor-not-allowed">
                        <SectionRow label={item.label} enabled={item.enabled} />
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
