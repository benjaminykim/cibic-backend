import mongoose from 'mongoose';

const MeetingSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    schedule: { type: Date, required: true },
    notes: { type: String, required: true, default: 'No info' },
});

export const CabildoSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // at least 1
    moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // at least 1
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: { type: String, required: false },
    desc: { type: String, required: true },
    issues: [{ type: String, required: true }],
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }],
    files: [{ type: String, required: true }],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }],
});

export interface Cabildo extends mongoose.Document {
    name: string;
    members: object[];
    moderators: object[];
    admin: object | string;
    location: string;
    desc: string;
    issues: string[];
    meetings: object[];
    files: string[];
    activities: object[];
}
