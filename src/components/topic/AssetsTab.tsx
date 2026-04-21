import { Search, ChevronDown, FolderPlus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Patent {
  title: string; applicant: string; date: string; country: string;
  status: "valid" | "review"; source: "search" | "monitor";
}
const patents: Patent[] = [
  { title: "一种硫化物固态电解质薄膜的制备方法", applicant: "宁德时代新能源科技股份有限公...", date: "2025-11-15", country: "CN", status: "valid", source: "search" },
  { title: "聚合物基复合固态电解质及其制备方法", applicant: "比亚迪股份有限公司", date: "2025-09-08", country: "CN", status: "review", source: "search" },
  { title: "氧化物固态电解质的烧结工艺", applicant: "丰田自动车株式会社", date: "2025-09-08", country: "JP", status: "review", source: "search" },
  { title: "全固态电池界面修饰方法", applicant: "三星 SDI 株式会社", date: "2025-09-08", country: "KR", status: "review", source: "monitor" },
  { title: "硫化物电解质前驱体合成路线", applicant: "松下电器产业", date: "2025-09-08", country: "JP", status: "review", source: "monitor" },
];

const Pill = ({ label }: { label: string }) => (
  <button className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-card text-sm text-foreground/80 hover:border-primary/40 transition-colors">
    {label} <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
  </button>
);

export function AssetsTab() {
  const [selected, setSelected] = useState<number[]>([0]);
  const toggle = (i: number) => setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="搜索标题、摘要、申请人..." className="pl-10 h-10" />
        </div>
        <Pill label="标签" /><Pill label="法律状态" /><Pill label="来源" />
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">已选 <span className="text-primary font-medium">{selected.length}</span> 项</span>
          <Button variant="outline" className="gap-2 h-9"><FolderPlus className="w-4 h-4" /> 加入工作空间</Button>
          <Button variant="outline" className="gap-2 h-9 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive">
            <Trash2 className="w-4 h-4" /> 移除
          </Button>
        </div>
      </div>

      <div className="mt-5 -mx-2">
        <div className="grid grid-cols-[40px_minmax(280px,1fr)_200px_120px_80px_120px_100px] gap-3 px-3 py-3 text-xs font-medium text-muted-foreground border-b border-border">
          <div></div><div>专利标题</div><div>申请人</div><div>日期</div><div>国家</div><div>状态</div><div>来源</div>
        </div>
        {patents.map((p, i) => (
          <div key={i} className={cn(
            "grid grid-cols-[40px_minmax(280px,1fr)_200px_120px_80px_120px_100px] gap-3 px-3 py-4 text-sm items-center border-b border-border last:border-0 hover:bg-secondary/40 transition-colors",
            selected.includes(i) && "bg-primary-soft/40"
          )}>
            <Checkbox checked={selected.includes(i)} onCheckedChange={() => toggle(i)} />
            <div className="font-medium text-foreground truncate">{p.title}</div>
            <div className="text-muted-foreground truncate">{p.applicant}</div>
            <div className="text-muted-foreground tabular-nums">{p.date}</div>
            <div className="text-muted-foreground">{p.country}</div>
            <div>
              <span className={cn(
                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
                p.status === "valid" ? "bg-primary text-primary-foreground" : "bg-foreground/80 text-background"
              )}>
                {p.status === "valid" ? "有效" : "审查中"}
              </span>
            </div>
            <div className="text-muted-foreground text-xs">{p.source === "search" ? "检索加入" : "动态监控"}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-muted-foreground">
        <span>共 <span className="text-foreground font-medium">2,847</span> 条结果</span>
        <div className="flex items-center gap-4">
          <button className="hover:text-foreground transition-colors">上一页</button>
          <span>第 <span className="text-foreground">1</span> / 285 页</span>
          <button className="hover:text-foreground transition-colors">下一页</button>
        </div>
      </div>
    </div>
  );
}
