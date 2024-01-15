// ./utils/generateColor.js

const generateColor = (index) => {
  const colors = [
    "#FF4222",
    "#1E1E99",
    "#FF27C5",
    "#29D4FF",
    "#FFBB22",
    "#8522D9",
    "#22D9BB",
    "#FF214D",
    "#444444",
    "#FF7C55",
    "#44FF77",
    "#4444CC",
    "#FF55FF",
    "#44DDDD",
    "#FFCE66",
    "#9E44FF",
    "#66FFBB",
    "#FF4D99",
    "#666666",
    "#FF8C66",
    "#66FF8C",
    "#6666CC",
    "#FF77FF",
    "#66EEEE",
    "#FFD55C",
    "#B05DFF",
    "#88FFC4",
    "#FF61A9",
    "#888888",
    "#FFB39D",
    "#88FFB3",
    "#8888CC",
    "#FFA3FF",
    "#88FFFF",
    "#FFE68C",
    "#C37FFF",
    "#A2FFD7",
    "#FF97D8",
    "#999999",
    "#FFD0B9",
    "#99FFD0",
    "#9999CC",
    "#FFC1FF",
    "#99DDDD",
    "#FFE3A6",
    "#DA82FF",
    "#B6FFEA",
    "#FFA4D7"
  ];
  
    return colors[index % colors.length];
  }

 
  
  export default generateColor;