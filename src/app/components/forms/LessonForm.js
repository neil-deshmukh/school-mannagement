"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  subject: z.string().min(1, { message: "Subject Name is required!" }),
  class: z.string().length(2, {message: "Class Name is required!"}),
  teacher: z.string().min(1, { message: "Teacher Name is required!" }),
});

export default function LessonForm({ type, data }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    const onSubmit = handleSubmit(data => {
        console.log(data)
    })
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new lesson</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="subject"
          defval={data?.subject}
          register={register}
          error={errors.subject}
        />
        <InputField
          label="Class"
          name="class"
          defval={data?.class}
          register={register}
          error={errors.class}
        />
        <InputField
          label="Teacher"
          name="teacher"
          defval={data?.teacher}
          register={register}
          error={errors.teacher}
        />
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type == "plus" ? "Create" : "Update"}
      </button>
    </form>
  );
}
