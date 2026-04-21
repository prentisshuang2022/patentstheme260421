import { Search, ChevronDown, FolderPlus, Trash2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type LegalStatus = "valid" | "review" | "granted" | "expired" | "rejected";
type Source = "search" | "monitor" | "import";

interface Patent {
  title: string;
  applicant: string;
  date: string;
  country: string;
  status: LegalStatus;
  source: Source;
  tags: string[];
}

const STATUS_META: Record<LegalStatus, { label: string; className: string }> = {
  valid:    { label: "有效",   className: "bg-primary text-primary-foreground" },
  review:   { label: "审查中", className: "bg-foreground/80 text-background" },
  granted:  { label: "已授权", className: "bg-success text-success-foreground" },
  expired:  { label: "已过期", className: "bg-muted text-muted-foreground" },
  rejected: { label: "已驳回", className: "bg-destructive/15 text-destructive" },
};

const SOURCE_META: Record<Source, string> = {
  search:  "检索加入",
  monitor: "动态监控",
  import:  "手动导入",
};

const TAG_OPTIONS = [
  "硫化物电解质",
  "氧化物电解质",
  "聚合物电解质",
  "复合电解质",
  "界面工程",
  "制备工艺",
];

const patents: Patent[] = [
  { title: "一种硫化物固态电解质薄膜的制备方法", applicant: "宁德时代新能源科技股份有限公...", date: "2025-11-15", country: "CN", status: "valid",    source: "search",  tags: ["硫化物电解质", "制备工艺"] },
  { title: "聚合物基复合固态电解质及其制备方法", applicant: "比亚迪股份有限公司",                 date: "2025-09-08", country: "CN", status: "review",   source: "search",  tags: ["聚合物电解质", "复合电解质"] },
  { title: "氧化物固态电解质的烧结工艺",         applicant: "丰田自动车株式会社",                 date: "2025-09-08", country: "JP", status: "granted",  source: "search",  tags: ["氧化物电解质", "制备工艺"] },
  { title: "全固态电池界面修饰方法",             applicant: "三星 SDI 株式会社",                  date: "2025-09-08", country: "KR", status: "review",   source: "monitor", tags: ["界面工程"] },
  { title: "硫化物电解质前驱体合成路线",         applicant: "松下电器产业",                       date: "2025-09-08", country: "JP", status: "expired",  source: "monitor", tags: ["硫化物电解质"] },
  { title: "锂金属负极界面稳定化技术",           applicant: "LG 新能源",                          date: "2025-08-21", country: "KR", status: "rejected", source: "import",  tags: ["界面工程"] },
];

const STATUS_OPTIONS: LegalStatus[] = ["valid", "review", "granted", "expired", "rejected"];
const SOURCE_OPTIONS: Source[] = ["search", "monitor", "import"];

interface MultiPillProps {
  label: string;
  values: string[];
  options: { value: string; label: string }[];
  onChange: (values: string[]) => void;
}

function MultiPill({ label, values, options, onChange }: MultiPillProps) {
  const active = values.length > 0;
  const display = !active
    ? label
    : values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? values[0]
      : `${label} · ${values.length}`;
  const toggle = (v: string) =>
    onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border bg-card text-sm transition-colors",
            active
              ? "border-primary/50 text-primary bg-primary-soft/40"
              : "border-border text-foreground/80 hover:border-primary/40"
          )}
        >
          {display}
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px] max-h-[320px] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between text-xs text-muted-foreground font-normal">
          <span>{label}（多选）</span>
          {active && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange([]); }}
              className="text-primary hover:underline"
            >
              清除
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((opt) => {
          const checked = values.includes(opt.value);
          return (
            <DropdownMenuItem
              key={opt.value}
              onSelect={(e) => { e.preventDefault(); toggle(opt.value); }}
              className="flex items-center gap-2.5"
            >
              <span
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                  checked ? "bg-primary border-primary" : "border-border"
                )}
              >
                {checked && <Check className="w-3 h-3 text-primary-foreground" />}
              </span>
              <span>{opt.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface SinglePillProps {
  label: string;
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (v: string | null) => void;
  allLabel?: string;
}

function SinglePill({ label, value, options, onChange, allLabel = "全部" }: SinglePillProps) {
  const active = value !== null;
  const current = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border bg-card text-sm transition-colors",
            active
              ? "border-primary/50 text-primary bg-primary-soft/40"
              : "border-border text-foreground/80 hover:border-primary/40"
          )}
        >
          {active ? current?.label : label}
          <ChevronDown className="w-3.5 h-3.5 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[180px]">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onChange(null)} className="flex items-center justify-between">
          {allLabel}
          {value === null && <Check className="w-4 h-4 text-primary" />}
        </DropdownMenuItem>
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="flex items-center justify-between"
          >
            <span>{opt.label}</span>
            {value === opt.value && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AssetsTab() {
  const [query, setQuery] = useState("");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [selected, setSelected] = useState<number[]>([0]);

  const filtered = useMemo(() => {
    return patents
      .map((p, idx) => ({ p, idx }))
      .filter(({ p }) => {
        if (query && !p.title.includes(query) && !p.applicant.includes(query)) return false;
        if (tagFilters.length > 0 && !tagFilters.some((t) => p.tags.includes(t))) return false;
        if (statusFilters.length > 0 && !statusFilters.includes(p.status)) return false;
        if (sourceFilter && p.source !== sourceFilter) return false;
        return true;
      });
  }, [query, tagFilters, statusFilters, sourceFilter]);

  const toggle = (i: number) =>
    setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  const clearAll = () => {
    setQuery(""); setTagFilters([]); setStatusFilters([]); setSourceFilter(null);
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索标题、摘要、申请人..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        <MultiPill
          label="标签"
          values={tagFilters}
          options={TAG_OPTIONS.map((t) => ({ value: t, label: t }))}
          onChange={setTagFilters}
        />
        <MultiPill
          label="法律状态"
          values={statusFilters}
          options={STATUS_OPTIONS.map((s) => ({ value: s, label: STATUS_META[s].label }))}
          onChange={setStatusFilters}
        />
        <SinglePill
          label="来源"
          value={sourceFilter}
          options={SOURCE_OPTIONS.map((s) => ({ value: s, label: SOURCE_META[s] }))}
          onChange={setSourceFilter}
          allLabel="全部来源"
        />

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            已选 <span className="text-primary font-medium">{selected.length}</span> 项
          </span>
          <Button variant="outline" className="gap-2 h-9">
            <FolderPlus className="w-4 h-4" /> 加入工作空间
          </Button>
          <Button
            variant="outline"
            className="gap-2 h-9 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" /> 移除
          </Button>
        </div>
      </div>

      {/* 已选标签 chip 行 */}
      {(tagFilters.length > 0 || statusFilters.length > 0 || sourceFilter) && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {tagFilters.map((t) => (
            <Badge key={`t-${t}`} variant="secondary" className="rounded-md gap-1.5 bg-primary-soft text-primary font-normal">
              {t}
              <button onClick={() => setTagFilters((v) => v.filter((x) => x !== t))} className="hover:text-primary/70">×</button>
            </Badge>
          ))}
          {statusFilters.map((s) => (
            <Badge key={`s-${s}`} variant="secondary" className="rounded-md gap-1.5 bg-primary-soft text-primary font-normal">
              {STATUS_META[s as LegalStatus].label}
              <button onClick={() => setStatusFilters((v) => v.filter((x) => x !== s))} className="hover:text-primary/70">×</button>
            </Badge>
          ))}
          {sourceFilter && (
            <Badge variant="secondary" className="rounded-md gap-1.5 bg-primary-soft text-primary font-normal">
              {SOURCE_META[sourceFilter as Source]}
              <button onClick={() => setSourceFilter(null)} className="hover:text-primary/70">×</button>
            </Badge>
          )}
          <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground ml-1">
            清除全部
          </button>
        </div>
      )}

      <div className="mt-5 -mx-2">
        <div className="grid grid-cols-[40px_minmax(280px,1fr)_200px_120px_80px_120px_100px] gap-3 px-3 py-3 text-xs font-medium text-muted-foreground border-b border-border">
          <div></div><div>专利标题</div><div>申请人</div><div>日期</div><div>国家</div><div>状态</div><div>来源</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-3 py-12 text-center text-sm text-muted-foreground">
            没有符合条件的专利
          </div>
        ) : (
          filtered.map(({ p, idx }) => (
            <div
              key={idx}
              className={cn(
                "grid grid-cols-[40px_minmax(280px,1fr)_200px_120px_80px_120px_100px] gap-3 px-3 py-4 text-sm items-center border-b border-border last:border-0 hover:bg-secondary/40 transition-colors",
                selected.includes(idx) && "bg-primary-soft/40"
              )}
            >
              <Checkbox checked={selected.includes(idx)} onCheckedChange={() => toggle(idx)} />
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{p.title}</div>
                {p.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[11px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="text-muted-foreground truncate">{p.applicant}</div>
              <div className="text-muted-foreground tabular-nums">{p.date}</div>
              <div className="text-muted-foreground">{p.country}</div>
              <div>
                <span className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                  STATUS_META[p.status].className
                )}>
                  {STATUS_META[p.status].label}
                </span>
              </div>
              <div className="text-muted-foreground text-xs">{SOURCE_META[p.source]}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
        <span>
          共 <span className="text-foreground font-medium">{filtered.length}</span> 条结果
        </span>
        <div className="flex items-center gap-4">
          <button className="hover:text-foreground transition-colors">上一页</button>
          <span>第 <span className="text-foreground">1</span> / 1 页</span>
          <button className="hover:text-foreground transition-colors">下一页</button>
        </div>
      </div>
    </div>
  );
}
