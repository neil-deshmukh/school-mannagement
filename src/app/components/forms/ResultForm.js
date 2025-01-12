"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";
import { createResult, updateResult } from "@/app/vars/actions";

const schema = z
  .object({
    id: z.coerce.number().optional(),
    studentId: z.string().min(1, { message: "Student is required" }),
    examId: z.union([z.string(), z.null()]),
    assignmentId: z.union([z.string(), z.null()]),
    score: z.coerce.number({ message: "Invalid Score" }).lte(100).gte(0),
  })
  .refine(
    (data) =>
    {
      if (!(data.examId != "None" && data.assignmentId != "None")) {
        if (data.examId != "None" || data.assignmentId != "None") {
          return true;
        }
        return false
      } else {
        return false
      }
      },
    {
      message: "Either examId or assignmentId must be filled",
      path: ["examId", "assignmentId"],
    }
  );

export default function ResultForm({ type, data, setOpen, relatedData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const [state, formAction] = useFormState(
    type === "plus" ? createResult : updateResult,
    { success: false, error: false }
  );
  const onSubmit = handleSubmit((datad) => {
    formAction(datad);
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Result has been ${type === "plus" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const { exams, assignments, students } = relatedData;
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new result</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Score"
          name="score"
          defval={data?.score}
          register={register}
          error={errors.score}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Exam</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("examId")}
          >
            <option value={null} selected>
              None
            </option>
            {exams.map((exam) => {
              return (
                <option
                  key={exam.id}
                  value={exam.id}
                  selected={exam.id == data?.examId}
                >
                  {exam.title}
                </option>
              );
            })}
          </select>
          {errors.examId?.message && (
            <p className="text-xs text-red-400">
              {errors.examId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Assignment</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("assignmentId")}
          >
            <option value={null} selected>
              None
            </option>
            {assignments.map((assignment) => {
              return (
                <option
                  key={assignment.id}
                  value={assignment.id}
                  selected={assignment.id == data?.assignmentId}
                >
                  {assignment.title}
                </option>
              );
            })}
          </select>
          {errors.assignmentId?.message && (
            <p className="text-xs text-red-400">
              {errors.assignmentId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Student</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("studentId")}
          >
            {students.map((student) => {
              return (
                <option
                  key={student.id}
                  value={student.id}
                  selected={student.id == data?.studentId}
                >
                  {student.name + " " + student.surname}
                </option>
              );
            })}
          </select>
          {errors.studentId?.message && (
            <p className="text-xs text-red-400">
              {errors.studentId?.message.toString()}
            </p>
          )}
        </div>
        {type == "edit" && (
          <InputField
            name="id"
            defval={data.id}
            register={register}
            error={errors.id}
            hidden
          />
        )}
      </div>
      {errors.examId?.assignmentId?.message && (
        <p className="text-xs text-red-400">
          {errors.examId.assignmentId?.message.toString()}
        </p>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type == "plus" ? "Create" : "Update"}
      </button>
    </form>
  );
}
