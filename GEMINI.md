# GEMINI.md

## Project Name
XYOMA

---

# Project Overview

XYOMA is a futuristic luxury fashion e-commerce platform built with Next.js 14+ App Router.

The brand aesthetic is:
- Premium
- Minimal
- Cinematic
- Futuristic
- Fashion editorial inspired

Design inspiration:
- Apple
- Nike
- Balenciaga
- Ashluxe
- High-end runway fashion websites

The website sells:
- T-shirts
- Gowns
- Luxury dresses
- Streetwear collections

---

# Tech Stack

## Frontend
- Next.js 14+ App Router
- React
- Tailwind CSS
- GSAP
- @gsap/react
- react-responsive
- Zustand OR Context API

## Backend
- Next.js API Routes
- MongoDB
- Mongoose
- NextAuth.js
- Cloudinary

## Authentication
- Email/password login
- Google authentication
- JWT/session handling
- bcrypt password hashing

---

# Important Development Rules

## UI/UX Rules
- Maintain luxury fashion aesthetic
- Use minimal dark UI
- Preserve cinematic experience
- Keep spacing clean and premium
- Avoid cluttered interfaces
- Animations must feel smooth and elegant

## Animation Rules
- Use GSAP for premium motion
- Use ScrollTrigger carefully
- Keep animations subtle and cinematic
- Avoid excessive motion

## Architecture Rules
- Use scalable folder structure
- Use reusable components
- Keep frontend/backend separation clean
- Avoid duplicated logic
- Use production-grade patterns

## Code Quality Rules
- Strict TypeScript
- Clean modular code
- Reusable utilities
- Proper async/await handling
- Proper error handling
- Validate all API inputs
- Never hardcode secrets

---

# Routing Rules

## Default Route
- "/" is the primary homepage
- Navigation to collections is available via the Navbar and CTA buttons

## Collections Page
- Main landing experience
- Primary navigation exists ONLY here

---

# Navigation Requirements

The collections page navigation should include:

## Left
- XYOMA logo

## Center Links
- New Arrivals
- Men
- Women
- Collections
- Classics
- Lookbook
- Wishlist (with "New" badge)

## Right
- Search bar
- Wishlist icon
- User icon
- Cart icon

Requirements:
- Sticky navbar
- Responsive mobile menu
- Luxury fashion aesthetic
- Minimal black/white design
- Smooth hover animations

---

# Authentication Pages

Login and signup pages should have:

## Left Sidebar
- Full-height black panel
- Large white "XYOMA" branding
- Inspired by homepage hero section
- Minimal futuristic fashion design

## Right Side
- Existing auth forms

Requirements:
- Preserve auth logic
- Do not break validation
- Responsive layout
- Smooth subtle animations

---

# Product System

Products support:
- title
- description
- price
- category
- stock
- images
- sizes
- featured
- gender

## Gender Enum
- male
- female
- unisex

Collections include:
- Gowns
- T-shirts
- Luxury dresses
- Streetwear

---

# Admin Dashboard

Admin capabilities:
- Add products
- Edit products
- Delete products
- Upload multiple images
- Manage stock
- Toggle featured products
- Manage categories

Requirements:
- Admin-only access
- Modern dark dashboard UI
- Clean responsive tables
- Cloudinary integration

---

# Cart System

Requirements:
- Add to cart
- Remove from cart
- Quantity updates
- Persistent cart
- Cart count in navbar

---

# Search System

Requirements:
- Real-time search
- Product filtering
- Search by:
  - title
  - category
  - gender
  - collection

---

# Cloudinary Rules

- Use Cloudinary for all product uploads
- Store secure URLs only
- Optimize uploads
- Handle upload errors properly

---

# Folder Structure

```txt
/app
/components
/components/admin
/components/collections
/lib
/models
/store
/utils
/hooks
/providers
/actions