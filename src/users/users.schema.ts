import * as mongoose from 'mongoose';
import * as cabildo from '../cabildos/cabildo.module';

const Schema = mongoose.Schema;

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
    cabildos: [{ type: Schema.Types.ObjectId, ref: 'CabildoSchema' }],
    activityVotes: [{ type: String, required: true }],
    commentVotes: [{ type: String, required: true }],
    files: [{ type: String, required: true }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'UserSchema' }],
});

export interface Users extends mongoose.Document {
    id: string;
    username: string;
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    maidenName: string;
    phone: number;
    rut: string;
    cabildos: object[];
    activityVotes: string[];
    commentVotes: string[];
    files: string[];
    followers: object[];
    following: object[];
}
