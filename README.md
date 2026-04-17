# Vue Portfolio Manager

A web application for managing a project portfolio, built with Vue and SQLite. It allows users to add, view, and manage a list of projects.

## Features

- **Add and Edit Projects**: Add new projects or edit existing ones through a form. This includes adding to a list of languages and categories.
- **Project List**: View a list of all added projects with their details.
- **Filtering**: Filter projects by language, category, start date, and end date.
- **Data Persistence**: Project data is stored in an SQLite database to save across runs.

## Usage

### Prerequisites

- [Node.js](https://nodejs.org/) (version ^20.19.0 || >=22.12.0)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/obrockmole/Vue-Portfolio-Manager.git
   cd Vue-Portfolio-Manager
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running

1. **Start the backend server:**
   ```bash
   node server.js
   ```

2. **Start the frontend server:**
   ```bash
   npm run dev
   ```