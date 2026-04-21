import { useState, KeyboardEvent } from "react";
import { Sparkles, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CreateTopicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

import { CATEGORY_OPTIONS } from "@/pages/TopicLibrary";

const CATEGORIES = CATEGORY_OPTIONS;
const REGIONS = ["中国", "美国", "日本", "韩国", "欧洲", "全球"];

const AI_RECOMMENDED_CATEGORIES = ["人工智能与数据智能", "新能源与储能", "新材料"];
const AI_EXPANDED_KEYWORDS = ["硫化物电解质", "氧化物电解质", "聚合物电解质", "界面工程", "离子电导率"];

export function CreateTopicDialog({ open, onOpenChange }: CreateTopicDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [monitoring, setMonitoring] = useState(false);

  const reset = () => {
    setName(""); setDescription(""); setCategory(""); setRegion("");
    setKeywordInput(""); setKeywords([]); setMonitoring(false);
  };

  const addKeyword = (kw?: string) => {
    const v = (kw ?? keywordInput).trim();
    if (!v) return;
    if (keywords.includes(v)) {
      toast.warning("关键词已存在");
      return;
    }
    setKeywords((k) => [...k, v]);
    setKeywordInput("");
  };

  const removeKeyword = (kw: string) => setKeywords((k) => k.filter((x) => x !== kw));

  const handleKeydown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleAiRecommendCategory = () => {
    const pick = AI_RECOMMENDED_CATEGORIES[Math.floor(Math.random() * AI_RECOMMENDED_CATEGORIES.length)];
    setCategory(pick);
    toast.success(`AI 已推荐主题分类：${pick}`);
  };

  const handleAiExpandKeywords = () => {
    if (!name.trim() && keywords.length === 0) {
      toast.warning("请先填写专题库名称或至少一个关键词");
      return;
    }
    const toAdd = AI_EXPANDED_KEYWORDS.filter((k) => !keywords.includes(k)).slice(0, 4);
    if (toAdd.length === 0) {
      toast.info("暂无更多可扩展的关键词");
      return;
    }
    setKeywords((k) => [...k, ...toAdd]);
    toast.success(`AI 已扩展 ${toAdd.length} 个关键词`);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error("请填写专题库名称");
      return;
    }
    if (keywords.length === 0) {
      toast.error("请至少添加一个核心关键词");
      return;
    }
    toast.success(`已创建专题库「${name}」`);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-[640px] p-0 gap-0 rounded-2xl overflow-hidden">
        <DialogHeader className="px-7 pt-6 pb-4 border-b border-border">
          <DialogTitle className="text-[18px] font-semibold tracking-tight">新建专题库</DialogTitle>
        </DialogHeader>

        <div className="px-7 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* 名称 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              专题库名称 <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="如：固态电池电解质"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">专题描述</Label>
            <Textarea
              placeholder="描述该专题库的研究范围和目标..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[110px] resize-none"
            />
          </div>

          {/* 分类 + 地区 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Label className="text-sm font-medium">主题分类</Label>
                <button
                  type="button"
                  onClick={handleAiRecommendCategory}
                  className="inline-flex items-center gap-1 text-[13px] font-medium bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  AI 推荐主题
                </button>
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">覆盖国家/地区</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="选择国家/地区" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 关键词 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                核心关键词 <span className="text-destructive">*</span>
              </Label>
              <button
                type="button"
                onClick={handleAiExpandKeywords}
                className="inline-flex items-center gap-1 text-[13px] font-medium bg-gradient-primary bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                AI 扩展关键词
              </button>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="输入关键词后回车"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={handleKeydown}
                className="h-11 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => addKeyword()}
                className="h-11 w-11 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-md bg-primary-soft text-primary text-[13px] font-medium animate-fade-in"
                  >
                    {kw}
                    <button
                      type="button"
                      onClick={() => removeKeyword(kw)}
                      className="w-4 h-4 inline-flex items-center justify-center rounded hover:bg-primary/20 transition-colors"
                      aria-label={`移除 ${kw}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 动态监控 */}
          <div className={cn(
            "flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/40 transition-colors",
            monitoring && "border-primary/30 bg-primary-soft/40"
          )}>
            <div>
              <div className="text-sm font-semibold text-foreground">开启动态监控</div>
              <div className="text-xs text-muted-foreground mt-1">系统将按规则定期发现最新相关专利</div>
            </div>
            <Switch checked={monitoring} onCheckedChange={setMonitoring} />
          </div>
        </div>

        <DialogFooter className="px-7 py-4 border-t border-border bg-secondary/30 sm:justify-end gap-2">
          <Button variant="outline" onClick={() => { reset(); onOpenChange(false); }}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-primary hover:opacity-95 shadow-primary text-primary-foreground"
          >
            创建专题库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
