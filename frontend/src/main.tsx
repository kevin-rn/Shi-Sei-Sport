import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { LanguageProvider } from './contexts/LanguageContext'
import './styles/base.css'
import './styles/animations.css'
import './styles/buttons.css'
import './styles/news.css'
import './styles/agenda.css'
import './styles/toggle.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
    <App />
    </LanguageProvider>
  </React.StrictMode>,
)