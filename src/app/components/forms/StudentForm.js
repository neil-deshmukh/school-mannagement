"use client"

import { useForm } from "react-hook-form";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import Image from "next/image";
import { createStudent, updateStudent } from "@/app/vars/actions";
import { CldUploadWidget } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useFormState } from "react-dom";

const schema = z.object({
  id: z.string().optional(),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalis email address!" }).optional().or(z.literal("")),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 chracters long!" }).optional().or(z.literal("")),
  name: z.string().min(1, { message: "First Name is required!" }),
  surname: z.string().min(1, { message: "Last Name is required!" }),
  phone: z.string().optional(),
  address: z.string(),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Gender is required" }),
  img: z.string().optional(),
  gradeId: z.coerce.number().min(1, {message: "Grade is required"}),
  classId: z.coerce.number().min(1, {message: "Class is required"}),
  parentId: z.string().min(1, {message: "Parent Id is required"})
});

export default function StudentForm({ type, data, setOpen, relatedData }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) })
  const [state, formAction] = useFormState(
    type === "plus" ? createStudent : updateStudent,
    { success: false, error: false }
  );
  const [img, setImg] = useState({})
  const onSubmit = handleSubmit(datad => {
      formAction({ ...datad, img: img?.secure_url });
  })
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      toast.success(
        `Student has been ${type === "plus" ? "created" : "updated"}!`
      );
      setOpen(false);
      router.refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const {grades, classes} = relatedData
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new student</h1>
      <span className="text-xs text-gray-400 font-medium">
        Authentication Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Username"
          name="username"
          defval={data?.username}
          register={register}
          error={errors.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defval={data?.email}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defval={data?.password}
          register={register}
          error={errors.password}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium">
        Personal Information
      </span>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="First Name"
          name="name"
          defval={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Last Name"
          name="surname"
          defval={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defval={data?.phone}
          register={register}
          error={errors.phone}
        />
        <InputField
          label="Address"
          name="address"
          defval={data?.addresss}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defval={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birth Day"
          name="birthday"
          type="date"
          defval={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
        />
        <InputField
          label="Parent Id"
          name="parentId"
          defval={data?.parentId}
          register={register}
          error={errors.parentId}
        />
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Sex</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("sex")}
            defaultValue={data?.sex}
          >
            <option value="MALE" selected={data?.sex == "MALE"}>
              Male
            </option>
            <option value="FEMALE" selected={data?.sex == "FEMALE"}>
              Female
            </option>
          </select>
          {errors.sex?.message && (
            <p className="text-xs text-red-400">
              {errors.sex?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Grade</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
          >
            {grades.map((grade) => {
              return (
                <option key={grade.id} value={grade.id} selected={grade.id == data?.gradeId}>
                  {grade.level}
                </option>
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
                  selected={classs.id == data?.classId}
                >
                  (
                  {classs.name +
                    " - " +
                    classs._count.students +
                    "/" +
                    classs.capacity}{" "}
                  Capacity)
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
        <CldUploadWidget
          uploadPreset="school"
          onSuccess={(result, { widget }) => {
            setImg(result.info);
            widget.close();
          }}
        >
          {({ open }) => {
            return (
              <div
                className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
                onClick={open}
              >
                <Image src="/upload.png" alt="" width={20} height={20} />
                <span>Upload a photo</span>
              </div>
            );
          }}
        </CldUploadWidget>
        {type == "edit" && (
          <InputField
            name="id"
            register={register}
            error={errors.id}
            defval={data?.id}
            hidden={true}
          />
        )}
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type == "plus" ? "Create" : "Update"}
      </button>
    </form>
  );
}
