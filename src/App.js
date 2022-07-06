import Navbar from "./Navbar"
import Graph1 from "./pages/Graph1"
import Graph2 from "./pages/Graph2"
import Graph3 from "./pages/Graph3"
import { Route, Routes } from "react-router-dom"
import * as d3 from 'd3'


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Graph1 />} />
          <Route path="/graph1" element={<Graph1 />} />
          <Route path="/graph2" element={<Graph2 />} />
          <Route path="/graph3" element={<Graph3 />} />
        </Routes>
      </div>
    </>
  )
}

export default App
