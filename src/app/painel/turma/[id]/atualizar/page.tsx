import TrainingGroupEditForm from "./TrainingGroupEditForm";
import { getTrainingGroupById, getInstructorUsers } from "@/services/training-group-services";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let trainingGroup = null;
  let instructors = [];

  try {
    [trainingGroup, instructors] = await Promise.all([
      getTrainingGroupById(id),
      getInstructorUsers(),
    ]);
  } catch (err) {
    console.error("[Page] error loading data:", err);
  }

  if (!trainingGroup) {
    return (
      <div className="my-6 mx-6">Turma não encontrada.</div>
    );
  }

  // Serialize dates to strings for client props
  const serializedGroup = {
    id: trainingGroup.id,
    studentCapacity: trainingGroup.studentCapacity,
    instructorId: trainingGroup.instructorId,
    instructor: trainingGroup.instructor ? { id: trainingGroup.instructor.id, name: trainingGroup.instructor.name } : null,
    schedules: trainingGroup.schedules.map((s) => ({ id: s.id, dayOfWeek: s.dayOfWeek, startTime: s.startTime.toISOString() })),
  };

  return <TrainingGroupEditForm trainingGroup={serializedGroup} instructors={instructors} />;
}