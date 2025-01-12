"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { formatHour } from "@/app/vars/data";
import { createEvents, updateEvents } from "@/app/vars/actions";

const schema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: " Event title is required!" }),
  desc: z.string().min(1, { message: "Event Description is required!" }),
  classId: z.union([z.string(), z.null()]),
  date: z.coerce.date({ message: "Date is required!" }),
  startTime: z.string().regex(/\d\d:\d\d[pa]m/i),
  endTime: z.string().regex(/\d\d:\d\d[pa]m/i),
});

export default function EventForm({ type, data, setOpen, relatedData }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
    const [state, formAction] = useFormState(
      type === "plus" ? createEvents : updateEvents,
      { success: false, error: false }
    );
    const onSubmit = handleSubmit((datad) => {
      formAction(datad);
    });
    const router = useRouter();

    useEffect(() => {
      if (state.success) {
        toast.success(
          `Event has been ${type === "plus" ? "created" : "updated"}!`
        );
        setOpen(false);
        router.refresh();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);
    const { classes } = relatedData;
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new event</h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Title"
          name="title"
          defval={data?.title}
          register={register}
          error={errors.title}
        />
        <InputField
          label="Description"
          name="desc"
          defval={data?.description}
          register={register}
          error={errors.desc}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Class</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
          >
            <option value={null} selected>
              None
            </option>
            {classes.map((classs) => {
              return (
                <option
                  key={classs.id}
                  value={classs.id}
                  selected={classs.id == data?.classId}
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
        <InputField
          label="Date"
          name="date"
          type="date"
          defval={data?.startTime.toISOString().split("T")[0]}
          register={register}
          error={errors.date}
        />
        <InputField
          label="Start Time"
          name="startTime"
          defval={
            data
              ? `${data?.startTime
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
                  .join("")}${data?.startTime.getHours() > 12 ? "pm" : "am"}`
              : ""
          }
          register={register}
          error={errors.startTime}
        />
        <InputField
          label="End Time"
          name="endTime"
          defval={
            data
              ? `${data?.endTime
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
                  .join("")}${data?.endTime.getHours() > 12 ? "pm" : "am"}`
              : ""
          }
          register={register}
          error={errors.endTime}
        />
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
