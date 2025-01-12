"use server"

import { clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma"

//Subject //////////////////////////////////////////

export const createSubject = async (currentState, data) => {
    try {
        await prisma.subject.create({
            data: {
                name: data.subject,
                teachers: {        
                  connect: data.teacher.map(teacherId => ({id: teacherId}))
                }
            }
        })
        return { success: true, error: false };
    } catch (err) {
        console.log(err)
        return  {success: false, error: true}
    }
}

export const updateSubject = async (currentState, data) => {
  try {
    await prisma.subject.update({
        where: {
            id: parseInt(data.id)
        },
      data: {
        name: data.subject,
        teachers: {
          set: data.teacher.map(teacherId => ({id: teacherId}))
        }
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteSubject = async (currentState, data) => {
  const id = data.get("id")
  try {
    await prisma.subject.delete({
      where: {
        id: parseInt(id),
      }
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Class //////////////////////////////////////////

export const createClass = async (currentState, data) => {
  try {
    
    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: data.supervisorId
      }
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateClass = async (currentState, data) => {
  try {
    await prisma.class.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        capacity: data.capacity,
        supervisorId: data.supervisorId,
        gradeId: data.gradeId,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteClass = async (currentState, data) => {
  const id = data.get("id");
  try {
    await prisma.class.delete({
      where: {
        id: parseInt(id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Teacher //////////////////////////////////////////

export const createTeacher = async (currentState, data) => {
  try {
    const client = await clerkClient()
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      publicMetadata: {role: "teacher"}
    })
    const {username, name, surname, email, phone, address, img, bloodType, sex, subjects, birthday} = data
    await prisma.teacher.create({
      data: {
        id: user.id,
        username,
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        subjects: {
          connect: data.subjects?.map(subjectId => ({
            id: parseInt(subjectId)
          }))
        },
        birthday,
      }
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateTeacher = async (currentState, data) => {
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password != "" && {password: data.password}),
      publicMetadata: { role: "teacher" },
    });
    const {
      username,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      subjects,
      birthday,
    } = data;
    await prisma.teacher.update({
      where: {
        id: data.id,
      },
      data: {
        username,
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        subjects: {
          set: data.subjects?.map((subjectId) => ({
            id: parseInt(subjectId),
          })),
        },
        birthday,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteTeacher = async (currentState, data) => {
  try {
    const client = await clerkClient();
    const user = await client.users.deleteUser(data?.id);
    await prisma.teacher.delete({
      where: {
        id: data.id,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Student //////////////////////////////////////////

export const createStudent = async (currentState, data) => {
  try {
    const curClass = await prisma.class.findUnique({
      where: { id: data.classId },
      include: {_count: {select: {students: true}}}
    })
    if (curClass && curClass.capacity == curClass._count.students) {
      return { success: false, error: true };
    }
    const client = await clerkClient()
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      publicMetadata: { role: "student" },
    });
    const {username, name, surname, email, phone, address, img, bloodType, sex, birthday} = data
    await prisma.student.create({
      data: {
        id: user.id,
        username,
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateStudent = async (currentState, data) => {
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password != "" && {password: data.password}),
      publicMetadata: { role: "teacher" },
    });
    const {
      username,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      birthday,
    } = data;
    await prisma.student.update({
      where: {
        id: data.id,
      },
      data: {
        username,
        name,
        surname,
        email,
        phone,
        address,
        img,
        bloodType,
        sex,
        birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteStudent = async (currentState, data) => {
  try {
    const client = await clerkClient();
    console.log(data)
    const user = await client.users.deleteUser(data.id);
    await prisma.student.delete({
      where: {
        id: data.id,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Exams //////////////////////////////////////////

export const createExam = async (currentState, data) => {
  try {
    let hour = parseInt(data.time.split(":")[0]);
    let minutes = parseInt(`${data.time.split("")[3]}${data.time.split("")[4]}`);
    data.time.split("")[5] == "p" ? hour = hour + 12 : hour;
    data.date.setHours(hour, minutes)
    const endTime = new Date(data.date)
    endTime.setHours(data.date.getHours() + 2)
    const newLesson = await prisma.lesson.create({
      data: {
        name: data.title,
        day: data.date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        startTime: data.date,
        endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId
      }
    })
    await prisma.exam.create({
      data: {
        title: data.title,
        startDate: data.date,
        lessonId: newLesson.id
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateExam = async (currentState, data) => {
  let hour = parseInt(data.time.split(":")[0]);
  let minutes = parseInt(`${data.time.split("")[3]}${data.time.split("")[4]}`);
  data.time.split("")[5] == "p" ? (hour = hour + 12) : hour;
  data.date.setHours(hour, minutes);
  const endTime = new Date(data.date);
  endTime.setHours(data.date.getHours() + 2);
  try {
    const curExam = await prisma.exam.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        title: data.title,
        startDate: data.date,
      },
    });
    await prisma.lesson.update({
      where: {
        id: curExam.lessonId
      },
      data: {
        name: data.title,
        day: data.date.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        startTime: data.date,
        endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId
      },
    });
    
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteExam = async (currentState, data) => {
  try {
    const curExam = await prisma.exam.delete({
      where: {
        id: parseInt(data.id),
      },
    });
    await prisma.lesson.delete({
      where: {
        id: curExam.lessonId
      }
    })
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Assignements //////////////////////////////////////////

export const createAssignment = async (currentState, data) => {
  try {
    let hour = parseInt(data.time.split(":")[0]);
    let minutes = parseInt(`${data.time.split("")[3]}${data.time.split("")[4]}`);
    data.time.split("")[5] == "p" ? hour = hour + 12 : hour;
    data.dueDate.setHours(hour, minutes)
    const newLesson = await prisma.lesson.create({
      data: {
        name: data.title,
        day: data.startDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        startTime: data.startDate,
        endTime: data.dueDate,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId
      }
    })
    await prisma.assignment.create({
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: newLesson.id
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAssignment = async (currentState, data) => {
  let hour = parseInt(data.time.split(":")[0]);
  let minutes = parseInt(`${data.time.split("")[3]}${data.time.split("")[4]}`);
  data.time.split("")[5] == "p" ? (hour = hour + 12) : hour;
  data.dueDate.setHours(hour, minutes);
  try {
    const curExam = await prisma.assignment.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        title: data.title,
        startDate: data.startDate,
      },
    });
    await prisma.lesson.update({
      where: {
        id: curExam.lessonId
      },
      data: {
        name: data.title,
        day: data.startDate.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
        startTime: data.startDate,
        endTime: data.dueDate,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId
      },
    });
    
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAssignment = async (currentState, data) => {
  try {
    const curExam = await prisma.assignment.delete({
      where: {
        id: parseInt(data.id),
      },
    });
    await prisma.lesson.delete({
      where: {
        id: curExam.lessonId
      }
    })
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Parents //////////////////////////////////////////

export const createParents = async (currentState, data) => {
  try {
    const client = await clerkClient();
    const user = await client.users.createUser({
      username: data.username,
      password: data.password,
      publicMetadata: { role: "parent" },
    });
    await prisma.parent.create({
      data: {
        id: user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateParents = async (currentState, data) => {
  try {
    const client = await clerkClient();
    const user = await client.users.updateUser(data.id, {
      username: data.username,
      ...(data.password != "" && { password: data.password }),
      publicMetadata: { role: "parent" },
    });
    await prisma.parent.update({
      where: {
        id: data.id
      },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
      },
    });
    
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteParents = async (currentState, data) => {
  try {
    const client = await clerkClient();
    const user = await client.users.deleteUser(data.id);
    await prisma.parent.delete({
      where: {
        id: data.id,
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Result //////////////////////////////////////////

export const createResult = async (currentState, data) => {
  try {
    await prisma.result.create({
      data: {
        score: data.score,
        examId: parseInt(data.examId) || null,
        assignmentId: parseInt(data.assignmentId) || null,
        studentId: data.studentId
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateResult = async (currentState, data) => {
  try {
    await prisma.result.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        score: data.score,
        examId: parseInt(data.examId) || null,
        assignmentId: parseInt(data.assignmentId) || null,
        studentId: data.studentId,
      },
    });
    
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteResult = async (currentState, data) => {
  try {
    await prisma.result.delete({
      where: {
        id: parseInt(data.id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Announcements //////////////////////////////////////////

export const createAnnouncement = async (currentState, data) => {
  try {
    await prisma.announcements.create({
      data: {
        title: data.title,
        description: data.desc,
        date: data.date,
        classId: parseInt(data.classId)
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateAnnouncement = async (currentState, data) => {
  try {
    await prisma.announcements.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        title: data.title,
        description: data.desc,
        date: data.date,
        classId: parseInt(data.classId),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteAnnouncement = async (currentState, data) => {
  try {
    await prisma.announcements.delete({
      where: {
        id: parseInt(data.id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

//Events //////////////////////////////////////////

export const createEvents = async (currentState, data) => {
  try {
    let hour = parseInt(data.startTime.split(":")[0]);
    let minutes = parseInt(
      `${data.startTime.split("")[3]}${data.startTime.split("")[4]}`
    );
    data.startTime.split("")[5] == "p" ? (hour = hour + 12) : hour;
    data.date.setHours(hour, minutes);
    let endhour = parseInt(data.endTime.split(":")[0]);
    let endminutes = parseInt(
      `${data.endTime.split("")[3]}${data.endTime.split("")[4]}`
    );
    data.endTime.split("")[5] == "p" ? (endhour = endhour + 12) : endhour;
    const endTime = new Date(data.date);
    endTime.setHours(endhour, endminutes);
    await prisma.events.create({
      data: {
        title: data.title,
        description: data.desc,
        startTime: data.date,
        endTime: endTime,
        classId: parseInt(data.classId),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const updateEvents = async (currentState, data) => {
  try {
    let hour = parseInt(data.startTime.split(":")[0]);
    let minutes = parseInt(
      `${data.startTime.split("")[3]}${data.startTime.split("")[4]}`
    );
    data.startTime.split("")[5] == "p" ? (hour = hour + 12) : hour;
    data.date.setHours(hour, minutes);
    let endhour = parseInt(data.endTime.split(":")[0]);
    let endminutes = parseInt(
      `${data.endTime.split("")[3]}${data.endTime.split("")[4]}`
    );
    data.endTime.split("")[5] == "p" ? (endhour = endhour + 12) : endhour;
    const endTime = new Date(data.date);
    endTime.setHours(endhour, endminutes);
    await prisma.events.update({
      where: {
        id: parseInt(data.id),
      },
      data: {
        title: data.title,
        description: data.desc,
        startTime: data.date,
        endTime: endTime,
        classId: parseInt(data.classId),
      },
    });

    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};

export const deleteEvents = async (currentState, data) => {
  try {
    await prisma.events.delete({
      where: {
        id: parseInt(data.id),
      },
    });
    return { success: true, error: false };
  } catch (err) {
    console.log(err);
    return { success: false, error: true };
  }
};