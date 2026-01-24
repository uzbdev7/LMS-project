import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { HomeworkSubStatus } from '@prisma/client'; 

export class ReviewSubmissionDto {
  @ApiProperty({ 
    enum: HomeworkSubStatus, 
    example: HomeworkSubStatus.APPROVED,
    description: 'Vazifa holati' 
  })
  @IsEnum(HomeworkSubStatus)
  status: HomeworkSubStatus;

  @ApiProperty({ 
    example: 'Yaxshi bajarilgan, lekin xatolar bor', 
    required: false,
    description: 'Izoh yoki rad etish sababi'
  })
  @IsString()
  @IsOptional()
  reason?: string;
}