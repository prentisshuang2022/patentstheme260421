export type TopicStatus = "monitoring" | "paused";

export interface Topic {
  id: string;
  title: string;
  category: string;
  description: string;
  total: number;
  weekDelta: number;
  updatedAt: string;
  status: TopicStatus;
  tags: string[];
}

export const topics: Topic[] = [
  {
    id: "solid-electrolyte",
    title: "固态电池电解质",
    category: "新能源材料",
    description: "围绕固态电池核心电解质材料的技术专利研究，包括硫化物、氧化物和聚合物电解质",
    total: 2847,
    weekDelta: 36,
    updatedAt: "2026-04-12",
    status: "monitoring",
    tags: ["硫化物电解质", "氧化物电解质", "聚合物电解质", "固化物电解质", "复合电解质"],
  },
  {
    id: "uav-obstacle",
    title: "无人机避障技术",
    category: "智能控制",
    description: "无人机自主避障相关算法、传感器融合和路径规划技术专利",
    total: 1523,
    weekDelta: 12,
    updatedAt: "2026-04-11",
    status: "monitoring",
    tags: ["视觉避障", "激光雷达", "路径规划"],
  },
  {
    id: "multimodal-llm",
    title: "多模态大模型",
    category: "人工智能",
    description: "多模态大语言模型架构、训练方法和应用场景相关专利",
    total: 4210,
    weekDelta: 89,
    updatedAt: "2026-04-13",
    status: "monitoring",
    tags: ["视觉-语言", "对齐训练", "推理加速"],
  },
  {
    id: "mrna-vaccine",
    title: "mRNA 疫苗递送系统",
    category: "生物医药",
    description: "mRNA 疫苗脂质纳米颗粒递送载体及相关制备工艺专利",
    total: 956,
    weekDelta: 5,
    updatedAt: "2026-04-10",
    status: "paused",
    tags: ["LNP", "递送载体"],
  },
  {
    id: "perovskite-solar",
    title: "钙钛矿太阳能电池",
    category: "新能源",
    description: "钙钛矿光伏电池材料、结构设计和量产工艺专利",
    total: 3182,
    weekDelta: 28,
    updatedAt: "2026-04-12",
    status: "monitoring",
    tags: ["钙钛矿", "叠层电池", "封装工艺"],
  },
  {
    id: "autonomous-fusion",
    title: "自动驾驶感知融合",
    category: "智能驾驶",
    description: "自动驾驶多传感器感知融合算法与系统架构专利",
    total: 2105,
    weekDelta: 19,
    updatedAt: "2026-04-11",
    status: "monitoring",
    tags: ["BEV", "多传感融合", "时序建模"],
  },
];

export const getTopic = (id: string) => topics.find((t) => t.id === id);
