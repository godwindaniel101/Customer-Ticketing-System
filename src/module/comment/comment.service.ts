import { DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import Comment, { CommentDocument } from './comment.model';

export function createComment(input: DocumentDefinition<CommentDocument>) {
    return Comment.create(input);
}

export function findComment(query: FilterQuery<CommentDocument>, options: QueryOptions = { lean: true }) {
    return Comment.findOne(query, {}, options);
}

export function findAndUpdate(query: FilterQuery<CommentDocument>, update: UpdateQuery<CommentDocument>, options: QueryOptions) {
    return Comment.findOneAndUpdate(query, update, options);
}

export function deleteComment(query: FilterQuery<CommentDocument>) {
    return Comment.deleteOne(query);
}
export function commentComment(query: FilterQuery<CommentDocument>) {
    return Comment.deleteOne(query);
}
