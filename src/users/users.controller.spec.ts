import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

const  { setupDB } = require('../../test/setupdb');

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersSchema, Users } from './users.schema';
import { CabildoSchema } from '../cabildos/cabildo.schema';

import * as mongoose from 'mongoose';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  setupDB('cibic', true);
  let controller: UsersController;
    let mockUser: Users = {
      id: "",
      username: "smonroe", 
      email: "smonroe@gmail.fake", 
      password: "arealpassword", 
      firstName: "Steven", 
      middleName: "Cristopher", 
      lastName: "Monroe", 
      maidenName: "Rose", 
      phone: 9417261303, 
      rut: "1234567891", 
      cabildos: [],
      files: [],
      followers: [],
      following: [],
      activityFeed: [],
      activityVotes: [],
      commentVotes: [],
  };

  beforeEach(async () => {
    let userModel = mongoose.model('Users', UsersSchema);
    let cabildoModel = mongoose.model('Cabildo', CabildoSchema);
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken('Users'),
          useValue: userModel,
        },
        {
          provide: getModelToken('Cabildo'),
          useValue: cabildoModel,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('root', () => {
    let genId;
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
    it('should get empty set', () => {
      return controller.getAllUsers().then(data => expect(data).toStrictEqual([]));
    });
    it('shouldn`t find an invalid idUser', () => {
    return controller.getUser("4c6d7a6a5")
      .catch(err => expect(err).toBeInstanceOf(NotFoundException));
    })
    it('shouldn`t find a nonexistant user', () => {
    return controller.getUser("4c6d7a6a5d65aa7acdb65bef")
      .catch(err => expect(err).toBeInstanceOf(NotFoundException));

    });
    it('should create a user, then find that user', () => {
      controller.addUser(mockUser).then(data => {
        expect(data.id).toHaveLength(24);
        return controller.getUser(data.id)
          .then(data => expect(data).toMatchObject(mockUser))
          .catch(err => expect(1).toBe(2));
      });
    });
  });
});
