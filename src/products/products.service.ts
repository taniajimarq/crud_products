import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.prismaService.product.create({
        data: createProductDto,
      });
    } catch (error) {
      console.log(error)
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException(
            `Product with name ${createProductDto.name} already exists`,
          );
        }
      }
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.prismaService.product.findMany();
  }

  async findOne(id: number) {
    const productFound = await this.prismaService.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!productFound) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return productFound;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    
    try {
      if(!updateProductDto){
        throw new BadRequestException('No hay datos')
      }
      const productFound = await this.prismaService.product.update({
        where: {
          id,
        },
        data: updateProductDto,
      });
      if (!productFound) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      
      return updateProductDto;  
    } catch (error) {
      console.log(error)
      throw new NotFoundException('Algo salio mal')
    }
    
  }

  async remove(id: number) {
    const deletedProduct = this.prismaService.product.delete({
      where: {
        id: id,
      },
    });
    if (!deletedProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return deletedProduct;
  }
}
