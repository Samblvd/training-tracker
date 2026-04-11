import { PageHeading } from "@/components/page-heading";
import { HomeTrainingFocus } from "@/components/home-training-focus";

export default function HomePage() {
  return (
    <div className="grid gap-6">
      <PageHeading
        eyebrow="Today"
        title="开始今天的训练"
        description="先确认今天练什么，然后马上进入训练中模式。统计、历史和分析都退到后面。"
      />

      <HomeTrainingFocus />
    </div>
  );
}
