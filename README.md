# NFC Attendance Panel

Admin dashboard for the [NFC Attendance API](https://github.com/andres11152/CheckPoint-NFC-API), built with React 19, TypeScript, and Vite. It lets school staff manage students, register attendance via NFC, and review attendance history and reports.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Scripts Reference](#scripts-reference)

## Overview

This is the frontend companion to the NFC Attendance API: a TypeScript admin panel that authenticates staff, manages the student roster (including bulk import from Excel), and provides real-time visibility into attendance records through a dashboard and history views.

## Features

- **Authentication:** Staff login backed by the API's JWT authentication.
- **Dashboard:** At-a-glance summary of attendance activity.
- **Student Management:** Create, update, and search students; bulk import from Excel via the `xlsx` library.
- **Attendance Registration:** Register attendance by NFC tag, including a direct-registration flow.
- **Attendance History:** Browse and filter past attendance records using MUI X Data Grid.

## Architecture

The codebase follows a layered, hexagonal-inspired structure that separates domain logic from framework and transport concerns:

| Layer | Location | Responsibility |
| --- | --- | --- |
| Domain | `src/core/domain/` | Core entities (`Student`, `Attendance`, `Auth`) and business rules, framework-agnostic. |
| Application | `src/application/use-cases/`, `src/application/providers/` | Use cases that orchestrate domain logic, plus React context providers. |
| Infrastructure | `src/infrastructure/http/` | HTTP repository implementations (`StudentRepositoryHttp`, `AttendanceRepositoryHttp`, `AuthRepositoryHttp`) that talk to the backend API via Axios. |
| Presentation | `src/pages/`, `src/components/` | Route-level pages and reusable UI components (React + MUI). |

This separation means the API client can be swapped or mocked without touching domain logic or UI components.

## Tech Stack

- **Framework:** React 19, TypeScript
- **Build Tool:** Vite
- **UI:** Material UI (MUI) v7, MUI X Data Grid, Emotion
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Animation:** Framer Motion, Lottie
- **Excel Import/Export:** SheetJS (`xlsx`)

## Project Structure

```
src/
├── application/
│   ├── providers/       # React context providers
│   └── use-cases/       # Application use cases
├── core/
│   └── domain/           # Domain entities: attendance, auth, student
├── infrastructure/
│   └── http/              # Axios-based repository implementations
├── contexts/              # React contexts (e.g. auth state)
├── components/            # Shared UI components
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── StudentsPage.tsx
│   ├── AttendanceRegisterPage.tsx
│   ├── DirectNfcRegisterPage.tsx
│   └── AttendanceHistoryPage.tsx
├── types/                 # Shared TypeScript types
├── App.tsx
└── index.tsx
```

## Getting Started

### Prerequisites

- Node.js v18 or higher
- The [NFC Attendance API](https://github.com/andres11152/CheckPoint-NFC-API) running and reachable

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/andres11152/nfc-attendance-panel.git
cd nfc-attendance-panel
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```
VITE_API_BASE=http://localhost:3000/api
```

**Security note:** Never commit a real `.env` file to version control. Keep `.env` in `.gitignore` and manage real values via your hosting platform's environment variables.

4. **Run the development server**

```bash
npm run dev
```

5. **Build for production**

```bash
npm run build
```

## Scripts Reference

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |

---

**Developed by Andrés Betancourt**
