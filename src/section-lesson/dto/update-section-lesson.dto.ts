import { PartialType } from '@nestjs/swagger';
import { CreateSectionLessonDto } from './create-section-lesson.dto';

export class UpdateSectionLessonDto extends PartialType(CreateSectionLessonDto) {}