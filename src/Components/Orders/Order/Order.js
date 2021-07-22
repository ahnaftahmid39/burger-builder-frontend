import React from 'react';

const Order = (props) => {
  const ingredientSummary = props.order.ingredients.map((item) => {
    return (
      <span
        style={{
          border: '1px solid grey',
          borderRadius: '5px',
          padding: '5px',
          marginRight: '10px',
        }}
        key={item.type}
      >
        {item.amount}x{' '}
        <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
      </span>
    );
  });
  return (
    <div
      style={{
        border: '1px solid grey',
        boxShadow: '1px 1px #888888',
        borderRadius: '5px',
        padding: '20px',
        marginBottom: '10px',
      }}
    >
      <p>Order Number: {props.order._id}</p>
      <p>Delivery Address: {props.order.customer.address1}</p>
      {/* <p>Delivery Address 2: {props.order.customer.address2}</p> */}
      {/* {props.order.paymentMethod === 'Pay Now' ? (
        <>
          {' '}
          <p className='badge badge-info'>Paid according to users’ choice.</p>
          <p>Order status: {props.order.orderStatus}</p>
          <p>Payment status: {props.order.paymentStatus}</p>
          <p>Transaction Id: {props.order.tran_id}</p>
        </>
      ) : (
        <div>
          <p className='badge badge-info'>Cash on delivery</p>
        </div>
      )} */}
      <p>
        Order Status:{' '}
        {props.order.paymentMethod === 'Pay Now'
          ? `Paid according to users’ choice.`
          : 'Cash on delivery'}
      </p>
      <hr />
      {ingredientSummary}
      <hr />
      <p>Total: {props.order.price} BDT</p>
    </div>
  );
};

export default Order;
