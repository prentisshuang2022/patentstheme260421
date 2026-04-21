import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { Topic } from "@/data/topics";

const yearly = [
  { year: "2020", v: 320 }, { year: "2021", v: 480 }, { year: "2022", v: 620 },
  { year: "2023", v: 780 }, { year: "2024", v: 410 }, { year: "2025", v: 250 },
];
const regions = [
  { name: "中国", value: 1420, color: "hsl(245 75% 60%)" },
  { name: "美国", value: 580, color: "hsl(280 70% 60%)" },
  { name: "日本", value: 390, color: "hsl(190 80% 55%)" },
  { name: "韩国", value: 280, color: "hsl(345 75% 60%)" },
  { name: "欧洲", value: 177, color: "hsl(152 60% 48%)" },
];
const applicants = [
  { name: "丰田自动车株式会社", v: 186, color: "hsl(245 75% 60%)" },
  { name: "三星 SDI 株式会社", v: 142, color: "hsl(280 70% 60%)" },
  { name: "宁德时代新能源", v: 128, color: "hsl(190 80% 55%)" },
  { name: "松下电器产业", v: 97, color: "hsl(245 75% 60%)" },
  { name: "比亚迪股份有限公司", v: 83, color: "hsl(280 70% 60%)" },
];
const max = Math.max(...applicants.map((a) => a.v));

export function OverviewTab({ topic }: { topic: Topic }) {
  return (
    <div className="space-y-5">
      <div className="bg-primary-soft/60 border border-primary/15 rounded-xl px-4 py-3 flex items-center gap-2.5 text-sm">
        <TrendingUp className="w-4 h-4 text-primary" />
        <span className="text-foreground/80">
          动态提醒：最近更新 <span className="font-semibold text-primary">189</span> 篇新增候选专利，新增专利类型描述
        </span>
      </div>

      <Card title="主题画像">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
          <Field label="技术目标" value="开发高离子电导率、宽电化学窗口的固态电解质" />
          <Field label="核心对象" value="硫化物、氧化物、聚合物固态电解质材料" />
          <Field label="应用场景" value="电动汽车、储能系统、便携电子设备" />
          <Field label="专题说明" value="覆盖材料合成、界面工程、制备工艺等方向" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="年度申请趋势">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                <Tooltip cursor={{ fill: "hsl(var(--accent))" }} contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", fontSize: 12 }} />
                <Bar dataKey="v" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="国家/地区分布">
          <div className="flex items-center gap-6">
            <div className="w-44 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={regions} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={2} stroke="none">
                    {regions.map((r) => <Cell key={r.name} fill={r.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {regions.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <span className="inline-flex items-center gap-2 text-foreground/80">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </span>
                  <span className="font-medium text-foreground tabular-nums">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <Card title="核心申请人 Top 排行">
        <div className="space-y-4">
          {applicants.map((a, i) => (
            <div key={a.name} className="grid grid-cols-[28px_1fr_60px] items-center gap-3">
              <div className="w-7 h-7 rounded-full text-white text-xs font-semibold flex items-center justify-center" style={{ background: a.color }}>{i + 1}</div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-foreground">{a.name}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(a.v / max) * 100}%`, background: a.color }} />
                </div>
              </div>
              <div className="text-sm font-semibold text-foreground text-right tabular-nums">{a.v}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-card p-6">
      <h3 className="text-[15px] font-semibold text-foreground mb-5">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-muted-foreground shrink-0 w-20">{label}：</span>
      <span className="text-foreground/90">{value}</span>
    </div>
  );
}
