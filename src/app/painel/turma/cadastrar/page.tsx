import { getInstructorUsers } from "@/services/training-group-services";
import TrainingGroupCreateForm from "./TrainingGroupCreateForm";

export default async function CreateTrainingGroupPage() {
  const instructors = await getInstructorUsers();

  return <TrainingGroupCreateForm instructors={instructors} />;
}
