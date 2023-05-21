import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap';
import axios from 'axios'
import Swal from 'sweetalert2'


export default function ProductList() {

    const [products, setProducts] = useState([]);

    const calculateDiscountedPrice = (fullPrice, discountPercent) => {
        const discountAmount = (fullPrice * discountPercent) / 100;
        const discountedPrice = fullPrice - discountAmount;
        return discountedPrice;
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    function dynamicSort(property) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
             * and you may want to customize it to your needs
             */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    

    const fetchProducts = async () => {
        await axios.get(`https://jacknboybackend.000webhostapp.com/api/products`).then(({ data }) => {
            setProducts(data);
            data.sort(dynamicSort("-updated_at"));
            //console.log(JSON.stringify(data))
        })
    }

    const deleteProduct = async (id) => {
        const isConfirm = await Swal.fire({
            title: "Are you sure?",
            text: "you won't be able to undo this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#008080",
            cancelButtonColor: "#ff0000",
            confirmButtonText: "Yes, why not?",
            cancelButtonText: "No, I still reget it."
        }).then((result) => {
            return result.isConfirmed
        })

        if (!isConfirm) {
            return;
        }

        await axios.delete(`https://jacknboybackend.000webhostapp.com/api/products/${id}`).then(({ data }) => {
            Swal.fire({
                icon: 'success',
                text: data.message
            })
            fetchProducts()
        }).catch(({ response: { data } }) => {
            Swal.fire({
                text: data.message,
                icon: "error"
            })
        })
    }

    return (
        <div className='container'>
            <div className='row gx-1 gy-2'>
                <div className='col-12'>
                    <Link className='btn btn-primary float-end' to="/product/shop">
                        Shop View
                    </Link>
                    <Link className='btn btn-primary me-2 float-end' to="/product/create">
                        Add Product
                    </Link>
                </div>
                <div className='col-12'>
                    <div className="card shadow">
                        <div className='card-body'>
                            <div className="table-responsive overflow-hidden">
                                <table className="table table-bordered mb-0 text-center">
                                    <thead>
                                        <tr>
                                            <td>Title</td>
                                            <td>Description</td>
                                            <td>Price</td>
                                            <td>Discount</td>
                                            <td>Image</td>
                                            <td>Action</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        products.length > 0 ? (
                                            products.map((row, key) => (
                                                <tr key={key}>
                                                    <td>{row.title}</td>
                                                    <td className='textDesOverflow w-25 fixNewline'>{row.description}</td>
                                                    <td><span className='fw-bold'>{calculateDiscountedPrice(row.price, row.discount)}THB </span> <br />	&lt;- {row.price}THB</td>
                                                    <td>{row.discount}%</td>
                                                    <td><img className='img-fluid itemImageTable rounded' src={`https://jacknboybackend.000webhostapp.com/storage/product/image/${row.image}`} alt="" /></td>
                                                    <td>
                                                        <div className="row">
                                                            <div className="col-12 my-1">
                                                                <Link to={`/product/edit/${row.id}`} className='btn btn-warning me-2 w-100'><i className="bi bi-pencil-square"></i></Link>
                                                            </div>
                                                        </div>
                                                        <div className="col-12">
                                                            <Button variant='danger' className='w-100' onClick={() => deleteProduct(row.id)}>
                                                                <i className="bi bi-trash3"></i>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={'6'}>   
                                                <img src="image/bocchi-the-rock-spinning.gif" className='img-fluid' style={{maxHeight:"100px"}}/> <br />
                                                {/* <Spinner animation="border" variant="primary" />  */}
                                                <br />
                                                Loading... 
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
