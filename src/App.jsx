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
            background: '#1a0b24',
            border: '1px solid rgba(207,0,114,0.25)',
            color: '#f8eef8',
            fontFamily: 'IBM Plex Sans Arabic, Outfit, sans-serif',
          },
        }}
      />
    </BrowserRouter>
  )
}
