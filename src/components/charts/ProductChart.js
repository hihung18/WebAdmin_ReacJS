import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const ProductChart = () => {
  const hostCategories = process.env.REACT_APP_HOST_AUTH_CATEGORIES;
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  const [categories, setCategories] = React.useState([]);
  React.useEffect(() => {
    fetch(hostCategories, {
      headers: {
        Authorization: "Bearer " + userDetail.token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to get categories");
        }
        return response.json();
      })
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [hostCategories, userDetail.token]);
  const categoriesData = {
    labels: categories.map(
      (category) => category.categoryName.toUpperCase() + ": " + category.remain
    ),
    datasets: [
      {
        label: "# of Votes",
        data: categories.map((category) => category.remain),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  let totalRemainProducts = 0;
  for (let i = 0; i < categories.length; i++) {
    totalRemainProducts = totalRemainProducts + categories[i].remain;
  }
  return (
    <>
      <Doughnut data={categoriesData} />
      <span className="chart-note">
        Total remain of products in all categories: {totalRemainProducts}
      </span>
    </>
  );
};

export default ProductChart;
