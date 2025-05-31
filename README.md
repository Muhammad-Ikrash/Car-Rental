
# Car Rental Management System

A modern and interactive **Car Rental Management System** web application built with React and SQL backend stored procedures.  
This project allows users to browse available cars, filter by multiple criteria, view detailed car information, and proceed to rent vehicles seamlessly.

---

## Features

- **Homepage** displaying multiple cars with filtering options:
  - Filter by brand, model, year, type, transmission, driver option, and seats.
- **Dynamic Car Details Page**:
  - Shows detailed info, images, and customer reviews of a selected car.
  - Includes a rental button that toggles a rental form.
- **Responsive and intuitive UI** with modern design principles.
- **Backend stored procedures** for managing cars, users, bookings, transactions, and payments.
- **Routing** implemented with React Router to navigate between pages and pass car IDs.
- **Custom components** for car cards, filter controls, and interactive buttons with state management.
- **API integration** fetching car data dynamically by car ID.

---

## Tech Stack

- **Frontend**: React (with hooks), React Router v6
- **Backend**: SQL Server with stored procedures for business logic
- **Styling**: CSS (flexbox layout, custom button styles)
- **API**: Postman endpoints for fetching car data

---

## Getting Started

### Prerequisites

- Node.js & npm installed
- SQL Server or compatible database with the provided stored procedures and schema set up
- Backend API running locally or remotely

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/car-rental-management.git
cd car-rental-management
````

2. Install dependencies

```bash
npm install
```

3. Set up environment variables (create `.env` file):

```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

4. Run the app

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

---

## Usage

* On the homepage, browse and filter cars using the filters panel.
* Click on any car card to navigate to the detailed dashboard page.
* The dashboard fetches car info dynamically via API using the car ID passed in the route.
* Click “Rent this Car” to reveal the rental form (future implementation).
* Use navigation to return to homepage or explore other features.

---


## Acknowledgments

* React documentation
* SQL Server stored procedures best practices
* Open source UI inspiration
