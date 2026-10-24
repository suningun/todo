import { Test, TestingModule } from '@nestjs/testing';
import { strictEqual } from 'node:assert';
import { beforeEach, describe, it } from 'vitest';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;


  //required: to do testing before pushing to production
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      strictEqual(appController.getHello(), 'Hello World!');
    });
  });
});
