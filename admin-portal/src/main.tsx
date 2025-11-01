import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/globals.css'

console.log('main.tsx: Starting app...', { 
  rootElement: document.getElementById('root'),
  timestamp: new Date().toISOString() 
})

const root = document.getElementById('root')
if (!root) {
  console.error('main.tsx: ERROR - root element not found!')
  document.body.innerHTML = '<div style="color: red; padding: 20px; font-size: 18px;">ERROR: root element not found</div>'
} else {
  console.log('main.tsx: root element found, mounting React...')
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
  console.log('main.tsx: React mounted successfully')
}






