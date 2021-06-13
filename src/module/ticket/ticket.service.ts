import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import Ticket, { TicketDocument } from './ticket.model';

export function createTicket(input: DocumentDefinition<TicketDocument>) {
    return Ticket.create(input);
}

export function findTicket(query: FilterQuery<TicketDocument>, options: QueryOptions = { lean: true }) {
    return Ticket.findOne(query, {}, options).populate('ticketComments').populate('');
}

export function findAndUpdate(query: FilterQuery<TicketDocument>, update: UpdateQuery<TicketDocument>, options: QueryOptions) {
    return Ticket.findOneAndUpdate(query, update, options);
}

export function deleteTicket(query: FilterQuery<TicketDocument>) {
    return Ticket.deleteOne(query);
}

export function getStatTicket(req: any, res: any) {
    const startDate = new Date(req.query.start_date) || new Date();
    const endDate = new Date(req.query.end_date) || new Date();
    return Ticket.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: '$status',
                numTicket: { $sum: 1 }
            }
        },
        {
            $sort: {
                numTicket: -1
            }
        }
    ]);
}

export function getMonthlyTicket(month: number) {
    let sortDuration = {};
    if (month && (month < 13 || month > 1)) {
        const fullYear: number = new Date().getFullYear();
        //Check if year is a leap year
        const isLeapYear = fullYear % 400 === 0 || (fullYear % 100 !== 0 && fullYear % 4 === 0);
        const months: { [key: number]: number } = {
            1: 31,
            2: isLeapYear ? 29 : 28,
            3: 31,
            4: 30,
            5: 31,
            6: 30,
            7: 31,
            8: 31,
            9: 30,
            10: 31,
            11: 30,
            12: 31
        };
        const firstDay = `${fullYear}-${month}-01`;
        const lastDay = `${fullYear}-${month}-${months[month]}`;
        sortDuration = { createdAt: { $gte: firstDay, $lte: lastDay } };
    }
    return Ticket.find(sortDuration).populate('customer', 'name').populate('agent', 'name');
}
