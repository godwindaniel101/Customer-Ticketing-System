import express from "express";
import { validateRequest, hasRole } from '../../middleware';
import * as commentSchema from './comment.schema';
import * as commentController from './comment.controller';


const router = express.Router({ mergeParams: true });

//Get Ticket Comment
router.route('/').get(commentController.getComment)

//Create Comment
router.route('/').post(validateRequest(commentSchema.create), commentController.create);

// Delete Comment
// NB: Only Admin can delete comment
router.route('/:commentId').delete(hasRole('admin'), commentController.commentDelete);

export default router