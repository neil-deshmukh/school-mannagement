"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { useFormState } from "react-dom";
import { createClass, updateClass } from "@/app/vars/actions";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const schema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Class Name is required!" }),
  capacity: z.coerce.number().min({ message: "Capacity is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade Name is required" }),
  supervisorId: z.coerce.string().optional()
});

export default function ClassForm({ type, data, setOpen, relatedData }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [state, formAction] = useFormState(
    type === "plus" ? createClass : updateClass,
    { success: false, error: false }
  );
  const onSubmit = handleSubmit(datad => {
    console.log(datad)
    formAction(datad)
  })
  const router = useRouter()
  useEffect(() => {
    if (state.success) {
      toast.success(
        `Class has been ${type === "plus" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const {teachers, grades} = relatedData 
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type == "plus" ? "Create a new class" : "Update a class"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Class Name"
          name="name"
          defval={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defval={data?.capacity}
          register={register}
          error={errors.capacity}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.teacher}
          >
            {grades.map((grade, i) => {
              return (
                <option
                  key={grade.id}
                  value={grade.id}
                  selected={data && grade.id == data.gradeId}
                >{`${grade.level}`}</option>
              );
            })}
          </select>
          {errors.gradeId?.message && (
            <p className="text-xs text-red-400">
              {errors.gradeId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Supervisor</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.teacher}
          >
            {teachers.map((teacher, i) => {
              if (data?.supervisor.id == teacher.id) {
                return (
                  <option
                    key={teacher.id}
                    value={teacher.id}
                    selected={data && teacher.id == data.supervisorId}
                  >{`${teacher.name} ${teacher.surname}`}</option>
                );
              }
              return (
                <option
                  key={teacher.id}
                  value={teacher.id}
                >{`${teacher.name} ${teacher.surname}`}</option>
              );
            })}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-xs text-red-400">
              {errors.supervisorId?.message.toString()}
            </p>
          )}
        </div>
        {data && (
          <InputField
            label="Id"
            name="id"
            defval={data?.id}
            register={register}
            error={errors.id}
            hidden={true}
          />
        )}
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type == "plus" ? "Create" : "Update"}
      </button>
    </form>
  );
}
