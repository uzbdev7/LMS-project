import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus, Get, Param, UseInterceptors, Put, ParseIntPipe, Delete  } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateCourseCategoryDto } from './dto/create-category.dto';
import { CourseCategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CourseCategoriesController {
  constructor(private readonly service: CourseCategoriesService) {}

  @Post('/create')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('')) 
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'ADMIN' })
  @ApiBody({ type: CreateCourseCategoryDto })
  async create(
    @Body() dto: CreateCourseCategoryDto
  ) {

    return this.service.create(dto);
  }

  @Get('category/getAll')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN','STUDENT','ASSISTANT','MENTOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'ADMIN | STUDENT | ASSISTANT | MENTOR'})
  async getAll(){
    return this.service.findAll()
  }

  @Get('category/get/:id')
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({summary:'ADMIN'})
  async getById(@Param('id') id: string) {
  const userId = parseInt(id, 10);
    return this.service.findOne(userId)
  }

  @Put('category/update/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN updates a category' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,   
    @Body() updateCategoryDto: UpdateCategoryDto, 
  ) {
    return this.service.update(id, updateCategoryDto);
  }

  @Delete('category/delete/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.NO_CONTENT) 
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'ADMIN deletes a category' })
  async deleteCategory(
    @Param('id', ParseIntPipe) id: number, 
  ) {
    return this.service.remove(id); 
  }

}
