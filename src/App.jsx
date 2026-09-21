import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Layout from './components/Layout'
import Home from './pages/Home'
import Demo from './pages/Demo'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: '#0e1628',
            border: '1px solid rgba(148,180,200,0.14)',
            color: '#e8f1f8',
            fontFamily: 'Cairo, sans-serif',
          },
        }}
      />
    </BrowserRouter>
  )
}
