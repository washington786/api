import { Schema, model } from 'mongoose';

const issueSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default model('Issue', issueSchema);