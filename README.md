# ✈️ Flight Ticket Management System

A modern **Flight Ticket Management System** designed to provide a realistic airline/flight-booking experience with flight search, passenger management, booking workflows, ticket generation, authentication, payments, and real-time aviation data.

The project is designed with a **API-first and lightweight architecture**, minimizing the need to maintain a large custom backend or massive local flight database. Instead of storing thousands of flights and schedules ourselves, the system can integrate with professional aviation APIs to retrieve live flight information and availability.

---

## 🌐 Project Overview

Traditional flight-management projects often require maintaining large databases containing:

* Airlines
* Airports
* Aircraft
* Flight schedules
* Routes
* Fares
* Seat availability
* Flight status
* Booking information

This project takes a different approach.

### Our architecture

```text
                    ┌──────────────────────┐
                    │       USER           │
                    │   Web Application    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      FRONTEND        │
                    │ HTML / CSS / JS      │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌──────────────────┐        ┌──────────────────┐
       │  Flight API      │        │ Managed Backend  │
       │ Duffel/Amadeus   │        │ / Serverless     │
       └────────┬─────────┘        └────────┬─────────┘
                │                           │
                ▼                           ▼
       Real flight data             Users / Bookings
       Prices / Offers              Passenger data
       Availability                 Application data
                                            │
                                            ▼
                                   ┌────────────────┐
                                   │   Database     │
                                   │ PostgreSQL /   │
                                   │ Supabase       │
                                   └────────────────┘
```

The goal is to keep the application **professional, scalable, secure, and significantly easier to maintain** than a traditional monolithic CRUD system.

---

# 🚀 Features

## ✈️ Flight Search

Search flights using:

* Departure airport/city
* Arrival airport/city
* Travel date
* Number of passengers
* Cabin class

Flight information can be retrieved from an external aviation API rather than relying entirely on manually maintained flight records.

---

## 🔎 Flight Results

Display professional flight cards containing information such as:

* Airline
* Flight number
* Departure time
* Arrival time
* Duration
* Stops
* Fare
* Baggage allowance
* Cabin class
* Availability

---

## 🎫 Flight Booking

Users can:

1. Search flights
2. Select an offer
3. Enter passenger details
4. Review the booking
5. Complete payment
6. Receive a booking confirmation
7. Access their ticket/booking later

---

## 👤 User Authentication

The system is designed to support:

* User registration
* Login
* Logout
* Secure authentication
* User profiles
* Booking history

Authentication can be handled using a managed authentication provider such as **Supabase Auth**, reducing the amount of custom authentication code required.

---

## 💳 Payment Integration

The application can integrate with payment providers such as:

* Razorpay
* Stripe

The application should never directly handle sensitive card information.

---

## 🧾 Digital Tickets

After a successful booking, the system can generate a digital ticket containing:

```text
Passenger Name
Booking Reference
Airline
Flight Number
Departure
Arrival
Date
Time
Seat
Cabin
Payment Status
```

---

## 📊 User Dashboard

Authenticated users can access:

* Upcoming flights
* Previous bookings
* Booking details
* Passenger information
* Payment status
* Digital tickets
* Profile information

---

## 🛫 Live Flight Information

Optional aviation integrations can provide:

* Flight status
* Aircraft position
* Departure status
* Arrival status
* Delays
* Estimated arrival
* Live aircraft tracking

Possible providers include:

* Duffel
* Amadeus
* OpenSky
* Aviationstack

---

# 🧠 Design Philosophy

The main goal of this project is:

> **Don't rebuild infrastructure that professional services already provide. Build the application itself.**

Instead of maintaining a huge local database containing every flight in the world, the application retrieves aviation information from specialized APIs.

Instead of implementing every authentication feature manually, managed authentication can be used.

Instead of building a large traditional backend, lightweight serverless functions can handle operations that require protected API keys or server-side logic.

This significantly reduces:

* Backend complexity
* Database maintenance
* Server management
* Security risks
* Development time
* Debugging overhead

---

# 🛠️ Technology Stack

| Layer           | Technology                     |
| --------------- | ------------------------------ |
| Frontend        | HTML5, CSS3, JavaScript        |
| UI              | Bootstrap / Custom CSS         |
| Backend         | Node.js / Serverless Functions |
| APIs            | REST APIs                      |
| Flight Data     | Duffel / Amadeus               |
| Authentication  | Supabase Auth                  |
| Database        | PostgreSQL / Supabase          |
| Payments        | Razorpay / Stripe              |
| Flight Tracking | OpenSky / Aviationstack        |
| Version Control | Git                            |
| Repository      | GitHub                         |
| Deployment      | Vercel / Render / Netlify      |

> The exact technologies may evolve as development progresses.

---

# 📁 Project Structure

The project is designed to remain modular while avoiding unnecessary backend complexity.

```text
Flight-Ticket-Management/
│
├── database/
│   └── database.sql
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── assets/
│
├── views/
│   ├── auth/
│   ├── flights/
│   ├── booking/
│   ├── dashboard/
│   └── partials/
│
├── api/
│   ├── search-flights/
│   ├── create-booking/
│   └── payment/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

The final structure may change as the project evolves.

---

# 🔐 Environment Variables

Sensitive credentials must **never be committed to GitHub**.

Create a local `.env` file:

```env
# Application
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flight_ticket_db

# Flight API
FLIGHT_API_KEY=your_api_key

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Gateway
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

### ⚠️ Never commit `.env`

The repository contains a `.gitignore` configured to exclude:

```text
.env
.env.*
node_modules/
logs/
dist/
build/
credentials.json
*.pem
*.key
```

A safe template should be maintained in:

```text
.env.example
```

---

# 💻 Local Development

## 1. Clone the repository

```bash
git clone https://github.com/AbhiGradient/Flight_Ticket_Management
cd Flight-Ticket-Management
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Configure environment variables

Create:

```text
.env
```

Copy the required variables from:

```text
.env.example
```

and add your own credentials.

---

## 4. Configure the database

If using the local development database, open:

```text
database/database.sql
```

using MySQL Workbench and execute the SQL script.

The database can then be accessed through:

```text
localhost:3306
```

---

## 5. Start the development server

```bash
npm start
```

or, depending on the project configuration:

```bash
node app.js
```

---

## 6. Open the application

```text
http://localhost:3000
```

---

# 🗄️ Database Philosophy

The database is intentionally kept lightweight.

Instead of storing the entire aviation ecosystem locally, the application primarily stores **application-owned data**.

For example:

```text
users
profiles
bookings
passengers
payments
notifications
```

External flight providers can handle:

```text
airlines
flight schedules
flight offers
availability
fares
aircraft
```

This prevents the database from becoming unnecessarily large and difficult to maintain.

---

# 🔄 Booking Flow

The intended booking flow is:

```text
User
 │
 ▼
Search Flight
 │
 ▼
Flight API
 │
 ▼
Flight Offers
 │
 ▼
Select Flight
 │
 ▼
Passenger Details
 │
 ▼
Price / Availability Verification
 │
 ▼
Payment
 │
 ▼
Booking API
 │
 ▼
Booking Confirmation
 │
 ▼
Store Booking Reference
 │
 ▼
Digital Ticket
```

---

# 🔒 Security

Security is an important part of the project.

### API Keys

Secret API keys must remain on the server/serverless environment.

```text
❌ Browser → Secret API Key
```

Instead:

```text
Browser
   ↓
Serverless Function
   ↓
Secret API Key
   ↓
External API
```

### Environment Variables

Secrets are stored in:

```text
.env
```

and excluded from Git.

### Payments

Payment information should be processed through a trusted payment provider rather than stored directly in the application's database.

---

# 📡 External API Architecture

The application can integrate with specialized services.

### Flight Booking APIs

**Duffel / Amadeus**

Used for:

```text
Flight Search
Flight Offers
Pricing
Availability
Booking
```

### Flight Tracking

**OpenSky / Aviationstack**

Used for:

```text
Live Aircraft Information
Flight Status
Position
Altitude
Speed
Estimated Arrival
```

### Authentication & Backend Services

**Supabase**

Used for:

```text
Authentication
PostgreSQL Database
Managed Backend Services
```

---

# 📈 Scalability

The architecture is designed so that different components can scale independently.

```text
Frontend
   │
   ├──────────────► Flight API
   │
   ├──────────────► Authentication
   │
   └──────────────► Serverless Functions
                         │
                         ├──► Booking API
                         ├──► Payment API
                         └──► Database
```

This avoids forcing every request through a single large server.

---

# 🧪 Development Strategy

Development will be performed in stages.

### Phase 1 — UI

* Landing page
* Search interface
* Flight cards
* Login/Register
* Dashboard
* Booking pages

### Phase 2 — Flight API

* Flight search
* Flight results
* Filters
* Sorting
* Flight details

### Phase 3 — Authentication

* Registration
* Login
* Logout
* User profiles

### Phase 4 — Booking

* Passenger information
* Booking confirmation
* Booking history
* Digital tickets

### Phase 5 — Payments

* Payment gateway
* Payment verification
* Booking confirmation

### Phase 6 — Advanced Features

* Live flight tracking
* Notifications
* Email confirmation
* QR-code tickets
* Cancellation
* Refund workflows
* Admin analytics

---

# 🎯 Project Objectives

The project aims to demonstrate practical implementation of:

* REST API integration
* External service integration
* Modern frontend development
* Authentication
* Cloud databases
* Serverless architecture
* Payment gateway integration
* Secure API key management
* Flight booking workflows
* Real-world data processing
* Git/GitHub collaboration

---

# 🚧 Current Status

> **Development in progress 🚀**

The project architecture and database foundation are being established first, followed by frontend development and external API integration.

---

# 🗺️ Future Roadmap

* [ ] Modern landing page
* [ ] Flight search interface
* [ ] Airport autocomplete
* [ ] Real flight API integration
* [ ] Flight filtering and sorting
* [ ] User authentication
* [ ] User dashboard
* [ ] Passenger management
* [ ] Flight booking workflow
* [ ] Payment gateway
* [ ] Digital ticket generation
* [ ] QR-code ticket
* [ ] Email confirmation
* [ ] Booking cancellation
* [ ] Refund management
* [ ] Live flight tracking
* [ ] Admin dashboard
* [ ] Analytics
* [ ] Cloud deployment
* [ ] Mobile responsive optimization

---

# 👥 Team

**Flight Ticket Management System**

Developed as an academic/software engineering project.

Team members can be added here:

```text
1. ABHISHEK SAPKALE — ORDINARY LABOUR
2. SAUJAS SALUNKE — LEADER
3. SARTH DANGE — LABOUR
4. OM SHAHANE — LABOUR
5. SOHAM RANADHIR — LABOUR
```

---

# 🤝 Contributing

Contributions are welcome.

### Basic workflow

```bash
git pull
git checkout -b feature/your-feature
```

Make your changes, then:

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

Create a Pull Request on GitHub.

### Commit convention

Recommended prefixes:

```text
feat:     New feature
fix:      Bug fix
docs:     Documentation
style:    UI/style changes
refactor: Code restructuring
perf:     Performance improvement
test:     Tests
chore:    Configuration/maintenance
```

Example:

```text
feat: add flight search interface
fix: resolve booking validation issue
docs: update API setup instructions
chore: configure environment variables
```

---

# ⚠️ Important Development Rules

### Never commit secrets

```text
.env
API keys
database passwords
private keys
service-account files
payment secrets
```

### Never expose secret API keys in frontend JavaScript.

### Never store raw payment card information.

### Always validate external API responses.

### Always validate user input on the server side.

### Never trust data coming directly from the browser.

---

# 📜 License

This project is currently developed for **academic and educational purposes**.

License terms can be updated when the project reaches production-ready status.

---

# ⭐ Project Vision

The ultimate goal is to transform this project from a conventional college CRUD application into a **realistic, API-driven flight booking platform**.

Instead of recreating the infrastructure of an airline, the system focuses on building the actual user experience while leveraging professional external services for aviation data, authentication, payments, and cloud infrastructure.

```text
                    ✈️
             FLIGHT TICKET
             MANAGEMENT
                 SYSTEM

      Search → Compare → Book → Pay
                    ↓
                 Travel
```

**Built to learn. Designed to scale. ✈️**
