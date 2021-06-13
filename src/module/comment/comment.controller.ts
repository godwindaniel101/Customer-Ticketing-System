import { Request, Response } from "express";
import { get } from "lodash";
import {
  createComment,
  findComment,
  findAndUpdate,
  deleteComment,
} from "./comment.service";

import { findTicket, findAndUpdate as findAndUpdateTicket } from '../ticket/ticket.service'

// Create Comment
export const create = (async (req: Request, res: Response) => {
  const userId = get(req, "user._id");

  const user = get(req, "user");

  const ticketId = get(req, "params.ticketId");

  const ticket = await findTicket({ _id: ticketId });

  if (!ticket) {
    return res.status(404).json({ message: 'Ticket Not Found' });
  }

  //prevent customer from commenting on a pending ticket
  if (String(user.role) == 'customer' && ticket.status == 'pending') {
    return res.status(403).json({ message: 'Ticket Still Pending' });
  }

  //set agent in chare of a ticket
  if (!(String(user.role) == 'customer') && ticket.ticketComments.length < 1) {
    await findAndUpdateTicket({ _id: ticketId }, { agent: userId, status: 'open' }, { new: true });
  }

  //prevent everyone  from commenting on a closed ticket
  if (ticket.status == 'close') {
    return res.status(403).json({ message: 'Ticket Already Closed' });
  }

  const body = req.body;
  const comment = await createComment({ ...body, user: userId, ticket: ticketId });

  return res.status(201).json({ data: comment });
});

//  Update Comment
export const update = (async (req: Request, res: Response) => {
  const userId = get(req, "user._id");
  const _id = get(req, "params.commentId");
  const update = req.body;

  const comment = await findComment({ _id });

  if (!comment) {
    return res.sendStatus(404);
  }

  if (String(comment.user) !== userId) {
    return res.sendStatus(401);
  }

  const updatedComment = await findAndUpdate({ _id }, update, { new: true });

  return res.send(updatedComment);
})

// Get Comment
export const getComment = (async (req: Request, res: Response) => {

  const _id = get(req, "params.commentId");

  const comment = await findComment({ _id: _id });

  if (!comment) {
    return res.status(404).json({ message: 'Comment Not Found' });
  }

  return res.send(comment);
})

// Delete Comment
export const commentDelete = (async (req: Request, res: Response) => {

  const userId = get(req, "user._id");

  const _id = get(req, "params.commentId");

  const comment = await findComment({ _id: _id });

  if (!comment) {
    return res.status(404).json({ message: 'Comment Not Found' });
  }

  await deleteComment({ _id });

  return res.status(200).json({ message: 'Ok' });
})
