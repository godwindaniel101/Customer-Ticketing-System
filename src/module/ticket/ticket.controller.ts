import { Request, Response } from 'express';
import asyncError from '../../utils/error/asyncError';
import { get } from 'lodash';
import { createTicket, findTicket, findAndUpdate, deleteTicket, getStatTicket, getMonthlyTicket } from './ticket.service';
import PDF from '../../utils/print/pdf';
import CSV from '../../utils/print/csv';

//  Create Ticket
export const create = asyncError(async (req: Request, res: Response) => {
    const userId = get(req, 'user._id');
    const body = req.body;
    const ticket = await createTicket({ ...body, user: userId });
    return res.status(201).json({ data: ticket });
});

// Get All Ticket
export const getAllTicket = asyncError(async (req: Request, res: Response) => {
    const userId = get(req, 'user._id');
    const user = get(req, 'user');

    const ticket = user.role === 'customer' ? await findTicket({ customer: userId }) : await findTicket({});

    //Ensure customer acn only view ticket they created
    if (!ticket) return res.status(404).json({ message: 'No Record found' });

    return res.status(200).json({ data: ticket });
});

//  Get Update
export const update = asyncError(async (req: Request, res: Response) => {
    const _id = get(req, 'params.ticketId');
    const update = req.body;

    const ticket = await findTicket({ _id: _id });

    if (!ticket) return res.status(404).json({ message: 'No Record found' });

    const updatedTicket = await findAndUpdate({ _id }, update, { new: true });

    return res.status(200).json({ data: updatedTicket });
});

//  Get Ticket
export const getTicket = asyncError(async (req: Request, res: Response) => {
    const user = get(req, 'user');

    const userId = get(req, 'user._id');

    const ticketId = get(req, 'params.ticketId');

    const ticket = await findTicket({ _id: ticketId });

    if (!ticket) return res.status(404).json({ message: 'No Record found' });

    //Ensure customer an only view ticket they created
    if (user.role === 'customer' && String(ticket.customer) !== userId) return res.sendStatus(401);

    return res.status(200).json({ data: ticket });
});

// Delete Ticket
export const ticketDelete = asyncError(async (req: Request, res: Response) => {
    const userId = get(req, 'user._id');

    const _id = get(req, 'params.ticketId');

    const ticket = await findTicket({ _id });

    if (!ticket) return res.status(404).json({ message: 'No Record found' });

    await deleteTicket({ _id });

    return res.sendStatus(200);
});

//  Get Statistic of the ticket for a period of time $start_date to $end_date
export const rangeStatistic = asyncError(async (req: Request, res: Response) => {
    const ticket = await getStatTicket(req, res);

    return res.status(200).json({ data: ticket });
});

// Get Ticket by Roles (Admin or Agent)
export const userTicket = asyncError(async (req: Request, res: Response) => {
    const month = get(req, 'params.month');

    const user = get(req, 'user');

    const ticket = user.role == 'customer' ? await findTicket({ customer: user._id }) : await findTicket({ agent: user._id });

    return res.status(200).json({ data: ticket });
});

// Get ticket by month (sorted)
export const monthlyTicket = asyncError(async (req: Request, res: Response) => {
    const month = get(req, 'params.month');

    const ticket = await getMonthlyTicket(month);

    return res.status(200).json({ data: ticket });
});

// Generate PDF
export const pdf = asyncError(async (req: Request, res: Response) => {
    const month = get(req, 'params.month');

    const ticket = await getMonthlyTicket(month);

    const pdfDoc = new PDF(res, ticket);

    return pdfDoc.generate();
});

// Generate CSV
export const csv = asyncError(async (req: Request, res: Response) => {
    const month = get(req, 'params.month');

    const ticket = await getMonthlyTicket(month);

    const csvDoc = new CSV(res, ticket);

    return csvDoc.generate();
});
