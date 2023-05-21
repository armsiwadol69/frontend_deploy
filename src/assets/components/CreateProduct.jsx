import React, { useState } from 'react'
import { Form, Button, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'


function CreateProduct() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("0");
    const [image, setImage] = useState();
    const [validationError, setValidationError] = useState({});

    const changeHandler = (event) => {
        setImage(event.target.files[0])
    }
    
    const createProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('image', image);

        Swal.fire({
            icon:"info",
            text:"Uploading...",
            showCancelButton: false,
            showConfirmButton: false
        })

        await axios.post(`https://jacknboybackend.000webhostapp.com/api/products`, formData).then(({data}) => {
            Swal.fire({
                    icon:"success",
                    text: data.message
                })
            navigate("/");
        }).catch(({response}) => {
            if (response.status === 422) {
                setValidationError(response.data.error);
            }else{
            Swal.fire({
                icon:"error",
                text: response.data.message
            })
            }
        })
    }

    // console.log(title);
  return (
    <div className='contanier'>
        <div className="row d-flex justify-content-center">
            <div className="col-12 col-sm-12 col-md-6">
                <div className="card shadow">
                    <div className="card-header">
                        New Item!
                    </div>
                    <div className="card-body">
                        <div className="form-warpper">
                            {Object.keys(validationError).lenght > 0 && (
                                <div className="row">
                                    <div className="col-12">
                                        <div className="alert alert-danger">
                                            <ul className="mb-0">
                                                {Object.entries(validationError).map(([key, value]) =>(
                                                    <li key={key}>{value}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <Form onSubmit={createProduct}>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId='Name'>
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type='text' value={title} onChange={(event) => {setTitle(event.target.value)}}/>  
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId='Description'>
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows="5" value={description} onChange={(event) => {setDescription(event.target.value)}}/>  
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId='Price'>
                                        <Form.Label>Price (THB)</Form.Label>
                                        <Form.Control type="number" value={price} onChange={(event) => {setPrice(event.target.value)}}/>  
                                        </Form.Group>
                                    </Col>
                                    <Col>
                                        <Form.Group controlId='Discount'>
                                        <Form.Label>Discount (%)</Form.Label>
                                        <Form.Control type="number" step="0.01" min={0} max={100} value={discount} onChange={(event) => {setDiscount(event.target.value)}}/>  
                                        
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mt-2'>
                                    <Col>
                                        <Form.Group controlId='image'>
                                        <Form.Label>Image</Form.Label>
                                        <Form.Control type='file' required onChange={changeHandler} />  
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" className="mt-2 btn-block w-100" type="submit"><i className="bi bi-save"></i> SAVE</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default CreateProduct