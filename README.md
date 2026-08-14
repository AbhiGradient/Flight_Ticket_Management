# Flight Ticket Management System

Node.js + Express + EJS + MySQL — PBL Project (5 members)

## Setup
1. `npm install`
2. Import `database/database.sql` into MySQL
3. Edit `.env` with your MySQL credentials
4. Register a user at `/register`
5. Make yourself admin in MySQL:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
