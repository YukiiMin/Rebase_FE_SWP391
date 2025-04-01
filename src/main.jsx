// Import error handlers first to ensure they're set up before other code runs
import "./utils/errorHandlers.js"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
// Only importing tailwind styles - all component styling is done with Tailwind classes
import "./tailwind.css"
// Remove the globals.css import since we're using tailwind.css
import App from "./App.jsx"
import { BrowserRouter } from "react-router-dom"
// Import i18n configuration
import "./i18n.js"

// Render the app with error handling
// try {
  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
// } catch (error) {
//   console.error("Failed to render application:", error)
//   // Fallback rendering if React fails to load
//   const rootElement = document.getElementById("root")
//   if (rootElement) {
//     rootElement.innerHTML = `
// 			<div style="padding: 20px; text-align: center;">
// 				<h1>Application Error</h1>
// 				<p>Sorry, there was an error loading the application. Please try refreshing the page.</p>
// 				<p style="color: red; font-family: monospace;">${error.message}</p>
// 			</div>
// 		`
//   }
// }

