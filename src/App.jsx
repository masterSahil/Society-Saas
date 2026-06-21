import './App.css'
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import MainRoutes from './MainRoutes'

import { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>
      <Toaster position="top-center" />
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <MainRoutes />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
