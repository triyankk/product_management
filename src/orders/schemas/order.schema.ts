import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema()
export class Order {
    @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
    userId: Types.ObjectId;

    @Prop({ required: true, type: [Types.ObjectId], ref: 'Product' })
    productIds: Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);
