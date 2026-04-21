import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye, Zap, MoreHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { topics } from "@/data/topics";
import { cn } from "@/lib/utils";
import { CreateTopicDialog } from "@/components/topic/CreateTopicDialog";

const FilterPill = ({ label }: { label: string }) => (
  <button className="h-10 px-4 inline-flex items-center gap-2 rounded-lg border border-border bg-card text-sm text-foreground/80 hover:border-primary/40 hover:text-foreground transition-colors">
    {label}
    <ChevronDown className="w-4 h-4 text-muted-foreground" />
  </button>
);

export default function TopicLibrary() {
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(topics.map((t) => [t.id, t.status === "monitoring"]))
  );

  const filtered = useMemo(
    () => topics.filter((t) => t.title.includes(query) || t.category.includes(query)),
    [query]
  );

  return (
    <div className="space-y-7">
      <header>
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">专利专题库</h1>
        <p className="mt-1.5 text-[14px] text-muted-foreground">
          管理长期沉淀的专题专利资产、检索规则和动态监控
        </p>
      </header>

      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索主题库..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10 bg-card border-border"
          />
        </div>
        <FilterPill label="专题分类" />
        <FilterPill label="标签" />
        <FilterPill label="状态" />
        <div className="lg:ml-auto">
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-10 px-5 bg-gradient-primary hover:opacity-95 shadow-primary text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4" /> 新建专题库
          </Button>
        </div>
      </div>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((t) => {
          const enabled = states[t.id];
          return (
            <Link
              key={t.id}
              to={`/topic/${t.id}`}
              className="group block bg-card rounded-2xl border border-border p-5 shadow-card hover:shadow-card-hover hover:border-primary/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-[17px] font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t.title}
                </h3>
                <Switch
                  checked={enabled}
                  onClick={(e) => e.preventDefault()}
                  onCheckedChange={(v) => setStates((s) => ({ ...s, [t.id]: v }))}
                />
              </div>

              <Badge
                variant="secondary"
                className="mt-3 bg-secondary text-secondary-foreground/70 font-normal rounded-md"
              >
                {t.category}
              </Badge>

              <p className="mt-4 text-[13px] leading-relaxed text-muted-foreground line-clamp-2 min-h-[40px]">
                {t.description}
              </p>

              <div className="mt-5 flex items-center gap-4 text-[13px]">
                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                  <Eye className="w-4 h-4" />
                  <span className="text-foreground font-medium">{t.total.toLocaleString()}</span> 篇专利
                </span>
                <span className="text-primary font-medium">+{t.weekDelta}</span>
                <span className="text-muted-foreground">近7天</span>
              </div>

              <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">更新于 {t.updatedAt}</span>
                <div className="flex items-center gap-2">
                  {enabled && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <Zap className="w-3.5 h-3.5 fill-primary" />
                      监控中
                    </span>
                  )}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className={cn(
                      "p-1 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    )}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
