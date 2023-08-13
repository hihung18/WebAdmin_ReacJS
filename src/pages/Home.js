import React from "react";
import ProductChart from "../components/charts/ProductChart";
import OrderChart from "../components/charts/OrderChart";

const Home = () => {
  const [userDetail] = React.useState(JSON.parse(localStorage.getItem("auth")));
  if (userDetail === null) {
    window.location = "/login";
  }
  return (
    <>
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="card">
            <div className="card-body">
              <div className="chart-container">
                <div className="chart-info">
                  <ProductChart />
                </div>
                <div className="chart-info">
                <OrderChart />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
