import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { SmsModule } from './sms/sms.module'; 
import { ProfilesModule } from './profiles/profiles.module';
import { CategoriesModule } from './categories/categories.module';
import { CoursesModule } from './courses/courses.module';
import { CourseRatingModule } from './course-rating/course-rating.module';
import { SectionLessonModule } from './section-lesson/section-lesson.module';
import { LessonsModule } from './lessons/lessons.module';
import { LessonFilesModule } from './lesson-files/lesson-files.module';
import { HomeworksModule } from './homeworks/homeworks.module';
import { HomeworkSubmissionsModule } from './homework-submissions/homework-submissions.module';
import { LessonViewModule } from './lesson-view/lesson-view.module';
import { LastActivityModule } from './last-activity/last-activity.module';
import { PurchasedCoursesModule } from './purchased-courses/purchased-courses.module';
import { ExamsModule } from './exams/exams.module';
import { ExamResultsModule } from './exam-results/exam-results.module';
import { QuestionsModule } from './questions/questions.module';
import { QuestionAnswerModule } from './question-answer/question-answer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, 
    SmsModule,
    UsersModule,
    ProfilesModule,
    CategoriesModule,
    CoursesModule,
    CourseRatingModule,
    SectionLessonModule,
    LessonsModule,
    LessonFilesModule,
    HomeworksModule,
    HomeworkSubmissionsModule,
    LessonViewModule,
    LastActivityModule,
    PurchasedCoursesModule,
    ExamsModule,
    ExamResultsModule,
    QuestionsModule,
    QuestionAnswerModule,  
  ],
  controllers: [AppController], 
  providers: [AppService],    
})
export class AppModule {}