import * as mongoose from 'mongoose';
import {UsersModule} from '../users/users.module';

const Schema = mongoose.Schema;

const MeetingSchema = new mongoose.Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    schedule: { type: Date, required: true },
    notes: { type: String, required: true, default: 'No info' },
});

export const CabildoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'UsersSchema' }], // at least 1
    moderators: [{ type: Schema.Types.ObjectId, ref: 'UsersSchema' }], // at least 1
    admin: { type: Schema.Types.ObjectId, ref: 'UsersSchema' },
    location: { type: String, required: false },
    issues: [{ type: String, required: true }],
    meetings: [{ type: Schema.Types.ObjectId, ref: 'MeetingSchema' }],
    files: [{ type: String, required: true }],
    activities: [{ type: Schema.Types.ObjectId, ref: 'ActivitySchema' }],
});

export interface Cabildo extends mongoose.Document {
    name: string;
    members: object[];
    moderators: object[];
    admin: object;
    location: string;
    issues: string[];
    meetings: object[];
    files: string[];
    activities: object[];
}
