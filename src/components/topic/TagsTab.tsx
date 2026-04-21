import { useState } from "react";
import { Tag, Plus, X } from "lucide-react";

export function TagsTab({ tags }: { tags: string[] }) {
  const [list, setList] = useState(tags);
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">为专题库内专利建立统一标签语言，支持筛选和聚类分析</p>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Tag className="w-4 h-4 text-foreground" />
          <span className="text-[15px] font-semibold text-foreground">专题库标签</span>
          <span className="text-sm text-muted-foreground">({list.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {list.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-primary-soft text-primary">
              {t}
              <button onClick={() => setList((l) => l.filter((x) => x !== t))} className="opacity-60 hover:opacity-100">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
            <Plus className="w-3.5 h-3.5" /> 添加标签
          </button>
        </div>
      </div>
    </div>
  );
}
