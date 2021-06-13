let baseUrl = `http://localhost:1337/api/v1/user`;

let registrationUrl = `${baseUrl}/register`;

let seedUsedUrl = `${baseUrl}/seed-staff`;

let loginUrl = `${baseUrl}/login`;

let logoutUrl = `${baseUrl}/logout`;

let forgetPasswordUrl = `${baseUrl}/forget-password`;

let resetPasswordUrl = `${baseUrl}/reset-password`;
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })



Cypress.Commands.add('authLogin', (body) => {
        cy.request({
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-type' : 'application/json'
              },
            url: seedUsedUrl,
            body
        }).then((resp1) => {
            cy.request({
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-type' : 'application/json'
                  },
                url: loginUrl,
                body,
                failOnStatusCode: false
            }).then((res2) => {
                return res2
        });
    
    });
});


Cypress.Commands.overwrite('request', (originalFn, ...args) => {
    const defaults = {
      headers: {
        'Accept': 'application/json',
        'Content-type' : 'application/json'
      }
    };
  
    let options = {};
    if (typeof args[0] === 'object' && args[0] !== null) {
      options = args[0];
    } else if (args.length === 1) {
      [options.url] = args;
    } else if (args.length === 2) {
      [options.method, options.url] = args;
    } else if (args.length === 3) {
      [options.method, options.url, options.body] = args;
    }
  
    return originalFn({...defaults, ...options, ...{headers: {...defaults.headers, ...options.headers}}});
  });