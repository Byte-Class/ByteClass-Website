import superjson from "superjson";
import { z } from "zod";
import { classroom_v1, google } from "googleapis";

import { router, userProcedure } from "@/server/trpc";
import { redisClient } from "@/core/redis";
import { authGoogle } from "@/lib/auth-google";
import { getDate, getMonth, getYear } from "date-fns";

const EXPIRATION = 60 * 60 * 24;

// dashboard router
export const dashboard = router({
  // pie chart procedure TODO FINISH THIS
  pieChart: userProcedure.query(async ({ ctx }) => {
    authGoogle(ctx.session.google.refresh_token);

    const classroom = google.classroom("v1");

    // array of all classes
    let userClasses: string[];

    // fetch all user classes, first we check redis for cache
    const redisCache = await redisClient.get(
      `${ctx.session.user.id}_courses_list`,
    );

    // if null, then we know the cache does not exist
    if (!redisCache) {
      userClasses =
        (
          await classroom.courses.list({
            courseStates: ["ACTIVE"],
          })
        ).data.courses
          ?.map((course) => course.id)
          .filter((id) => id !== undefined && id !== null) ?? [];

      // Now we update redis cache
      await redisClient.setEx(
        `${ctx.session.user.id}_courses_list`,
        EXPIRATION,
        userClasses.join(" "),
      );
    } else {
      userClasses = redisCache.split(" ");
    }

    const userCourseWork: classroom_v1.Schema$CourseWork[] = [];

    // next we fetch all the class work for these courses
    for (let i = 0; i < userClasses.length; i++) {
      const courseId = userClasses[i];
      let courseWorkTmp;

      // check cache for classes and cached assignments
      const redisCourseWork = await redisClient.get(
        `${ctx.session.user.id}_course_${courseId}`,
      );

      if (!redisCourseWork) {
        const courseWork = (
          await classroom.courses.courseWork.list({
            courseId: courseId,
            courseWorkStates: ["PUBLISHED"],
          })
        ).data.courseWork;

        if (courseWork === undefined) {
          continue;
        }

        courseWorkTmp = courseWork;

        // set cache
        redisClient.setEx(
          `${ctx.session.user.id}_course_${courseId}`,
          EXPIRATION,
          superjson.stringify(courseWork),
        );
      } else {
        courseWorkTmp =
          superjson.parse<classroom_v1.Schema$CourseWork[]>(redisCourseWork);
      }

      userCourseWork.push(...courseWorkTmp);
    }
  }),
  tasksDueSoon: userProcedure
    .input(
      z.object({
        itemsToReturn: z.number(),
      }),
    )
    .query(async ({ ctx }) => {
      authGoogle(ctx.session.google.refresh_token);

      const classroom = google.classroom("v1");

      // fetch all user classes, first we check redis for cache
      const redisCache = await redisClient.get(
        `${ctx.session.user.id}_courses_list`,
      );

      let userClasses: string[];

      // if null, then we know the cache does not exist
      if (!redisCache) {
        userClasses =
          (
            await classroom.courses.list({
              courseStates: ["ACTIVE"],
            })
          ).data.courses
            ?.map((course) => course.id)
            .filter((id) => id !== undefined && id !== null) ?? [];

        // Now we update redis cache
        await redisClient.setEx(
          `${ctx.session.user.id}_courses_list`,
          EXPIRATION,
          userClasses.join(" "),
        );
      } else {
        userClasses = redisCache.split(" ");
      }

      // after fetching all the user classes, we then fetch all the courses for that class, but first we check cache
      let courseWorks = [];

      for (let i = 0; i < userClasses.length; i++) {
        const courseId = userClasses[i];

        const cachedCourseWork = await redisClient.get(
          `${ctx.session.user.id}_courseWork_${courseId}_dueSoon`,
        );

        if (!cachedCourseWork) {
          const courseWork = (
            await classroom.courses.courseWork.list({
              courseId: userClasses[i],
              courseWorkStates: ["PUBLISHED"],
              orderBy: "dueDate desc",
            })
          ).data.courseWork;

          if (!courseWork) {
            continue;
          }

          courseWorks.push(...courseWork);
          redisClient.setEx(
            `${ctx.session.user.id}_courseWork_${courseId}_dueSoon`,
            EXPIRATION,
            superjson.stringify(courseWork),
          );
        } else {
          courseWorks.push(
            ...superjson.parse<classroom_v1.Schema$CourseWork[]>(
              cachedCourseWork,
            ),
          );
        }
      }

      const today = new Date();
      const currentYear = getYear(today);
      const currentMonth = getMonth(today) + 1;
      const currentDate = getDate(today);

      // now we strip the array
      courseWorks = courseWorks.filter(
        (courseWork) =>
          courseWork.dueDate &&
          courseWork.dueDate.year &&
          courseWork.dueDate.month &&
          courseWork.dueDate.day &&
          courseWork.dueDate.year >= currentYear &&
          courseWork.dueDate.month >= currentMonth &&
          courseWork.dueDate.day >= currentDate,
      );

      // const tmp = courseWorks.sort((a, b) =>
      //   compareAsc(
      //     new Date(a.dueDate.year!, a.dueDate.month! - 1, a.dueDate.day!),
      //     new Date(b.dueDate.year!, b.dueDate.month! - 1, b.dueDate.day!),
      //   ),
      // );

      // courseWorks = courseWorks.slice(0, input.itemsToReturn);

      return "hello world";
    }),
});
