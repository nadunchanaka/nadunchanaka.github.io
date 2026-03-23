import React from "react";
import "./Procut.css";
import sensor from "../../assets/Sensor.png";
import dashBoard from "../../assets/dashBoard.png";

interface ProductCardProps {
  name: string;
  image: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  image,
  description,
}) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-content">
        <h3 className="product-title">{name}</h3>
        <p className="product-description">{description}</p>
      </div>
    </div>
  );
};

const Product: React.FC = () => {
  const products: ProductCardProps[] = [
    {
      name: "IoT Soil Moisture Sensor",
      image: sensor,
      description:
        "Accurate real-time soil moisture sensor, compatible with GreenGuard system.",
    },
    {
      name: "Greenhouse Dashboard",
      image: dashBoard,
      description:
        "Web & mobile dashboard to monitor and control all your greenhouse devices.",
    },
  ];

  return (
    <>
      <section className="product-section">
        <div className="product-container">
          <h2 className="product-heading">Our Products</h2>
          <div className="product-grid">
            {products.map((product, idx) => (
              <ProductCard key={idx} {...product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Product;
