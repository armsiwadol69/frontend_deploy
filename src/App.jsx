import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Navbar } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ProductList from './assets/components/ProductList'
import CreateProduct from './assets/components/CreateProduct'
import EditProduct from './assets/components/EditProduct'
import Shop from './assets/components/Shop'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar bg="secondary" className='shadow'>
        <Container>
          <Link to={"/"} className='navbar-brand text-white'>
             Jacknboy's Shop CRUD TEST
          </Link>
        </Container>
      </Navbar>
        <Container className="mt-2">
        <Row>
            <Col className='text-center'>
            <img className='rounded' src="/image/cover_1.jpg" style={{maxWidth:"100%",maxHeight:"200px",objectFit:"contain"}} alt=""/>
            </Col>
    
          <Col md={12} className='mt-2'>
            <Routes>
              <Route exact path='/' element={<ProductList/>} />
              <Route path='/product/create' element={<CreateProduct/>} />
              <Route path='/product/edit/:id' element={<EditProduct/>} />
              <Route path='/product/shop' element={<Shop/>} />
            </Routes>
          </Col>
          <Col className='text-center my-2'>
            <p>Simple CRUD wep app project for study React.js as Frontend and Laravel as Backend.</p>
          </Col>
        </Row>
      </Container>
    </Router>
  )
}

export default App
