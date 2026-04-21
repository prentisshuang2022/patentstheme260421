import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Eye, Zap, MoreHorizontal, ChevronDown, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { topics } from "@/data/topics";
import { cn } from "@/lib/utils";
import { CreateTopicDialog } from "@/components/topic/CreateTopicDialog";
import { CATEGORY_OPTIONS } from "@/data/categories";

type StatusFilter = "all" | "monitoring" | "paused";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "全部状态" },
  { value: "monitoring", label: "监控中" },
  { value: "paused", label: "未监控" },
];

interface SingleFilterDropdownProps {
  label: string;
  value: string | null;
  options: string[];
  onChange: (v: string | null) => void;
  allLabel?: string;
}

const SingleFilterDropdown = ({ label, value, options, onChange, allLabel = "全部" }: SingleFilterDropdownProps) => {
  const active = value !== null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-10 px-4 inline-flex items-center gap-2 rounded-lg border bg-card text-sm transition-colors",
            active
              ? "border-primary/50 text-primary bg-primary-soft/40"
              : "border-border text-foreground/80 hover:border-primary/40 hover:text-foreground"
          )}
        >
          {active ? value : label}
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px] max-h-[320px] overflow-y-auto">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onChange(null)} className="flex items-center justify-between">
          {allLabel}
          {value === null && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt}
            onClick={() => onChange(opt)}
            className="flex items-center justify-between"
          >
            <span>{opt}</span>
            {value === opt && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface MultiFilterDropdownProps {
  label: string;
  values: string[];
  options: string[];
  onChange: (values: string[]) => void;
}

const MultiFilterDropdown = ({ label, values, options, onChange }: MultiFilterDropdownProps) => {
  const active = values.length > 0;
  const toggle = (opt: string) => {
    onChange(values.includes(opt) ? values.filter((v) => v !== opt) : [...values, opt]);
  };
  const display = !active
    ? label
    : values.length === 1
      ? values[0]
      : `${label} · ${values.length}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-10 px-4 inline-flex items-center gap-2 rounded-lg border bg-card text-sm transition-colors",
            active
              ? "border-primary/50 text-primary bg-primary-soft/40"
              : "border-border text-foreground/80 hover:border-primary/40 hover:text-foreground"
          )}
        >
          {display}
          <ChevronDown className="w-4 h-4 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[220px] max-h-[320px] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between text-xs text-muted-foreground font-normal">
          <span>{label}（多选）</span>
          {active && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange([]);
              }}
              className="text-primary hover:underline"
            >
              清除
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => {
          const checked = values.includes(opt);
          return (
            <DropdownMenuItem
              key={opt}
              onSelect={(e) => {
                e.preventDefault();
                toggle(opt);
              }}
              className="flex items-center justify-between gap-3"
            >
              <span className="inline-flex items-center gap-2.5">
                <span
                  className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                    checked ? "bg-primary border-primary" : "border-border"
                  )}
                >
                  {checked && <Check className="w-3 h-3 text-primary-foreground" />}
                </span>
                {opt}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function TopicLibrary() {
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [states, setStates] = useState<Record<string, boolean>>(
    Object.fromEntries(topics.map((t) => [t.id, t.status === "monitoring"]))
  );

  const tagOptions = useMemo(
    () => Array.from(new Set(topics.flatMap((t) => t.tags))),
    []
  );

  const filtered = useMemo(
    () =>
      topics.filter((t) => {
        if (query && !t.title.includes(query) && !t.category.includes(query)) return false;
        if (categoryFilter && t.category !== categoryFilter) return false;
        if (tagFilters.length > 0 && !tagFilters.some((tag) => t.tags.includes(tag))) return false;
        if (statusFilter !== "all") {
          const enabled = states[t.id];
          if (statusFilter === "monitoring" && !enabled) return false;
          if (statusFilter === "paused" && enabled) return false;
        }
        return true;
      }),
    [query, categoryFilter, tagFilters, statusFilter, states]
  );

  const statusLabel = STATUS_OPTIONS.find((s) => s.value === statusFilter)?.label ?? "状态";
  const statusActive = statusFilter !== "all";

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

        <SingleFilterDropdown
          label="专题分类"
          value={categoryFilter}
          options={CATEGORY_OPTIONS}
          onChange={setCategoryFilter}
          allLabel="全部分类"
        />
        <MultiFilterDropdown
          label="标签"
          values={tagFilters}
          options={tagOptions}
          onChange={setTagFilters}
        />

        {/* 状态下拉（固定枚举） */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "h-10 px-4 inline-flex items-center gap-2 rounded-lg border bg-card text-sm transition-colors",
                statusActive
                  ? "border-primary/50 text-primary bg-primary-soft/40"
                  : "border-border text-foreground/80 hover:border-primary/40 hover:text-foreground"
              )}
            >
              {statusActive ? statusLabel : "状态"}
              <ChevronDown className="w-4 h-4 opacity-70" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[160px]">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">状态</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setStatusFilter(opt.value)}
                className="flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-2">
                  {opt.value === "monitoring" && <Zap className="w-3.5 h-3.5 text-primary fill-primary" />}
                  {opt.value === "paused" && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />}
                  {opt.label}
                </span>
                {statusFilter === opt.value && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="lg:ml-auto">
          <Button
            onClick={() => setCreateOpen(true)}
            className="h-10 px-5 bg-gradient-primary hover:opacity-95 shadow-primary text-primary-foreground font-medium"
          >
            <Plus className="w-4 h-4" /> 新建专题库
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="text-sm text-muted-foreground">没有符合条件的专题库</p>
          <button
            onClick={() => {
              setQuery("");
              setCategoryFilter(null);
              setTagFilters([]);
              setStatusFilter("all");
            }}
            className="mt-3 text-sm text-primary hover:underline"
          >
            清除筛选
          </button>
        </div>
      ) : (
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
                    {enabled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                        <Zap className="w-3.5 h-3.5 fill-primary" />
                        监控中
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60" />
                        未监控
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
      )}

      <CreateTopicDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
