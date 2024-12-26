import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export const User = mongoose.model<IUser>('User', UserSchema, 'users_reg');

export interface ISomeData extends Document {
    name: string;
    age: number;
}

const SomeDataSchema = new Schema<ISomeData>({
    name: { type: String, required: true },
    age: { type: Number, required: true },
});

export const SomeData = mongoose.model<ISomeData>('SomeData', SomeDataSchema, 'users_info');