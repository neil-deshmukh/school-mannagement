"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { createSubject, updateSubject } from "@/app/vars/actions";
import { useRouter } from "next/navigation";

const schema = z.object({
  id: z.coerce.string().optional(),
  subject: z.string().min(1, { message: "Subject Name is required!" }),
  teacher: z.array(z.string()),
});

export default function SubjectForm({ type, data, setOpen, relatedData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const [state, formAction] = useFormState(
    type === "plus" ? createSubject : updateSubject,
    { success: false, error: false }
  );

  const onSubmit = handleSubmit((datad) => {
    formAction(datad);
  });

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

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "plus" ? "Create" : "Update"} a subject
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Subject Name"
          name="subject"
          defval={data?.name}
          register={register}
          error={errors.subject}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacher")}
            defaultValue={data?.teacher}
            multiple
          >
            {relatedData?.teachers.map((teacher, i) => {
              return (
                <option
                  key={teacher.id}
                  value={teacher.id}
                >{`${teacher.name} ${teacher.surname}`}</option>
              );
            })}
          </select>
          {errors.teacher?.message && (
            <p className="text-xs text-red-400">
              {errors.teacher?.message.toString()}
            </p>
          )}
        </div>
        {data && (
          <InputField
            label="Id"
            name="id"
            defval={data.id}
            register={register}
            error={errors.id}
            hidden={true}
          />
        )}
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong!</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md" type="submit">
        {type === "plus" ? "Create" : "Update"}
      </button>
    </form>
  );
}
