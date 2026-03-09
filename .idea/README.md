# Student Budget Escapes 🌍✈️

**Student Budget Escapes** is a responsive, accessible, and interactive travel blog designed specifically for university students looking for affordable weekend adventures. 

This project was developed as the final showcase for the **Web Engineering 1** course.

## 🎯 Purpose of the Project
Our client is a local university travel club (acting as a local tourism board) that needs a dedicated platform to share budget-friendly travel experiences and recommendations with fellow students[cite: 22, 23]. 

The goal of this website is to provide an easy-to-navigate, visually appealing space where users can explore local hidden gems, filter trips based on their interests (Nature vs. City), view photo galleries, and book upcoming group trips.

## 👥 Team Members
Mariana - Lead Designer (UI/UX, Wireframing, CSS Styling)
Ivan - Lead Developer (HTML Structure, JavaScript Functionality, Accessibility)
Rodrigo - Content Manager (Copywriting, Asset Gathering, Testing)

## 🚀 Features & Implementation
We built this project adhering to modern web development best practices:

**Semantic HTML:** We structured our web pages using semantic tags (`<header>`, `<main>`, `<nav>`, `<article>`, `<footer>`) to ensure high accessibility and readability for search engines and screen readers.
**Responsive Web Design (RWD):** The website fluidly adapts to mobile, tablet, and desktop screens using **CSS Flexbox** and **CSS Grid**.
**Digital Accessibility (a11y):** Following WCAG guidelines, our site is perceivable, operable, understandable, and robust.We implemented **ARIA attributes** (landmarks, states like `aria-expanded`), keyboard-navigable elements (such as the gallery lightbox), and properly paired form labels.
**Interactive JavaScript:** We included a custom destination filtering system, a mobile hamburger menu, and a photo gallery lightbox without relying on external JS libraries or a CMS.
**Extra Features:** We utilized CSS transitions, hover effects, and layout transformations to create a modern, engaging user experience.

## 💻 Technologies Used
As per the project requirements, no Content Management Systems (CMS) were used[cite: 54]. 
* **HTML5:** For page structure and semantics.
**Tailwind CSS (via CDN):** Used as our external CSS framework to handle UI guidelines, typography, and responsive grid/flexbox layouts.
* **Vanilla JavaScript:** For DOM manipulation and handling user interactions.

## 📂 Project Structure
* `index.html` - The home page featuring the latest blog posts.
* `destinations.html` - The core travel blog page featuring destination filters, an interactive map of Heidelberg, and a lightbox photo gallery.
* `about.html` - Information about our team and mission.
* `book.html` - An accessible form allowing students to request a spot on a trip.
* `contact.html` - An accessible contact form for users to submit their own hidden gem recommendations.
* `script.js` - Contains all JavaScript logic for menus, filters, lightboxes, and form handling.

## 🛠️ Instructions for Deployment / How to Run
Because this project is built entirely with static files (HTML, CSS, JS), it does not require a local server, database, or build process to run.

1. Download or clone this repository to your local machine.
2. Ensure all files (`.html` and `.js` files) are located in the exact same folder.
3. Double-click `index.html` to open it in any modern web browser (Chrome, Firefox, Safari, Edge).
4. *Optional:* The website can easily be deployed live by dropping the folder into a free static hosting service.