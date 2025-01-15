"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import TeacherForm from "./forms/TeacherForm"
import StudentForm from "./forms/StudentForm";
import ParentForm from "./forms/ParentForm";
import SubjectForm from "./forms/SubjectForm";
import ClassForm from "./forms/ClassForm";
import LessonForm from "./forms/LessonForm";
import ExamForm from "./forms/ExamForm";
import AssignmentForm from "./forms/AssignmentForm";
import ResultForm from "./forms/ResultForm";
import EventForm from "./forms/EventForm";
import AnnouncementForm from "./forms/AnnouncementForm";
import { useFormState } from "react-dom";
import { deleteAnnouncement, deleteAssignment, deleteClass, deleteEvents, deleteExam, deleteLesson, deleteParents, deleteResult, deleteStudent, deleteSubject, deleteTeacher } from "../vars/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const DeleteActionMap = {
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteParents,
  subject: deleteSubject,
  class: deleteClass,
  exam: deleteExam,
  assignments: deleteAssignment,
  result: deleteResult,
  event: deleteEvents,
  announcement: deleteAnnouncement,
  lesson: deleteLesson
};

const Forms = {
  teacher: (type, data, setOpen, relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  student: (type, data, setOpen, relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  parent: (type, data, setOpen, relatedData) => <ParentForm type={type} data={data} setOpen={setOpen} />,
  subject: (type, data, setOpen, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  class: (type, data, setOpen, relatedData) => <ClassForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  lesson: (type, data, setOpen, relatedData) => <LessonForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  exam: (type, data, setOpen, relatedData) => <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  assignments: (type, data, setOpen, relatedData) => <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  result: (type, data, setOpen, relatedData) => <ResultForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  event: (type, data, setOpen, relatedData) => <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
  announcement: (type, data, setOpen, relatedData) => <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
};

export default function FormModal({ table, type, data, id, relatedData }) {
    const size = type == "plus" ? "w-8 h-8" : "w-7 h-7"
    const bgColor = type == "plus" ? "bg-neow" : type == "edit" ? "bg-neue" : "bg-nele"
  const [open, setOpen] = useState(false)
  const Form = () => {
    const router = useRouter()
    const { register, handleSubmit } = useForm()
    const [state, formAction] = useFormState(DeleteActionMap[table], { success: false, error: false })
    const onSubmit = handleSubmit(datad => {
      formAction(datad)
    })
    useEffect(() => {
      if (state.success) {
        toast.success("Sucessfully deleted " + table)
        setOpen(false)
        router.refresh()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])
    return type == "delete" && id ? <form onSubmit={onSubmit} className="p-4 flex flex-col gap-4">
      <input type="text | number" {...register("id")} defaultValue={id} hidden />
      <span className="text-center font-medium">All data will be lost. Are you sure you want to delete this {table}?</span>
      <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">Delete</button>
    </form> :  (
        Forms[table](type, data, setOpen, relatedData)
    )
  }
  return (
    <>
      <button className={`${size} flex items-center justify-center rounded-full ${bgColor}`} onClick={() => setOpen(true)}>
        <Image src={`/${type}.png`} alt="action button (edit, delete, create)" width={16} height={16} />
      </button>
      {open && <div className="w-screen h-[100vh] absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
        <div className="bg-white rounded-md p-4 relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div className="absolute top-4 right-4 cursor-pointer" onClick={() => setOpen(false)}><Image src="/close.png" alt="cancel" width={14} height={14} /></div>    
        </div>  
      </div>}
    </>
  )
} 
