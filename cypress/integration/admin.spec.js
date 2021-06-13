let baseUrl = `http://localhost:1337/api/v1`;

let adminUrl = `${baseUrl}/admin`;

let email = Math.random().toString(36).substring(7) + '@test.com';

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
    role: 'admin'
};

describe('POST | Ticket  : ', () => {
    beforeEach(() => {
        agent['email'] = Math.random().toString(36).substring(7) + '@test.com';
        admin['email'] = Math.random().toString(36).substring(7) + '@test.com';
    });
    it('Should return 201 After creating an agent', () => {
        cy.authLogin(admin).then((adminRes) => {
            cy.request({
                method: 'POST',
                url: `${adminUrl}`,
                body: agent,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.data.name).to.eq(agent.name);
            });
        });
    });
    it('Should return 200 After updating a user', () => {
        cy.authLogin(admin).then((adminRes) => {
            cy.request({
                method: 'POST',
                url: adminUrl,
                body: agent,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
            }).then((agentRes) => {
                cy.request({
                    method: 'PATCH',
                    url: `${adminUrl}/${agentRes.body.data._id}`,
                    body: agent,
                    headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body.data.name).to.eq(agent.name);
                });
            });
        });
    });
    it('Should return 200 After Deleting a user', () => {
        cy.authLogin(admin).then((adminRes) => {
            cy.request({
                method: 'POST',
                url: adminUrl,
                body: agent,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
            }).then((agentRes) => {
                cy.request({
                    method: 'Delete',
                    url: `${adminUrl}/${agentRes.body._id}`,
                    headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + adminRes.body.accessToken, 'x-refresh': adminRes.body.refreshToken }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                });
            });
        });
    });
    it('Should return 403 if agent attempt to delete a user', () => {
        cy.authLogin(agent).then((agentRes) => {
            cy.request({
                method: 'POST',
                url: adminUrl,
                body: agent,
                headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + agentRes.body.accessToken, 'x-refresh': agentRes.body.refreshToken },
                failOnStatusCode: false
            }).then((userRes) => {
                cy.request({
                    method: 'Delete',
                    url: `${adminUrl}/${userRes.body._id}`,
                    headers: { 'Content-type': 'application/json', Authorization: 'Bearer ' + agentRes.body.accessToken, 'x-refresh': agentRes.body.refreshToken },
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(403);
                });
            });
        });
    });
});
