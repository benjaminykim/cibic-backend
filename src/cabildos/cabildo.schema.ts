import * as mongoose from 'mongoose';
import {UsersModule} from '../users/users.module';

export const CabildoSchema = new mongoose.Schema({
    username: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
});

export interface Product extends mongoose.Document {
    id: string;
    title: string;
    description: string;
    price: number;
}
