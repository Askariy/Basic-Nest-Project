import { Injectable, ForbiddenException } from '@nestjs/common';
import { Task } from './interfaces/task.interface';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task-dto';

@Injectable()
export class TasksService {
  constructor(private prismaService: PrismaService) {}
  private readonly tasks: Task[] = [
    {
      id: '1',
      name: 'task1',
      description: 'desc1',
    },
    {
      id: '2',
      name: 'task2',
      description: 'desc2',
    },
  ];

  async create(userId: number, createTaskDto: CreateTaskDto) {
    const task = await this.prismaService.task.create({
      data: {
        userId,
        ...createTaskDto,
      },
    });

    return task;
  }

  async findAllTask(userId: number): Promise<any> {
    return this.prismaService.task.findMany({
      where: {
        userId,
      },
    });
  }

  async findOne(userId: number, id: number): Promise<any> {
    return this.prismaService.task.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  // http://localhost:3000/1/2,3,4
  async delete(userId: number, taskIdOrIds: number | number[]) {
    const deleteSingleTask = async (taskId: number) => {
      const task = await this.prismaService.task.findUnique({
        where: {
          id: taskId,
        },
      });

      if (!task || task.userId !== userId) {
        throw new ForbiddenException('Forbidden Resource');
      }

      await this.prismaService.task.delete({
        where: {
          id: taskId,
        },
      });
    };

    if (Array.isArray(taskIdOrIds)) {
      const deletePromises = taskIdOrIds.map((taskId) =>
        deleteSingleTask(taskId),
      );
      await Promise.all(deletePromises);
    } else {
      await deleteSingleTask(taskIdOrIds);
    }
  }
}
