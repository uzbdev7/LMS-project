import { PartialType } from '@nestjs/swagger';
import { CreateSubmissionDto } from './create-homework-submission.dto';

export class UpdateSubmissionDto extends PartialType(CreateSubmissionDto) {}