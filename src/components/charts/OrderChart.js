import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const OrderChart = () => {
  const hostOrdersStatus = process.env.REACT_APP_HOST_ORDERS_STATUS;
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  const [orders, setOrders] = React.useState([]);
  React.useEffect(() => {
    fetch(hostOrdersStatus, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to get orders");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        setOrders(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [hostOrdersStatus, userDetail.token]);
  const ordersData = {
    labels: orders.map(
      (order) => order.orderStatus + ": " + order.amountOrderStatus
    ),
    datasets: [
      {
        label: "# of Votes",
        data: orders.map((order) => order.amountOrderStatus),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  let totalOrders = 0;
  for (let i = 0; i < orders.length; i++) {
    totalOrders = totalOrders + orders[i].amountOrderStatus;
  }
  return (
    <>
      <Doughnut data={ordersData} />
      <span className="chart-note">
        Total order in all status: {totalOrders}
      </span>
    </>
  );
};

export default OrderChart;
