# LibWise - Your Modern Digital Library

[![Deployment](https://img.shields.io/badge/deployment-Vercel-black?style=for-the-badge&logo=vercel)](https://libwise-beta.vercel.app/)

This project is a submission for the **NEXATHON HACKATHON**.

LibWise is a feature-rich web application designed to revolutionize how we interact with digital documents. It serves as a centralized library where users can upload, explore, and manage a vast collection of papers, books, and other digital resources.

## Team Members

-   **Frontend**:
    -   Aritra Mukherjee
    -   Shreya Jana
-   **Backend**:
    -   Santanu Manna
-   **Database**:
    -   Kumaresh Pradhan
    -   Debosmita Banerjee

## About The App

LibWise is a comprehensive platform for managing and accessing digital documents. It's built with the modern user in mind, offering a seamless and intuitive experience. Whether you're a student looking for academic papers, a researcher sharing your work, or just an avid reader, LibWise provides the tools you need.

The core of LibWise is a digital library where users can browse and search for documents. Users can contribute to the library by uploading their own documents. The platform also includes features for personal organization, such as bookmarking and tracking personal submissions.

## Tech Stack

We've used a modern, robust, and scalable tech stack to build LibWise:

-   **Framework**: [Next.js](https://nextjs.org/) - A React framework for building server-rendered and statically generated web applications.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type-safe JavaScript.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/UI](https://ui.shadcn.com/) - For a beautiful and responsive user interface.
-   **Backend & Database**: [Firebase](https://firebase.google.com/) - We use Firebase for user authentication (Firebase Auth) and as our database (Firestore), providing a real-time and scalable backend.
-   **Deployment**: [Vercel](https://vercel.com/) - For continuous deployment and hosting. The app is live at [www.libwise-beta.vercel.app](https://libwise-beta.vercel.app/).

## Features

### User Authentication

-   **Secure Signup and Login**: Users can create an account or log in using their credentials. The authentication system is powered by Firebase Auth, ensuring security and reliability.
-   **Session Management**: The application manages user sessions, keeping users logged in across browser sessions for a smooth experience.

### User Roles

LibWise has a role-based access control system to manage user permissions:

-   **User**: Regular users can:
    -   Browse and search the library.
    -   Upload their own documents.
    -   Bookmark their favorite documents.
    -   View and manage their submissions.
-   **Admin**: Admins have elevated privileges and can:
    -   Access a dedicated Admin Panel.
    -   Manage all users and their roles.
    -   Oversee all documents in the library, including approving or rejecting submissions.
    -   View application-wide statistics and analytics.


### The Library

The heart of the application is the library. It's a vast repository of documents that users can explore. Features include:

-   **Advanced Search**: Users can search for documents by title, author, or keywords.
-   **Categorization**: Documents are organized into categories for easy browsing.
-   **Document Viewer**: An integrated document viewer allows users to read documents directly in the browser.

### Admin Panel

The admin panel is a powerful tool for administrators to manage the entire platform. It provides a centralized location to manage users, documents, and system settings.

## User Experience

The user journey is designed to be simple and intuitive:

1.  **Onboarding**: A new user visits the website and is greeted with a clean landing page. They can easily sign up for a new account.
2.  **Login**: Existing users can log in to access their personalized experience.
3.  **Dashboard**: Upon logging in, the user is taken to their dashboard, which acts as their home base.
4.  **Exploration**: From the dashboard, users can navigate to the library to discover new documents.
5.  **Contribution**: Users can contribute to the community by uploading their own documents through a simple upload form.
6.  **Personalization**: Users can bookmark documents for later reading and keep track of their own submissions.

The entire interface is designed to be responsive and accessible, ensuring a great experience on any device.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone github.com/ShadowFull12/LibWise
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add your Firebase configuration keys.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
