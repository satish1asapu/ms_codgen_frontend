import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import './App.css'
import liquidParser from './liquid/liquidParser'
import Aicodegen from './components/Aicodegen/Aicodegen'
import { withStepOneValues } from './context/firstStepContext'

const baseRoute = liquidParser.parse('{{ vars["base-route"] }}')

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to={`${baseRoute}/mscodegen`} />} />
        <Route
          exact
          path={`${baseRoute}/mscodegen`}
          element={<Aicodegen />}
        ></Route>
      </Routes>
    </Router>
  )
}

export default withStepOneValues(App)
