import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap';
import axios from 'axios'
import Swal from 'sweetalert2'
import AOS from 'aos';
import 'aos/dist/aos.css';


function Shop() {
  const [products, setProducts] = useState([]);

  const calculateDiscountedPrice = (fullPrice, discountPercent) => {
    const discountAmount = (fullPrice * discountPercent) / 100;
    const discountedPrice = fullPrice - discountAmount;
    return discountedPrice;
  };

  useEffect(() => {
    AOS.init();
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
      data.sort(dynamicSort("-updated_at"));
      setProducts(data);
    })
  }

  const priceClick = async () => {
    Swal.fire({
      icon:"info",
      text:"Unable to purchase because the web developer has not do the purchase and cart functions yet.",
      confirmButtonText: "I understand.",
      confirmButtonColor:"#004080",
      cancelButtonText:"I truly understand.",
      cancelButtonColor:"#ff8080",
      showCancelButton:true
    })
  }

  return (
    <div className='contanier'>
      <div className="row gx-2 gy-2">
        {products.length > 0 ? (
          products.map((row, key) => (
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-12' key={key}>
              <div className='card shadow h-100'>
                <img className='card-img-top shopImageCard' src={`https://jacknboybackend.000webhostapp.com/storage/product/image/${row.image}`} alt="" />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{row.title}</h5>
                  <p className="card-text text-break fixNewline ms-1">{row.description}</p>
                  <hr className='mt-auto' />
                  <button className='btn btn-success fw-bold w-100' onClick={priceClick}>฿{Math.ceil(calculateDiscountedPrice(row.price, row.discount))} {row.discount !== 0 ? (
                    <span className='text-decoration-line-through'>฿{row.price}</span>
                  ) : null} </button>
                </div>
              </div>

            </div>
            // <tr key={key}>
            //     <td>{row.title}</td>
            //     <td>{row.description}</td>
            //     <td><span className='fw-bold'>{calculateDiscountedPrice(row.price, row.discount)}THB </span>	&lt;- {row.price}THB</td>
            //     <td>{row.discount}%</td>
            //     <td><img className='img-fluid itemImageTable' src={`http://127.0.0.1:8000/storage/product/image/${row.image}`} alt="" /></td>
            // </tr>
          ))
        ) : (
          <div className='text-center w-100'>
            <img src="/image/bocchi-the-rock-spinning.gif" className='img-fluid' style={{maxHeight:"100px"}}/> <br />
            {/* <Spinner animation="border" variant="primary" />  */}
            <br /> Loading... </div>
        )}
      </div>
    </div>
  )
}

export default Shop