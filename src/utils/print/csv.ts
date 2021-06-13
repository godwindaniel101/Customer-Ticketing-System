var { Parser } = require('json2csv');
import { Response } from "express";

export default class CSV {
    ticket: object;
    res: Response;
    constructor(res: Response, ticket: object) {
        this.ticket = ticket;
        this.res = res;
    }
    generate() {
        const fields = ['title', 'customer.name', 'agent.name', 'description'];
        try {
            const json2csvParser = new Parser({ fields });
            const csv = json2csvParser.parse(this.ticket);
            this.res.attachment('data.csv');
            this.res.status(200).send(csv);
        } catch (error) {
            this.res.status(500).send(error.message);
        }
    }
}
