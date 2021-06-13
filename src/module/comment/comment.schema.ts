import { object, string, ref } from 'yup';

const payload = {
    body: object({
        comment: string().required('Comment is required').min(120, 'Comment is too short - should be 120 chars minimum.')
    })
};

const params = {
    params: object({
        commentId: string().required('commentId is required')
    })
};

export const create = object({
    ...payload
});

export const update = object({
    ...params,
    ...payload
});

export const commentDelete = object({
    ...params
});
