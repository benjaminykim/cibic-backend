import { Schema, Document } from 'mongoose';

const MeetingSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    schedule: { type: Date, required: true },
    notes: { type: String, required: true, default: 'No info' },
});

export const CabildoSchema = new Schema({
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }], // at least 1
    moderators: [{ type: Schema.Types.ObjectId, ref: 'User' }], // at least 1
    admin: { type: Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, required: false },
    desc: { type: String, required: true },
    issues: [{ type: String, required: true }],
    meetings: [{ type: Schema.Types.ObjectId, ref: 'Meeting' }],
    files: [{ type: String, required: true }],
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
});

export interface Cabildo extends Document {
    name: string;
    members: object[];
    moderators: object[];
    admin: object;
    location: string;
    desc: string;
    issues: string[];
    meetings: object[];
    files: string[];
    activities: object[];
}
