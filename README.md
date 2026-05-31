# Architect System

Architect System is a modern project and task management platform built with Next.js 15, React 19, and Tailwind CSS 4. It provides a robust set of features for administrators, managers, and workers to collaborate effectively on projects and tasks.

## Key Features

- **Role-Based Access Control**: Tailored experiences for Admin, Manager, and Worker roles.
- **Project Management**: Create, assign, and track project progress.
- **Task Management**: Fine-grained task control with status transitions, assignments, and history tracking.
- **Analytics Dashboard**: Comprehensive insights into deadlines, workload, and performance.
- **Help Requests**: Integrated system for workers to request assistance on specific tasks.
- **Audit Logs**: Full transparency for administrators to monitor system-wide actions.
- **Notification System**: Real-time feedback and unread count tracking.
- **Dark Mode Support**: Seamless theme switching for better user experience.

## Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/`: Next.js App Router directory containing pages, components, and layouts.
  - `actions/`: Server Actions for handling data mutations.
  - `components/`: Reusable UI components.
  - `context/`: React Context providers (e.g., Toast, Theme).
  - `lib/`: Utility functions and API fetching logic.
  - `(routes)/`: Specialized route folders for Projects, Tasks, Users, etc.
- `public/`: Static assets.

## Deployment

The project is optimized for deployment on the [Vercel Platform](https://vercel.com/).
