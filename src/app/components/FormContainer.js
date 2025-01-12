import prisma from "../vars/prisma";
import FormModal from "./FormModal";

export default async function FormContainer({ table, type, data, id }) {
  let relatedData = {}
    if (type != "delete") {
      switch (table) {
        case "subject":
          const subjectTeachers = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = { teachers: subjectTeachers };
          break;
        case "class":
          const classGrades = await prisma.grade.findMany({
            select: { id: true, level: true },
          });
          const classTeachers = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = { grades: classGrades, teachers: classTeachers };
          break;
        case "exam":
          const examSubjects = await prisma.subject.findMany({
            select: { id: true, name: true },
          });
          const examClasses = await prisma.class.findMany({
            select: { id: true, name: true },
          });
          const examSupervisors = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = {
            subjects: examSubjects,
            classes: examClasses,
            teachers: examSupervisors,
          };
          break;
        case "result":
          const exams = await prisma.exam.findMany({
            select: { id: true, title: true },
          });
          const assignments = await prisma.assignment.findMany({
            select: { id: true, title: true },
          });
          const students = await prisma.student.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = {
            exams: exams,
            assignments: assignments,
            students: students,
          };
          break;
        case "announcement":
          const classes = await prisma.class.findMany({
            select: { id: true, name: true },
          });
          relatedData = {
            classes,
          };
          break;
        case "event":
          const eventClasses = await prisma.class.findMany({
            select: { id: true, name: true },
          });
          relatedData = {
            classes: eventClasses,
          };
          break;
        case "assignments":
          const assignmentSubjects = await prisma.subject.findMany({
            select: { id: true, name: true },
          });
          const assignmentClasses = await prisma.class.findMany({
            select: { id: true, name: true },
          });
          const assignmentSupervisors = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = {
            subjects: assignmentSubjects,
            classes: assignmentClasses,
            teachers: assignmentSupervisors,
          };
          break;
        case "teacher":
          const teacherSubjects = await prisma.subject.findMany({
            select: { id: true, name: true },
          });
          relatedData = { subjects: teacherSubjects };
          break;
        case "student":
          const studentGrades = await prisma.grade.findMany({
            select: { id: true, level: true },
          });
          const studentClasses = await prisma.class.findMany({
            include: { _count: { select: { students: true } } },
          });
          relatedData = { grades: studentGrades, classes: studentClasses };
      }
  }
  return (
    <div>
      <FormModal table={table} type={type} data={data} id={id} relatedData={relatedData} />
    </div>
  );
}
