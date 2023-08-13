import React from "react";
import { Button, Table, Modal, Form, Row } from "react-bootstrap";

const OrdersManagement = () => {
  const hostOrders = process.env.REACT_APP_HOST_ORDERS;
  const [showUpdate, setUpdate] = React.useState(false);
  const closeUpdateOrder = () => setUpdate(false);
  const openUpdateOrder = () => setUpdate(true);

  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }

  const [orders, setOrders] = React.useState([]);
  const [ordersFollowStatus, setOrdersFollowStatus] = React.useState([]);

  //for update
  const [orderPhone, setOrderPhone] = React.useState("");
  const [orderAddress, setOrderAddress] = React.useState("");
  const [orderStatus, setOrderStatus] = React.useState("");

  const [orderUpdate, setOrderUpdate] = React.useState({});

  //status of order
  const STATUS = [
    "CART",
    "PREPARE",
    "SHIPPING",
    "SUCCESS",
    "CONFIRM",
    "CANCELED",
  ];
  const [statusSelected, setStatusSelected] = React.useState("ALL");

  React.useEffect(() => {
    fetch(hostOrders, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setOrdersFollowStatus(data);
      })
      .catch((err) => console.log(err));
  }, [hostOrders, userDetail.token]);

  const UpdateOrder = async (id) => {
    console.log(orderUpdate);
    const response = await fetch(hostOrders + id, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: orderUpdate.userId,
        orderPhone: orderUpdate.orderPhone,
        orderAddress: orderUpdate.orderAddress,
        orderStatus: orderUpdate.orderStatus,
        orderDetails: orderUpdate.orderDetails,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update product");
    }
    const data = await response.json();
    console.log(data);
    let updatedOrders1 = ordersFollowStatus.map((order) => {
      if (order.orderId === data.orderId) {
        return {
          ...order,
          orderPhone: data.orderPhone,
          orderAddress: data.orderAddress,
          orderStatus: data.orderStatus,
        };
      }
      return order;
    });
    let updatedOrders2 = orders.map((order) => {
      if (order.orderId === data.orderId) {
        return {
          ...order,
          orderPhone: data.orderPhone,
          orderAddress: data.orderAddress,
          orderStatus: data.orderStatus,
        };
      }
      return order;
    });
    setOrdersFollowStatus(updatedOrders1);
    if (statusSelected !== "ALL") {
      let updateOrdersStatus1 = updatedOrders1.filter(
        (order) => order.role === statusSelected
      );
      setOrdersFollowStatus(updateOrdersStatus1);
    }
    setOrders(updatedOrders2);
  };

  const DeleteOrder = async (id) => {
    console.log(id);
    const response = await fetch(hostOrders + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }
    const data = await response.json();
    console.log(data);

    const updatedOrders1 = ordersFollowStatus.filter(
      (order) => order.orderId !== id
    );
    setOrdersFollowStatus(updatedOrders1);
    const updatedOrders2 = orders.filter((order) => order.orderId !== id);
    setOrders(updatedOrders2);
  };

  const SetOrdersFollowStatus = (status) => {
    console.log(status);
    if (status !== "ALL") {
      let ordersWithStatus = orders.filter(
        (order) => order.orderStatus === status
      );
      setOrdersFollowStatus(ordersWithStatus);
      console.log(ordersWithStatus);
    } else {
      setOrdersFollowStatus(orders);
      console.log(ordersFollowStatus);
    }
  };
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="act-top">
            <div className="select">
              <select
                className="form-select"
                id="select-option"
                onChange={(e) => {
                  SetOrdersFollowStatus(e.target.value);
                  setStatusSelected(e.target.value);
                }}
              >
                <option value="ALL">All status</option>
                <option value={STATUS[0]}>{STATUS[0]}</option>
                <option value={STATUS[1]}>{STATUS[1]}</option>
                <option value={STATUS[2]}>{STATUS[2]}</option>
                <option value={STATUS[3]}>{STATUS[3]}</option>
                <option value={STATUS[4]}>{STATUS[4]}</option>
                <option value={STATUS[5]}>{STATUS[5]}</option>
              </select>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <Table className="table-products table-hover">
                <thead>
                  <tr>
                    <th style={{ width: "100px" }}>Order ID</th>
                    <th style={{ width: "100px" }}>User ID</th>
                    <th style={{ width: "160px" }}>Phone</th>
                    <th style={{ width: "300px" }}>Address</th>
                    <th style={{ width: "100px" }}>Status</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersFollowStatus &&
                    ordersFollowStatus.map((order, index) => (
                      <tr key={index}>
                        <td>{order.orderId}</td>
                        <td>{order.userId}</td>
                        <td>{order.orderPhone}</td>
                        <td>{order.orderAddress}</td>
                        <td>
                          <button className="btn-outline-status">
                            {order.orderStatus}
                          </button>
                        </td>
                        <td>
                          {order.orderStatus !== "CART" && order.orderStatus !== "SUCCESS" && <button
                            className="btn-update"
                            onClick={() => {
                              console.log(order);
                              setOrderUpdate(order);
                              openUpdateOrder();
                            }}
                          >
                            update
                          </button>}
                        </td>
                        <td>
                          {
                            <button
                              className="btn-delete"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you wish to delete this item?"
                                  )
                                )
                                  DeleteOrder(order.orderId);
                              }}
                            >
                              delete
                            </button>
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Update */}
      <Modal show={showUpdate} onHide={closeUpdateOrder}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group as={Row} className="mp-3">
              <Form.Label>Order ID</Form.Label>
              <Form.Control
                id="inputOrderId"
                type="text"
                value={orderUpdate.orderId}
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                id="inputUserId"
                type="text"
                value={orderUpdate.userId}
                readOnly={true}
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                id="inputOrderPhone"
                type="text"
                value={orderUpdate.orderPhone}
                readOnly={true}
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    orderPhone: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                id="inputOrderAddress"
                type="text"
                value={orderUpdate.orderAddress}
                readOnly={true}
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    orderAddress: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group as={Row} className="mp-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                onChange={(e) =>
                  setOrderUpdate({
                    ...orderUpdate,
                    orderStatus: e.target.value,
                  })
                }
              >
                <option value={orderUpdate.orderStatus}>
                  {orderUpdate.orderStatus}
                </option>
                {/* {orderUpdate.orderStatus !== STATUS[0] && (
                  <option value={STATUS[0]}>{STATUS[0]}</option>
                )} */}
                {orderUpdate.orderStatus !== STATUS[1] && (
                  <option value={STATUS[1]}>{STATUS[1]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[2] && (
                  <option value={STATUS[2]}>{STATUS[2]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[3] && (
                  <option value={STATUS[3]}>{STATUS[3]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[4] && (
                  <option value={STATUS[4]}>{STATUS[4]}</option>
                )}
                {orderUpdate.orderStatus !== STATUS[5] && (
                  <option value={STATUS[5]}>{STATUS[5]}</option>
                )}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeUpdateOrder}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              UpdateOrder(orderUpdate.orderId);
              console.log(orderUpdate);
              closeUpdateOrder();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrdersManagement;
