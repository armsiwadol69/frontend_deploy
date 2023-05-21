import React, { useEffect,useState } from 'react'
import { Form, Button, Row, Col, Card } from 'react-bootstrap'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import { data } from 'jquery'

function EditProduct() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [discount, setDiscount] = useState("0");
    const [image, setImage] = useState();
    const [validationError, setValidationError] = useState({});
    const [cImageName, setCurrentImage] = useState("");

    useEffect(() => {
        fetchProduct();
    },[]);

    

    const fetchProduct = async() => {
        await axios.get(`https://jacknboybackend.000webhostapp.com/api/products/${id}`).then(({data}) => {
            const {title, description , price , discount ,image} = data.product;
            setTitle(title);
            setDescription(description);
            setPrice(price);
            setDiscount(discount);
            setImage(image);
            setCurrentImage(`http://127.0.0.1:8000/storage/product/image/`+image);
        
            
        }).catch(({response:{data}}) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    const changeHandler = (event) => {
        setImage(event.target.files[0])
    }

    const updateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PATCH')
        formData.append('title', title);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('discount', discount);
        if (image != null) {
            formData.append('image', image);
        }

        console.log(formData);
        Swal.fire({
            icon:"info",
            text:"Uploading...",
            showCancelButton: false,
            showConfirmButton: false
        })

        await axios.post(`https://jacknboybackend.000webhostapp.com/api/products/${id}`,formData).then(({data}) =>{
            Swal.fire({
                icon:"success",
                text: data.message
            })
            navigate("/")
        }).catch(({response})=> {
            if (response.status === 422) {
                setValidationError(response.data.error)
            }else{
                Swal.fire({
                    text: response.data.error,
                    icon:"error"
                })
            }
        })

    }

  return (
    <div className='contanier'>
        <div className="row">
            <div className="col-lg-6 col-xl-6 col-sm-12 col-md-6">
                <div className="card shadow">
                    <div className="card-header">
                        Edit item
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
                            <Form onSubmit={updateProduct}>
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
                                        <Form.Control type='file' onChange={changeHandler} />  
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Button variant="primary" className="mt-3 btn-block w-100" type="submit"><i className="bi bi-save"></i> UPDATE</Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-lg-6 col-xl-6 col-sm-12 col-md-6'>
                <div className="card shadow h-100">
                    <div className="card-header">
                    Current image
                    </div>
                    <div className="card-body d-flex align-items-center">
                    <img className='img-fluid rounded' loading='lazy' src={cImageName} alt="" />
                    </div>
                </div>
                
            </div>
        </div>
    </div>
  )
}

export default EditProduct