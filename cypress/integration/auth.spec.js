
let baseUrl = 'http://localhost:1337/api/v1/user';

let registrationUrl = `${baseUrl}/register`;

let loginUrl = `${baseUrl}/login`;

let logoutUrl = `${baseUrl}/logout`;

let forgetPasswordUrl = `${baseUrl}/forget-password`;

let resetPasswordUrl = `${baseUrl}/reset-password`;

let email = Math.random().toString(36).substring(7) + '@test.com';

let refreshToken, accessToken, resetToken;

describe('Registration : ', () => {
    beforeEach(() => {
        email = Math.random().toString(36).substring(7) + '@test.com';
    });
    it('Should return 422 validation error on empty body', () => {
        cy.request({
            method: 'POST',
            url: registrationUrl,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
        });
    });
    it('Should return 422 validation error on partial form', () => {
        let body = {
            name: 'User',
            email: '',
            password: 'password',
            passwordConfirmation: 'Not Password'
        };
        //no email
        cy.request({
            method: 'POST',
            url: registrationUrl,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
        });
    });
    it('Should return 422 unmatched password', () => {
        let body = {
            name: 'User',
            email: email,
            password: 'password',
            passwordConfirmation: 'Not Password'
        };
        cy.request({
            method: 'POST',
            url: registrationUrl,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
        });
    });
    it('Should return 201 on successful registration', () => {
        let body = {
            name: 'User',
            email: email,
            password: 'password',
            passwordConfirmation: 'password'
        };
        cy.request({
            method: 'POST',
            url: registrationUrl,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(201);
        });
    });
});

describe('Login : ', () => {
    beforeEach(() => {
        email = Math.random().toString(36).substring(7) + '@test.com';
    });
    it('Should return 422 validation error on empty body', () => {
        cy.request({
            method: 'POST',
            url: loginUrl,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
        });
    });
    it('Should return 422 validation error on partial form', () => {
        let body = {
            email: '',
            password: 'password'
        };
        //no email
        cy.request({
            method: 'POST',
            url: loginUrl,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
        });
    });

    it('Should return 200 on successful login', () => {
        let body = {
            name: 'User',
            email: email,
            password: 'password',
            passwordConfirmation: 'password'
        };
        cy.request({
            method: 'POST',
            url: registrationUrl,
            body,
            failOnStatusCode: false
        }).then((response) => {
            cy.request({
                method: 'POST',
                url: loginUrl,
                body: body,
                failOnStatusCode: false
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });
});

describe('Logout : ', () => {
    beforeEach(() => {
        email = Math.random().toString(36).substring(7) + '@test.com';
    });
    it('Should return 200 after successful logout', () => {
        let body = {
            name: 'User',
            email: email,
            password: 'password',
            passwordConfirmation: 'password'
        };
        cy.request({
            method: 'POST',
            url: registrationUrl,
            body
        }).then((resp1) => {
            cy.request({
                method: 'POST',
                url: loginUrl,
                body,
                failOnStatusCode: false
            }).then((res2) => {
                cy.request({
                    method: 'POST',
                    url: logoutUrl,
                    headers: { Authorization: 'Bearer ' + res2.body.accessToken, 'x-refresh': res2.body.refreshToken }
                }).then((response) => {
                    expect(response.status).to.eq(200);
                });
            });
        });
    });
});

describe('Forget Password: ', () => {
    beforeEach(() => {
        email = Math.random().toString(36).substring(7) + '@test.com';
    });
    it('Should return 422 on invalid email', () => {
        let body = {
            name: 'User',
            email: 'notvalid',
            password: 'password',
            passwordConfirmation: 'password'
        };
        cy.request({
            method: 'POST',
            url: forgetPasswordUrl,
            body: body,
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(422);
        });
    });
    it('Should return 200 on reset on a forgotten password', () => {
        let body = {
            name: 'User',
            email: email,
            password: 'password',
            passwordConfirmation: 'password'
        };
        cy.request({
            method: 'POST',
            url: registrationUrl,
            body
        }).then((resp1) => {
            cy.request({
                method: 'POST',
                url: forgetPasswordUrl,
                body: body,
                failOnStatusCode: false
            }).then((res1) => {
                cy.request({
                    method: 'PATCH',
                    url: resetPasswordUrl + '/' + res1.body.resetToken,
                    body: body,
                    failOnStatusCode: false
                }).then((response) => {
                    expect(response.status).to.eq(200);
                });
            });
        });
    });
});
