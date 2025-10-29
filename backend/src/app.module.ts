import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TodoSchema } from './schemas/todo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl, collectionName } from './config';
@Module({
  imports: [
    MongooseModule.forRoot(mongoUrl),
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema, collection: collectionName }]),
  ],
  controllers: [AppController],
})
export class AppModule {}