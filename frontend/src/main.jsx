import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx';
import App from './app/App.jsx'
const clientid = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientid}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </GoogleOAuthProvider>,
)
