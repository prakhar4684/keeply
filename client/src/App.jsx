import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom'


import { AnimatePresence } from 'framer-motion'

import SharedFile from "./pages/SharedFile";
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Trash from './pages/Trash'
import Settings from './components/Settings'

import ProtectedRoute from './routes/ProtectedRoute'
import PublicRoute from './routes/PublicRoute'




function AnimatedRoutes() {


  const location = useLocation()


  return (


    <AnimatePresence mode="wait">


      <Routes
        location={location}
        key={location.pathname}
      >



        {/* PUBLIC ROUTES */}
        <Route
    path="/share/:token"
    element={<SharedFile />}
/>

        <Route
          path="/"
          element={

            <PublicRoute>

              <Landing />

            </PublicRoute>

          }
        />



        <Route
          path="/login"
          element={

            <PublicRoute>

              <Login />

            </PublicRoute>

          }
        />



        <Route
          path="/register"
          element={

            <PublicRoute>

              <Register />

            </PublicRoute>

          }
        />




        {/* PUBLIC PRICING */}

        <Route
          path="/pricing"
          element={<Pricing />}
        />

          <Route
  path="/settings"
  element={
    <ProtectedRoute>
      <Settings />
    </ProtectedRoute>
  }
/>



        {/* PROTECTED ROUTES */}


        <Route
          path="/dashboard"
          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>

          }
        />




        <Route
          path="/trash"
          element={

            <ProtectedRoute>

              <Trash />

            </ProtectedRoute>

          }
        />




      </Routes>


    </AnimatePresence>

  )

}





export default function App() {


  return (


    <Router>


      <AnimatedRoutes />


    </Router>


  )


}