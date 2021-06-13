const PDFGenerator = require('pdfkit');
import {   Response } from "express";
import { TicketDocument } from "../../module/ticket/ticket.model";
const fs = require('fs');

export default class PDF {
    ticket: Array<TicketDocument>;
    res: Response;
    constructor(res: Response, ticket: Array<TicketDocument>) {
        this.res = res;
        this.ticket = ticket;
    }

    generateTable(doc: any) {
        const tableTop = 70;
        const Xa = 200; //100
        const Xb = 270; //70
        const Xc = 300; //30
        const Xd = 370; //70
        const Xe = 450; //90

        doc.fontSize(10)
            .text('Title ', Xa, tableTop, { bold: true })
            .text('Customer', Xb, tableTop)
            .text('Status', Xc, tableTop)
            .text('Agent', Xd, tableTop)
            .text('Desription', Xe, tableTop);

        const items = this.ticket;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const Y = tableTop + 25 + i * 25;

            doc.fontSize(10)
                .text(item.title, Xa)
                .text(item['customer'] ? item['customer']['name'] : '-', Xb)
                .text(item['status'], Xc)
                .text(item['agent'] ? item['agent']['name'] : '-', Xd)
                .text(item['description'], Xe);
        }

    }

    generateFooter(doc: any) {
        doc.fontSize(10).text(`Payment due upon receipt. `, 50, 700, {
            align: 'center'
        });
    }

    generate() {
        let theOutput = new PDFGenerator();
        this.generateTable(theOutput);
        //call table
        this.generateFooter(theOutput);
        //call footer
        theOutput.end();

        let buffers: Array<Uint8Array> = [];
        theOutput.on('data', buffers.push.bind(buffers));
        theOutput.on('end', () => {
            try {
                let fileName = `Ticket.pdf`;
                let pdfData = Buffer.concat(buffers);
                this.res
                    .writeHead(200, {
                        'Content-Length': Buffer.byteLength(pdfData),
                        'Content-Type': 'application/pdf',
                        'Content-disposition': `attachment;filename=${fileName}`
                    })
                    .end(pdfData);
            } catch (error) {
                // this.res.status(500).send(error.message);
            }
        });
    }
}

