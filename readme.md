# Node Js Web App

A Basic TTD Application to help manage customer ticketing

..Set Up Steps

1, Clone the project to your local host, <br />
2, Run the command npm install  <br />
3, Run the command <br />
     - npm run start <br />
     -npm run test:i
4, open 'Tiketing system.postman_collection <br />
//this application runs on port 1337
 <br />

**Ticket**
 <br />
-All ticket most have a title <br />
-All ticket most have a description <br />
-Only cutomers can create a ticket <br />
-Amin and agent access all ticket ticket <br />
-Only can update a ticket <br />
-Comment can only be made on an open ticket <br />
 <br />

**Comment** 
 <br />
-Users can only comment on a ticket when it is open <br />
-Only admin can delete a comment <br />
 <br />

**Customer**
 <br />
-Can register/login/changepassword/reset/password <br />
-Comment on and View Ticket created <br />
 <br />

**Agent** 
 <br />
-Can register/login/changepassword/reset/password <br />
-Can view all ticket, can open and close a ticket <br />
 <br />

**Admin**
 <br />
-Can register/login/changepassword/reset/password <br />
-Can view all ticket, can open and close a ticket <br />
-Can Access the report module to get specific ticket reports <br />
-Can Create/Delete/Update/View All Customer, Agents and Other Admins <br />
 <br />

**Seed**
 <br />
-To seed default admin, make a call to localhost:3000/seed-data <br />
-Port varies, with environment(3000 for production, 3001 for test) <br />
 <br /> <br />
--Have Fun !
