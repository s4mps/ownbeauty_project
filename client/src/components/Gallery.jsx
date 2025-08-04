// src/components/Gallery.jsx
import React from "react";
import "./Gallery.css";

const Gallery = () => {
  // Sample gallery items
  const galleryItems = [
    {
      id: 1,
      image:
        "https://stripesandwhimsy.com/wp-content/uploads/2019/02/evening-skincare-routine-1-1440x2160.jpg",
      title: "Elegant Evening Look",
      description: "Perfect for special occasions and evening events",
    },
    {
      id: 2,
      image:
        "https://lovegrowswild.com/wp-content/uploads/2019/04/Must-Have-Makeup-My-Daily-Makeup-Routine-2.jpg",
      title: "Natural Day Makeup",
      description: "Fresh and light for everyday wear",
    },
    {
      id: 3,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQREnR25I9TLd54Sxp9bMOgLyTCyVEQfGoM4w&s",
      title: "Bridal Beauty",
      description: "Timeless looks for your special day",
    },
  ];

  return (
    <section id="gallery" className="gallery">
      <h2>Beauty Gallery</h2>
      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div key={item.id} className="gallery-item">
            <img src={item.image} alt={item.title} />
            <div className="gallery-item-overlay">
              <h3 className="gallery-item-title">{item.title}</h3>
              <p className="gallery-item-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
