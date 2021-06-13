import { object, string } from 'yup';
export const create = object({
    body: object({
        title: string().required('Title is required'),
        description: string().required('Description is required').min(120, 'Description is too short - should be 120 chars minimum.'),
        status: string().oneOf(['open', 'close', 'pending'])
    })
});

export const update = object({
    params: object({
        ticketId: string().required('ticketId is required')
    }),
    body: object({
        status: string().oneOf(['open', 'close', 'pending'])
    })
});

export const deleteTicket = object({
    params: object({
        ticketId: string().required('ticketId is required')
    })
});
