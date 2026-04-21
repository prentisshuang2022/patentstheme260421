import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Edit3, FolderPlus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTopic } from "@/data/topics";
import { OverviewTab } from "@/components/topic/OverviewTab";
import { AssetsTab } from "@/components/topic/AssetsTab";
import { RulesTab } from "@/components/topic/RulesTab";
import { TagsTab } from "@/components/topic/TagsTab";

export default function TopicDetail() {
  const { id = "" } = useParams();
  const topic = getTopic(id);
  const [monitoring, setMonitoring] = useState(true);

  if (!topic) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">未找到该专题库</p>
        <Link to="/" className="text-primary mt-4 inline-block">返回</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> 返回专题库
      </Link>

      {/* 头部卡片 */}
      <div className="bg-card rounded-2xl border border-border shadow-card p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-[26px] font-semibold tracking-tight text-foreground">{topic.title}</h1>
              <Badge variant="secondary" className="rounded-md font-normal">{topic.category}</Badge>
              {monitoring && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary-soft text-primary text-xs font-medium">
                  <Zap className="w-3.5 h-3.5 fill-primary" /> 监控中
                </span>
              )}
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-3xl">{topic.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" className="gap-2"><Edit3 className="w-4 h-4" /> 编辑专题</Button>
            <Button variant="outline" className="gap-2"><FolderPlus className="w-4 h-4" /> 创建工作空间</Button>
            <div className="flex items-center gap-2 pl-3 border-l border-border ml-1">
              <span className="text-sm text-muted-foreground">动态监测</span>
              <Switch checked={monitoring} onCheckedChange={setMonitoring} />
            </div>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-3 gap-4 max-w-2xl">
          <Stat value={topic.total.toLocaleString()} label="专利总数" />
          <Stat value={`+${topic.weekDelta}`} label="近一周新增" accent="success" />
          <Stat value="156/1343" label="核心申请人/专利申请人" />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-5">
        <div className="bg-card rounded-2xl border border-border shadow-card px-2">
          <TabsList className="bg-transparent h-14 p-0 gap-2">
            {[
              { v: "overview", l: "概览" },
              { v: "assets", l: "专利资产" },
              { v: "rules", l: "检索规则" },
              { v: "tags", l: "标签" },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="relative h-14 px-5 rounded-none bg-transparent text-[15px] text-muted-foreground data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:font-semibold after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 data-[state=active]:after:w-8 after:bg-primary after:rounded-full after:transition-all"
              >
                {t.l}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="mt-0"><OverviewTab topic={topic} /></TabsContent>
        <TabsContent value="assets" className="mt-0"><AssetsTab /></TabsContent>
        <TabsContent value="rules" className="mt-0"><RulesTab /></TabsContent>
        <TabsContent value="tags" className="mt-0"><TagsTab tags={topic.tags} /></TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ value, label, accent }: { value: string; label: string; accent?: "success" }) {
  return (
    <div>
      <div className={accent === "success" ? "text-[32px] font-semibold text-success" : "text-[32px] font-semibold text-foreground"}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
