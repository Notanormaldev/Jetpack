import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/app.store.js'
import './app/App.css'
import App from './app/App.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        style: {
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: '14px',
          borderRadius: '10px',
          background: '#FFFFFF',
          color: '#0F172A',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
          padding: '12px 16px',
        },
        success: {
          iconTheme: { primary: '#0071E3', secondary: '#FFFFFF' },
        },
        error: {
          iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
        },
      }}
    />
  </Provider>
)
