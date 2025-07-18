# Scrapi 🐋

Scrapi is a creative web app for visual journalling, idea boards, and digital scrapbooking. Users can drag, draw, write, and customise elements on a canvas, save their creations, and revisit them through a built-in calendar view.

**Live site**: [https://scrapibook.netlify.app](https://scrapibook.netlify.app)

---

## Features

- Drag-and-drop scrapbook elements
- Add stickers from a library
- Drawing tools with brush and eraser
- Text customisation
- Board autosave and manual save
- Preview image generation using Cloudinary
- User authentication and profile setup
- Edit profile (username, display name and profile picture)
- Calendar view to revisit past boards
- Share boards on the explore page
- Visit another users public profile to view their boards

---

## Tech Stack

### Frontend

- **React** – Component-based user interface
- **Vite**
- **react-konva** – Canvas rendering and element manipulation
- **react-calendar** – Date navigation for viewing saved boards
- **react-router-dom** – Navigation of the site
- **uuid** – Generates unique identifiers for elements
- **fontfaceobserver** – Ensures fonts are fully loaded before rendering

### Backend & Hosting

- **Firebase**

    - **Authentication** – User sign-in and sign-up
    - **Firestore** – Realtime NoSQL database

- **Cloudinary**
    - Used to generate and host board preview images and user image uploads

---

## Development

### Install dependencies

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

### Production Build

```bash
npm run build
```
