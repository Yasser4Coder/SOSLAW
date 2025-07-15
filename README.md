# SOSLAW - Professional Legal Services Website

A modern, multilingual, responsive React application built with Vite and Tailwind CSS for professional legal services.

## 🚀 Features

- **Modern React (Vite)** - Fast development and build times
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Multilingual** - Fully translatable in English, Arabic (RTL), and French
- **RTL/LTR Support** - Automatic direction switching based on language
- **Professional Structure** - Well-organized folder structure for scalability
- **Responsive Design** - Mobile-first approach with beautiful UI
- **Component-Based Architecture** - Reusable components for maintainability
- **Modern Navigation**
  - Main links: Home, About, Contact, Join Our Team
  - Dropdowns: Consulting branches (with nested submenus), More (Services, Legal Library, Our Consultants)
  - Mobile and desktop menus, accessible and keyboard-friendly
- **Customizable Hero Section**
  - Main button: "Request Your Legal Consultation" (fully translatable)
- **Sign In/Register Button**
  - Prominent in the header, fully translatable

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation header
│   ├── Footer.jsx      # Site footer
├── pages/              # Page components
│   └── Home.jsx        # Home page
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Main application layout
├── hooks/              # Custom React hooks
│   └── useCounter.js   # Counter functionality hook
├── utils/              # Utility functions and constants
│   └── constants.js    # Application constants
├── services/           # API services (future use)
├── context/            # React context providers (future use)
├── assets/             # Static assets
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles with Tailwind
```

## 🛠️ Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript** - ES6+ features
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing
- **react-i18next** - Internationalization and translation

## 🌍 Multilingual & RTL Support

- **Languages:** English, Arabic (RTL), French
- **Automatic direction switching** for RTL/LTR based on selected language
- **Translation files** in `src/locales/en/`, `ar/`, and `fr/`
- **All navigation, buttons, and content** are fully translatable

## 🧭 Navigation & UX

- **Header Navigation:**
  - Home, About, Contact, Join Our Team
  - Consulting branches (dropdown with nested submenus)
  - More (dropdown: Services, Legal Library, Our Consultants)
  - Sign In | Register with Us button (header, always visible)
- **Hero Section:**
  - Main button: "Request Your Legal Consultation" (translatable, not tied to sign in/register)
- **Responsive:**
  - Mobile and desktop menus
  - Dropdowns and submenus are touch and keyboard accessible

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd SOSLAW
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Tailwind CSS Configuration

The project uses Tailwind CSS with custom configuration in `tailwind.config.js`. You can:

- Add custom colors in the `theme.extend.colors` section
- Add custom components in `src/index.css` using `@layer components`
- Modify the content paths to include additional file types

### Custom Components

- **Header** - Navigation header with responsive menu, dropdowns, and language switcher
- **Footer** - Site footer with branding and quick links
- **MainLayout** - Layout wrapper for consistent page structure

### Custom Hooks

- **useCounter** - Custom hook for counter functionality

## 📱 Responsive Design

The application is built with a mobile-first approach using Tailwind CSS responsive utilities:

- **Mobile** - Default styles (no prefix)
- **Tablet** - `md:` prefix (768px and up)
- **Desktop** - `lg:` prefix (1024px and up)

## ♿ Accessibility

- All navigation and dropdowns are keyboard accessible
- Proper ARIA roles and focus management
- Color contrast and focus indicators for usability

## 🔧 Development

### Adding New Components

1. Create your component in the appropriate folder:
   - `src/components/` for reusable UI components
   - `src/pages/` for page components
   - `src/layouts/` for layout components
2. Export your component and import where needed

### Adding New Pages

1. Create a new page component in `src/pages/`
2. Add routing logic (when implementing routing)
3. Update navigation in `src/components/Header.jsx`

### Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Create custom components in `src/index.css` using `@layer components`
- Follow the existing color scheme and design patterns
- Use responsive design principles

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist` folder with optimized production files.

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure build settings if needed

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.

---

**SOSLAW** - Professional legal services and solutions
