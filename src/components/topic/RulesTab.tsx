import { useState } from "react";
import { Sparkles, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Variant = "primary" | "negative";

function Group({
  title, action, items, variant = "primary",
}: { title: string; action: string; items: string[]; variant?: Variant }) {
  const [list, setList] = useState(items);
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-foreground">{title}</h3>
        <button className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-glow transition-colors font-medium">
          <Sparkles className="w-4 h-4" /> {action}
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((t) => (
          <span key={t} className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm",
            variant === "primary" ? "bg-primary-soft text-primary" : "bg-destructive/10 text-destructive"
          )}>
            {t}
            <button onClick={() => setList((l) => l.filter((x) => x !== t))} className="opacity-60 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <Plus className="w-3.5 h-3.5" /> 添加
        </button>
      </div>
    </div>
  );
}

export function RulesTab() {
  return (
    <div className="space-y-5">
      <Group title="核心关键词" action="AI 扩展" items={["固态电解质", "固态电池", "全固态电池", "solid-state electrolyte"]} />
      <Group title="同义词/扩展词" action="AI 推荐" items={["固体电解质", "无机电解质", "solid electrolyte", "SSE"]} />
      <Group title="IPC/CPC 分类号" action="AI 推荐分类号" items={["H01M10/0562", "H01M10/0565", "C01B25/26"]} />
      <Group title="反向词" action="AI 推荐" items={["液态", "凝胶", "半固态"]} variant="negative" />

      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[15px] font-semibold text-foreground">当前检索式</h3>
          <button className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-glow transition-colors font-medium">
            <Sparkles className="w-4 h-4" /> AI 生成检索式
          </button>
        </div>
        <Textarea className="min-h-[120px] font-mono text-sm" placeholder={`("固态电解质" OR "solid electrolyte") AND ...`} />
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline">取消</Button>
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-95 shadow-primary">保存并启用</Button>
        </div>
      </div>
    </div>
  );
}
