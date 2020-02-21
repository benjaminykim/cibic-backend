import * as mongoose from 'mongoose';
import {UsersModule} from '../users/users.module';

export const MeetingSchema = new mongoose.Schema({
    schedule: { type: Date, required: true },
    notes: { type: String, required: true, default: 'No info' },
});

export const CabildoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: { type: String, required: true }, // at least 1
    moderators: { type: Number, required: true }, // at least 1
    location: { type: String, required: false },
    issues: { type: String, required: true },
    meetings: { type: [MeetingSchema], required: false },
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
