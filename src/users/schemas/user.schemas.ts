import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class User {
    @Prop({ required: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ default: Date.now })
    created_at: Date;

    @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
    role: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
