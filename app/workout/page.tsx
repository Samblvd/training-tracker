import { PageHeading } from "@/components/page-heading";
import { WorkoutSessionView } from "@/components/workout-session-view";

export default function WorkoutPage() {
  return (
    <div className="grid gap-4 md:gap-6">
      <PageHeading eyebrow="Workout" title="训练助手" description="只看当前动作、当前组和倒计时。把今天的训练顺顺地做完。" />
      <WorkoutSessionView />
    </div>
  );
}
