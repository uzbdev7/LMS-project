import { PartialType } from '@nestjs/swagger';
import { CreateCourseCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCourseCategoryDto) {}
