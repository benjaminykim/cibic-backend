import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    maidenName: { type: String, required: true },
    phone: { type: Number, required: true },
    rut: { type: String, required: true }, /* Chilean dni */
    cabildos: { type: String, required: true },
    activityVotes: { type: String, required: true },
    commentVotes: { type: String, required: true },
    files: { type: String, required: true },
});

export interface User extends mongoose.Document {
    id: string;
    username: string;
    email: string;
    password: string;
}
