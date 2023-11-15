import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task-dto';
import { TasksService } from './tasks.service';
import { Task } from './interfaces/task.interface';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator/user.decorator';

@UseGuards(JwtGuard)
@Controller()
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get('list-tasks')
    findAllTask(@GetUser('id') userId: number) {
        // return 'Get All Tasks';
        return this.tasksService.findAllTask(userId);
    }

    @Get('task/:id')
    findOne(@GetUser('id') userId: number, @Param('id') id: number): any {
        return this.tasksService.findOne(userId, id);
    }

    @Post('create-task')
    create(@GetUser('id') userId: number, @Body() createTaskDto: CreateTaskDto): any {
        // return `Name:${createTaskDto.name}, Desc:${createTaskDto.description}`;
        return this.tasksService.create(userId, createTaskDto);
    }

    @Delete(':userId/:taskIdOrIds')
    async deleteTask(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('taskIdOrIds') taskIdOrIds: string,
    ) {
        const taskIds = taskIdOrIds.split(',').map(Number);

        try {
            await this.tasksService.delete(userId, taskIds);
            return { message: 'Tasks deleted successfully' };
        } catch (error) {
            return { error: error.message };
        }
    }

    // @Delete('task/:id')
    // delete(@Param('id') id): string{
    //     return `deleted task: ${id}`
    // }

    // @Put('task/:id')
    // update(@Body() updateTaskDto:CreateTaskDto, @Param('id') id): string{
    //     return `updated task: ${id}, name: ${updateTaskDto.name}`
    // }
}
