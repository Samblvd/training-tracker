import { PageHeading } from "@/components/page-heading";
import { WorkoutSessionView } from "@/components/workout-session-view";

export default function WorkoutPage() {
  return (
    <div className="grid gap-6">
      <PageHeading eyebrow="Workout" title="训练中" description="只关注当前动作、当前组和休息节奏，完成后会自动沉淀到历史记录。" />
      <WorkoutSessionView />
    </div>
  );
}
