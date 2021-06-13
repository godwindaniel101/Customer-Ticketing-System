let baseUrl = 'http://localhost:1337/api/v1';

let registrationUrl = `${baseUrl}/user/register`;

let loginUrl = `${baseUrl}/user/login`;

let seedUsedUrl = `${baseUrl}/user/seed-staff`;

let ticketUrl = `${baseUrl}/ticket`;

let email = Math.random().toString(36).substring(7) + '@test.com';

let refreshToken, accessToken, resetToken;
var agent = {
    name: 'Iyenogun',
    email: Math.random().toString(36).substring(7) + '@test.com',
    password: 'password',
    passwordConfirmation: 'password',
    role: 'agent'
};
var admin = {
    name: 'Godwin',
    email: Math.random().toString(36).substring(7) + '@test.com',
    password: 'password',
    passwordConfirmation: 'password',
    role: 'agent'
};
var customer = {
    name: 'Daniel',
    email: Math.random().toString(36).substring(7) + '@test.com',
    password: 'password',
    passwordConfirmation: 'password',
    role: 'customer'
};
var ticket = {
    title: 'This is title description',
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries`
};
var comment = {
    comment:
        'sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid'
};
describe('POST | Ticket  : ', () => {
    beforeEach(() => {
        agent['email'] = Math.random().toString(36).substring(7) + '@test.com';
        customer['email'] = Math.random().toString(36).substring(7) + '@test.com';
        admin['email'] = Math.random().toString(36).substring(7) + '@test.com';
    });
    /**
     *
     */
    it('Should return 201 if ticket is successfully created', () => {
        cy.authLogin(customer).then((customerRes) => {
            cy.request({
                method: 'POST',
                url: ticketUrl,
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json'
                },
                body: ticket,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + customerRes.body.accessToken, 'x-refresh': customerRes.body.refreshToken }
            }).then((ticketResponse) => {
                expect(ticketResponse.status).to.eq(201);
                expect(ticketResponse.body.data.title).to.eq(ticket.title);
                expect(ticketResponse.body.data.description).to.eq(ticket.description);
            });
        });
    });
    /***
     *
     */
    it('Should return 403 if a customer attempt commenting on a pending/closed ticket ', () => {
        cy.authLogin(customer).then((customerRes) => {
            cy.request({
                method: 'POST',
                url: ticketUrl,
                body: ticket,
                failOnStatusCode: false,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + customerRes.body.accessToken, 'x-refresh': customerRes.body.refreshToken }
            }).then((ticketResponse) => {
                cy.request({
                    method: 'POST',
                    url: `${ticketUrl}/${ticketResponse.body.data._id}/comment`,
                    body: comment,
                    headers: {
                        Authorization: 'Bearer ' + customerRes.body.accessToken,
                        'x-refresh': customerRes.body.refreshToken,
                        'Content-type': 'application/json'
                    },
                    failOnStatusCode: false
                }).then((commentResponse) => {
                    expect(commentResponse.status).to.eq(403);
                });
            });
        });
    });
    /***
     *
     */
    it('Should return 201 if a customer Comment on a open ticket is successfully created', () => {
        var ticket = {
            title: 'This is title description',
            description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries`
        };
        cy.authLogin(customer).then((customerRes) => {
            cy.request({
                method: 'POST',
                url: ticketUrl,
                body: ticket,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + customerRes.body.accessToken, 'x-refresh': customerRes.body.refreshToken }
            }).then((ticketResponse) => {
                cy.authLogin(admin).then((adminRes) => {
                    cy.request({
                        method: 'POST',
                        url: `${ticketUrl}/${ticketResponse.body.data._id}/comment`,
                        body: comment,
                        headers: { Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
                    }).then((commentResponse) => {
                        cy.request({
                            method: 'POST',
                            url: `${ticketUrl}/${ticketResponse.body.data._id}/comment`,
                            body: comment,
                            headers: { Authorization: 'Bearer ' + customerRes.body.accessToken, 'x-refresh': customerRes.body.refreshToken }
                        }).then((commentTwoResponse) => {
                            expect(commentTwoResponse.status).to.eq(201);
                            expect(commentTwoResponse.body.data.comment).to.eq(comment.comment);
                        });
                    });
                });
            });
        });
    });
    /**
     *
     */
    it('Should return 200 Admin delete a ticket', () => {
        cy.authLogin(customer).then((customerRes) => {
            cy.request({
                method: 'POST',
                url: ticketUrl,
                body: ticket,
                failOnStatusCode: false,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + customerRes.body.accessToken, 'x-refresh': customerRes.body.refreshToken }
            }).then((ticketResponse) => {
                cy.authLogin(admin).then((adminRes) => {
                    cy.request({
                        method: 'DELETE',
                        url: `${ticketUrl}/${ticketResponse.body.data._id}`,
                        body: ticket,
                        headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
                    }).then((ticketResponse) => {
                        expect(ticketResponse.status).to.eq(200);
                    });
                });
            });
        });
    });
    /***
     *
     *
     */
    it('Should return 200 Admin  gets PDF', () => {
        cy.authLogin(admin).then((adminRes) => {
            cy.request({
                method: 'GET',
                url: `${ticketUrl}/print-ticket-pdf`,
                body: ticket,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
            }).then((ticketResponse) => {
                expect(ticketResponse.status).to.eq(200);
            });
        });
    });
    /***
     *
     *
     */
    it('Should return 200 Admin  gets CSV', () => {
        cy.authLogin(admin).then((adminRes) => {
            cy.request({
                method: 'GET',
                url: `${ticketUrl}/print-ticket-csv`,
                body: ticket,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
            }).then((ticketResponse) => {
                expect(ticketResponse.status).to.eq(200);
            });
        });
    });
});
