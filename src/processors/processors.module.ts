import { Module } from '@nestjs/common';
import { ProcessorsService } from './processors.service';
import { ProcessorsController } from './processors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Processor, ProcessorSchema } from './schema/processors.schema';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Processor.name,
        schema: ProcessorSchema,
      },
    ]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [ProcessorsController],
  providers: [ProcessorsService],
})
export class ProcessorsModule {}
