//export class CreateProductDto {}
import { Product } from '@prisma/client';

//Tipo de dato createProduct que espera los campos desde el front
export type CreateProductDto = Omit<Product, 'id' | 'createAt' | 'updatedAt'>;
