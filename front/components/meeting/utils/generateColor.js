// ./utils/generateColor.js

const generateColor = (index) => {
    const colors = ["#333333", "#FF5733", "#33FF57", "#3333FF", "#FF33E9", "#33FFFF", "#FFD733", "#9A33FF", "#33FFDA", "#FF336E",
    "#555555", "#FF855E", "#55FF85", "#5555FF", "#FF66FF", "#55FFFF", "#FFE07C", "#AE55FF", "#77FFC4", "#FF69B4",
    "#777777", "#FFAB86", "#77FFAB", "#7777FF", "#FF9CFF", "#77FFFF", "#FFEF9E", "#D080FF", "#AAFFDA", "#FF90CC",
    "#999999", "#FFCBB2", "#99FFCB", "#9999FF", "#FFC6FF", "#99FFFF", "#FFF4B8", "#E0A3FF", "#C4FFE7", "#FFB5E0",
    "#BBBBBB", "#FFE4D9", "#BBFFEF", "#BBBBFF", "#FFE9FF", "#BBFFFF", "#FFFCE1", "#F2C7FF", "#D8FFEF", "#FFD7EC"];
    return colors[index % colors.length];
  }
  
  export default generateColor;