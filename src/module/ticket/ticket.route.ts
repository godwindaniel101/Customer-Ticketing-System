import express from 'express';
import { validateRequest, requiresAuth, hasRole } from '../../middleware';
import * as ticketSchema from './ticket.schema';
import * as ticketController from './ticket.controller';
import commentRoutes from '../comment/comment.route';
const router = express.Router();


// Get all statistics (Admin & Agents Only)
router.route('/group-statistic/:month?').get(hasRole('admin', 'agent'), ticketController.rangeStatistic);

// Get all ticket by month (Admin & Agents Only)
router.route('/all-tickets/:month?').get(hasRole('admin', 'agent'), ticketController.monthlyTicket);

// Get PDF for all ticket  (Admin & Agents Only)
router.route('/print-ticket-pdf/:month?').get(hasRole('admin', 'agent'), ticketController.pdf);

// Get CSV ticket  (Admin & Agents Only)
router.route('/print-ticket-csv/:month?').get(hasRole('admin', 'agent'), ticketController.csv);

// Get PDF ticket for user  (Admin & Agents Only)
router.route('/user-ticket/:month?').get(hasRole('admin', 'agent'), ticketController.userTicket);


//Get all Tickets
router.route('/').get(ticketController.getAllTicket);

//Create new Ticket
router.route('/').post(hasRole('customer'), validateRequest(ticketSchema.create), ticketController.create);

//Get Ticket with id
router.route('/:ticketId').get(ticketController.getTicket);

//Update Ticket
router.route('/:ticketId').patch(validateRequest(ticketSchema.update), ticketController.update);

//Comment on Ticket
router.use('/:ticketId/comment', commentRoutes);

//Delete a ticket
router.route('/:ticketId').delete(hasRole('admin','agent'), ticketController.ticketDelete);



////speial routes
export default router;
