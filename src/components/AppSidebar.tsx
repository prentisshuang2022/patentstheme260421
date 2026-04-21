import { NavLink, useLocation } from "react-router-dom";
import { Search, MessageSquarePlus, Bookmark, Library, Boxes, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/search", label: "智能检索", icon: Search },
  { to: "/new-chat", label: "创建新对话", icon: MessageSquarePlus },
  { to: "/subscriptions", label: "我的订阅", icon: Bookmark },
  { to: "/", label: "专利专题库", icon: Library, match: ["/", "/topic"] },
  { to: "/workspace", label: "专利工作空间", icon: Boxes },
  { to: "/history", label: "历史对话", icon: History },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="px-5 py-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-primary">
          <Sparkles className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
        </div>
        <span className="font-semibold text-[15px] text-sidebar-foreground tracking-tight">
          AI 专利创新空间
        </span>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ to, label, icon: Icon, match }) => {
          const isActive = match
            ? match.some((m) => (m === "/" ? pathname === "/" || pathname.startsWith("/topic") : pathname.startsWith(m)))
            : pathname === to;
          return (
            <NavLink
              key={label}
              to={to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="px-5 py-4 text-xs text-muted-foreground">
        武汉数为科技有限公司
      </div>
    </aside>
  );
}
