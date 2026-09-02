import { 
  BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, 
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

// import { fileFilter } from './helpers/fileFilter.helper';
// import { fileNamer } from './helpers/fileNamer.helper';
import { fileFilter, fileNamer } from './helpers';
import type { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Se podría hacer así en caso de querer definir un tipo dinámico, tipo: product/avatar
  // @Get(':type')
  // Para este ejemplo se pone en duro product
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage( imageName );

    // res.status(403).json({
    //   ok: false,
    //   path: path
    // });
    // return path;
    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: { fileSize: 1000 },
    storage: diskStorage({ 
      destination: './static/products',
      filename: fileNamer
    })
  }) )
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ){
    // console.log(file);
    if( !file ){
      throw new BadRequestException('Make sure that the file is an image');
    }

    // const secureUrl = `${ file.filename }`;
    const secureUrl = `http://localhost:3000/api/files/product/ceaa20bf-cd46-48c6-afb8-5fe661ecd2fb.png`;

    // console.log(file);
    return {
      // fileName: file.originalname,
      // type: file.mimetype,
      secureUrl
    };
  }
  
}