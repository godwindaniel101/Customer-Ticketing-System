import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import { UserDocument } from '../auth/auth.model';

export interface TicketDocument extends mongoose.Document {
    customer: UserDocument['_id'];
    agent: UserDocument['_id'];
    title: string;
    description: string;
    status: string;
    ticketComments: Array<Object>;
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema = new mongoose.Schema(
    {
        TicketId: {
            type: String,
            required: true,
            unique: true,
            default: () => nanoid(10)
        },
        status: {
            type: String,
            enum: ['pending', 'open', 'close'],
            default: 'pending'
        },
        customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        title: { type: String, default: true },
        description: { type: String, default: true }
    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

//Relationship to load all attached comment
TicketSchema.virtual('ticketComments', {
    ref: 'Comment',
    foreignField: 'ticket',
    localField: '_id'
});

//Relationship to get customer creating the ticket
TicketSchema.virtual('ticketCustomer', {
    ref: 'User',
    foreignField: '_id',
    localField: 'customer'
});

const Ticket = mongoose.model<TicketDocument>('Ticket', TicketSchema);

export default Ticket;
