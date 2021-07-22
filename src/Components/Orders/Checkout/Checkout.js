import React, { Component } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import Spinner from '../../Spinner/Spinner';

import axios from 'axios';

import { connect } from 'react-redux';
import { resetIngredients } from '../../../redux/actionCreators';

const mapStateToProps = (state) => {
  return {
    ingredients: state.ingredients,
    totalPrice: state.totalPrice,
    purchasable: state.purchasable,
    userId: state.userId,
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetIngredients: () => dispatch(resetIngredients()),
  };
};

class Checkout extends Component {
  state = {
    values: {
      phone: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
    },
    paymentType: 'Cash On Delivery',
    isLoading: false,
    isModalOpen: false,
    modalMsg: '',
  };

  goBack = () => {
    this.props.history.goBack('/');
  };

  inputChangerHandler = (e) => {
    this.setState({
      values: {
        ...this.state.values,
        [e.target.name]: e.target.value,
      },
    });
  };

  paymentTypeHandler = (e) => {
    this.setState({
      paymentType: e.target.value,
    });
  };

  submitHandler = () => {
    this.setState({ isLoading: true });

    if (this.state.paymentType === 'Pay Now') {
      const order = {
        ingredients: this.props.ingredients,
        customer: this.state.values,
        price: this.props.totalPrice,
        orderTime: new Date(),
        userId: this.props.userId,
        paymentMethod: 'Pay Now',
      };

      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/payment`, order, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        })
        .then((res) => {
          if (res.data.status === 'SUCCESS') {
            this.setState({
              isLoading: false,
              isModalOpen: true,
              modalMsg:
                'Sucessfully created payment session you will now be redirected to sslcommerz page to pay',
            });
            setTimeout(() => {
              window.location = res.data.GatewayPageURL;
            }, 500);
          } else {
            console.log(res.data);
            this.setState({
              isLoading: false,
              isModalOpen: true,
              modalMsg: 'Something Went Wrong! Order Again!',
            });
          }
        })
        .catch((err) => {
          console.log(err.response?.data);
          this.setState({
            isLoading: false,
            isModalOpen: true,
            modalMsg: 'Something Went Wrong! Order Again!',
          });
        });
    } else {
      const order = {
        ingredients: this.props.ingredients,
        customer: this.state.values,
        price: this.props.totalPrice,
        orderTime: new Date(),
        userId: this.props.userId,
      };

      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/orders`, order, {
          headers: {
            Authorization: `Bearer ${this.props.token}`,
          },
        })
        .then((response) => {
          if (response.status === 201) {
            this.setState({
              isLoading: false,
              isModalOpen: true,
              modalMsg: 'Order Placed Successfully!',
            });
            this.props.resetIngredients();
          } else {
            this.setState({
              isLoading: false,
              isModalOpen: true,
              modalMsg: 'Something Went Wrong! Order Again!',
            });
          }
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
            isModalOpen: true,
            modalMsg: 'Something Went Wrong! Order Again!',
          });
        });
    }
  };

  render() {
    let form = (
      <div>
        <h4
          style={{
            border: '1px solid grey',
            boxShadow: '1px 1px #888888',
            borderRadius: '5px',
            padding: '20px',
          }}
        >
          Payment: {this.props.totalPrice} BDT
        </h4>
        <form
          style={{
            border: '1px solid grey',
            boxShadow: '1px 1px #888888',
            borderRadius: '5px',
            padding: '20px',
          }}
        >
          <input
            name='address1'
            value={this.state.values.address1}
            className='form-control'
            placeholder='Your Address 1'
            onChange={this.inputChangerHandler}
          />
          <input
            name='address2'
            value={this.state.values.address2}
            className='form-control mt-4'
            placeholder='Your Address 2'
            onChange={this.inputChangerHandler}
          />
          <br />
          <div className='row px-2 justify-content-between'>
            <div className='col-6 p-2'>
              <input
                name='phone'
                className='form-control'
                value={this.state.values.phone}
                placeholder='Your Phone Number'
                onChange={this.inputChangerHandler}
              />
            </div>
            <div className='col-6 p-2'>
              <input
                name='postcode'
                className='form-control'
                value={this.state.values.postcode}
                placeholder='Your post code'
                onChange={this.inputChangerHandler}
              />
            </div>
          </div>
          <div className='row px-2 mt-2  justify-content-between'>
            <div className='col-6 p-2'>
              <input
                name='city'
                className='form-control'
                value={this.state.values.city}
                placeholder='Your City'
                onChange={this.inputChangerHandler}
              />
            </div>
            <div className='col-6 p-2'>
              <input
                name='country'
                className='form-control'
                value={this.state.values.country}
                placeholder='Your Country'
                onChange={this.inputChangerHandler}
              />
            </div>
          </div>

          <br />
          <select
            name='paymentType'
            className='form-control col'
            value={this.state.paymentType}
            onChange={this.paymentTypeHandler}
          >
            <option value='Cash On Delivery'>Cash On Delivery</option>
            <option value='Pay Now'>Pay Now</option>
          </select>
          <br />
          <Button
            style={{ backgroundColor: '#D70F64' }}
            className='mr-auto'
            onClick={this.submitHandler}
            disabled={!this.props.purchasable}
          >
            Place Order
          </Button>
          <Button color='secondary' className='ml-1' onClick={this.goBack}>
            Cancel
          </Button>
        </form>
      </div>
    );
    return (
      <div>
        {this.state.isLoading ? <Spinner /> : form}
        <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
          <ModalBody>
            <p>{this.state.modalMsg}</p>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
