"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { createAssignment, updateAssignment } from "@/app/vars/actions";

const schema = z.object({
  id: z.coerce.string().optional(),
  title: z.string().min(1, { message: "Subject Name is required!" }),
  subjectId: z.coerce.number().min(1, { message: "Subject is required" }),
  classId: z.coerce.number().min(1, { message: "Class is required" }),
  teacherId: z.string().min(1, { message: "Teacher Id is required" }),
  startDate: z.coerce.date({ message: "Date is required!" }),
  dueDate: z.coerce.date({ message: "Due Date is required!" }),
  time: z.string().regex(/\d\d:\d\d[pa]m/i),
});

export default function AssignmentForm({ type, data, setOpen, relatedData }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [state, formAction] = useFormState(
    type === "plus" ? createAssignment : updateAssignment,
    { success: false, error: false }
  );
    const onSubmit = handleSubmit(datad => {
        formAction(datad)
    })
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(
        `Subject has been ${type === "plus" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const { subjects, classes, teachers } = relatedData;
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new assignments</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Assignment Title"
          name="title"
          defval={data?.title}
          register={register}
          error={errors.title}
        />
        <InputField
          label="Date"
          name="startDate"
          type="date"
          defval={data?.startDate.toISOString().split("T")[0]}
          register={register}
          error={errors.startDate}
        />
        <InputField
          label="Due Date"
          name="dueDate"
          type="date"
          defval={data?.dueDate.toISOString().split("T")[0]}
          register={register}
          error={errors.dueDate}
        />
        <InputField
          label="Time"
          name="time"
          defval={
            data
              ? `${data?.startDate
                  .toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .split("")
                  .map((char) => {
                    if (
                      char == "a" ||
                      char == "p" ||
                      char == "m" ||
                      char == " "
                    ) {
                      return "";
                    } else {
                      return char;
                    }
                  })
                  .join("")}${data?.startDate.getHours() > 12 ? "pm" : "am"}`
              : ""
          }
          register={register}
          error={errors.time}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Subject</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("subjectId")}
          >
            {subjects.map((subject) => {
              return (
                <option
                  key={subject.id}
                  value={subject.id}
                  selected={subject.id == data?.lesson.subject.id}
                >
                  {subject.name}
                </option>
              );
            })}
          </select>
          {errors.subjectId?.message && (
            <p className="text-xs text-red-400">
              {errors.subjectId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
          >
            {classes.map((classs) => {
              return (
                <option
                  key={classs.id}
                  value={classs.id}
                  selected={classs.id == data?.lesson.class.id}
                >
                  {classs.name}
                </option>
              );
            })}
          </select>
          {errors.classId?.message && (
            <p className="text-xs text-red-400">
              {errors.classId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teacher</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
          >
            {teachers.map((teacher) => {
              return (
                <option
                  key={teacher.id}
                  value={teacher.id}
                  selected={teacher.id == data?.lesson.teacher.id}
                >
                  {teacher.name + " " + teacher.surname}
                </option>
              );
            })}
          </select>
          {errors.teacherId?.message && (
            <p className="text-xs text-red-400">
              {errors.teacherId?.message.toString()}
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
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type == "plus" ? "Create" : "Update"}
      </button>
    </form>
  );
}
