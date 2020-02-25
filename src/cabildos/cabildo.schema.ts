import * as mongoose from 'mongoose';
import {UsersModule} from '../users/users.module';

const Schema = mongoose.Schema;

const MeetingSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    schedule: { type: Date, required: true },
    notes: { type: String, required: true, default: 'No info' },
});

export const CabildoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: { type: String, required: true }, // at least 1
    moderators: { type: Number, required: true }, // at least 1
    location: { type: String, required: false },
    issues: { type: String, required: true },
    meetings: [{ type: Schema.Types.ObjectId, ref: 'MeetingSchema'}],
    files: { type: String, required: true },
});

export interface Cabildo extends mongoose.Document {
    name: string;
    members: string;
    moderators: string;
    location: string;
    issues: string;
    meetings: object[];
    files: string;
}
