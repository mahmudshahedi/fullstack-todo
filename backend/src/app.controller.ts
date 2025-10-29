import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from './schemas/todo.schema';
@Controller()
export class AppController {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}
  @Get('todo-schema')
  async getTodoSchema() {
    return this.todoModel.find().exec();
  }
  @Post('edit-todo')
  async updateTodo(@Body() body: { id: string; updateData: Partial<Todo> }) {
    const { id, updateData } = body;
    // if status toggled to 1, set completedAt; if toggled to 0, clear it
    if (typeof updateData.status === 'number') {
      if (updateData.status === 1) {
        (updateData as any).completedAt = new Date();
      } else if (updateData.status === 0) {
        (updateData as any).completedAt = null;
      }
    }
    return this.todoModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
  @Delete('delete-todo')
  async deleteTodo(@Body() body: { id: string }) {
    const { id } = body;
    return this.todoModel.findByIdAndDelete(id).exec();
  }
  @Post('add-todo')
  async addTodo(@Body() body: { name: string; task: string; status: number }) {
    const payload: any = { ...body };
    if (payload.status === 1) {
      payload.completedAt = new Date();
    }
    const newTodo = new this.todoModel(payload);
    return newTodo.save();
  }
}