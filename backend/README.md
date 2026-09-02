# MMMICS Limited Backend API

## 📋 Overview

This is the backend API for MMMICS Limited - a complete B2B corporate website with product catalogue, enquiry management, and admin dashboard.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Email**: Nodemailer (SMTP)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- Cloudinary Account
- SMTP Email Account

### Installation

```bash
# Install dependencies
npm install

# Create .env file and add your credentials
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev