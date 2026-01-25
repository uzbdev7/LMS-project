import { Test, TestingModule } from '@nestjs/testing';
import { QuestionAnswerController } from './question-answer.controller';
import { QuestionAnswerService } from './question-answer.service';

describe('QuestionAnswerController', () => {
  let controller: QuestionAnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionAnswerController],
      providers: [QuestionAnswerService],
    }).compile();

    controller = module.get<QuestionAnswerController>(QuestionAnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
