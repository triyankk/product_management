import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Product } from 'src/product/schemas/product.schema';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], required: true })
    productIds: Types.ObjectId[];

    @Prop({ required: true })
    totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
