import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import image01 from "../../assets/Image 01.png";
import temprature from "../../assets/Temperarure-icon.png";
import automationIntergration from "../../assets/Automated-integration.png";
import inteligentAutoMation from "../../assets/Intelligent-automation.png";
import dataAnalisis from "../../assets/Data-analysis.png";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* ===== Banner Section ===== */}
      <section className="banner">
        <div className="banner-overlay">
          <div className="banner-content">
            <h1>Smart Greenhouse Automation</h1>
            <p>Monitor • Control • Optimize your greenhouse from anywhere</p>
            {/* <button
              className="banner-btn"
              onClick={() => navigate("/ourProduc")}
            >
              Explore Our Product
            </button> */}
          </div>
        </div>
      </section>

      {/* ===== About Us Section ===== */}
      <section className="about">
        <div className="about-container">
          <div className="about-cards">
            <div className="about-card">
              <img
                src={temprature}
                alt="Temprerature"
                className="about-card-image"
              />
              <h3>Smart Climate Monitoring</h3>
              <p>
                Real-time tracking of temperature, humidity, and CO₂ levels to
                maintain growing conditions inside the greenhouse.
              </p>
            </div>

            <div className="about-card">
              <img
                src={automationIntergration}
                alt="Temprerature"
                className="about-card-image"
              />
              <h3>Automated Irrigation Control</h3>
              <p>
                Intelligent watering system that activates based on soil
                moisture levels, reducing water waste and improving crop health.
              </p>
            </div>

            <div className="about-card">
              <img
                src={inteligentAutoMation}
                alt="Temprerature"
                className="about-card-image"
              />
              <h3>Intelligent Automation</h3>
              <p>
                Automatically controls fans, humidifiers, and lights using
                predefined rules for a stable and balanced environment.
              </p>
            </div>
            <div className="about-card">
              <img
                src={dataAnalisis}
                alt="Temprerature"
                className="about-card-image"
              />
              <h3>Data Analytics & Insights</h3>
              <p>
                Visual dashboards and historical data help farmers analyze
                trends, optimize resources, and improve crop yield.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Existing Home Section ===== */}
      <section className="home">
        <div className="home-container">
          <div className="home-content">
            {/* <p className="home-title">
              <p className="home-highlight">About Us</p>
            </p> */}
            <p className="home-highlight">About Us</p>
            <h1 className="home-title">Smart Automation For Modern Farming</h1>
            <p className="home-description">
              We are focused on building smart and sustainable greenhouse
              solutions using Internet of Things (IoT) technology. Our system
              continuously monitors environmental conditions such as
              temperature, humidity, soil moisture, and CO₂ levels to create an
              optimal growing environment for crops.
            </p>
            <p className="home-description">
              By combining automation with real-time data monitoring, we help
              farmers reduce manual effort, conserve resources, and improve crop
              productivity. Our goal is to make modern agricultural technology
              accessible, efficient, and easy to use for small- and medium-scale
              farmers.
            </p>
            {/* <p className="home-description">
              Our platform brings all greenhouse data into a single, easy-to-use
              dashboard, allowing users to monitor conditions and control
              systems from anywhere. With automated responses and real-time
              insights, farmers can make timely decisions, reduce risks, and
              maintain consistent crop growth throughout the year.
            </p> */}
          </div>

          <div className="home-content">
            <img
              src={image01}
              alt="Greenhouse Controller"
              className="home-image"
            />
          </div>
        </div>
      </section>
    </>
  );
}
