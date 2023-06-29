var image = null;
var copyImage = null;
var canvas = null;

function loadImage(){
  var file = document.getElementById("image_file");
  copyImage = new SimpleImage(file);
  image = new SimpleImage(file);
  canvas = document.getElementById("canvas");
  image.drawTo(canvas);
}

function isLoaded(image){
  if(image != null && image.complete()){
    return true;
  } else {
    alert("Image not loaded");
  }
}

function loadgreyScale(){
  if(isLoaded(image)){
    image = copyImage;
    greyFilter();
    image.drawTo(canvas);
  }
}

function greyFilter(){
  
  for(var pixel of image.values()){
    var greyScale = pixel.getRed() + pixel.getGreen() + pixel.getBlue() / 3;
    
    pixel.setRed(greyScale);
    pixel.setGreen(greyScale);
    pixel.setBlue(greyScale);
  }
}

function loadRed(){
  if(isLoaded(image)){
    redFilter();
    image = copyImage;
    image.drawTo(canvas);
  }
}

function redFilter(){
  for(var pixel of image.values()){
    var average = pixel.getRed() + pixel.getGreen() + pixel.getBlue() / 3;
    
    if(average < 128){
      pixel.setRed(average*2);
      pixel.setGreen(0);
      pixel.setBlue(0);
    }
    else {
      pixel.setRed(255);
      pixel.setGreen(2*average - 255);
      pixel.setBlue(2*average - 255);
    }
  }
}

function loadRainbow(){
  if(isLoaded(image)){
    image = copyImage;
    rainbowFilter();
    image.drawTo(canvas);
  }
}

function rainbowFilter(){
  var colorHeight = image.getHeight() / 7;
  for(var pixel of image.values()){
    if(pixel.getY() < colorHeight){
      if(average(pixel) < 128){
        pixel.setRed(2*average);
        pixel.setGreen(0);
        pixel.setBlue(0);
      } else{
        pixel.setRed(255);
        pixel.setGreen(2*average - 255);
        pixel.setBlue(2*average - 255);
      }
    } else if(pixel.getY() < colorHeight*2){
      if(average(pixel) < 128){
        pixel.setRed(2*average);
        pixel.setGreen(0.8 * average);
        pixel.setBlue(0);
      } else{
        pixel.setRed(255);
        pixel.setGreen(1.2*average - 51);
        pixel.setBlue(2*average - 255);
      }
    } else if(pixel.getY() < colorHeight*3){
      if(average(pixel) < 128){
        pixel.setRed(2*average);
        pixel.setGreen(2 * average);
        pixel.setBlue(0);
      } else{
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(2*average - 255);
      }
    } else if(pixel.getY() < colorHeight*4){
      if(average(pixel) < 128){
        pixel.setRed(0);
        pixel.setGreen(2*average);
        pixel.setBlue(0);
      } else{
        pixel.setRed(2*average - 255);
        pixel.setGreen(255);
        pixel.setBlue(2*average - 255);
      }
    } else if(pixel.getY() < colorHeight*5){
      if(average(pixel) < 128){
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(2*average);
      } else{
        pixel.setRed(2*average - 255);
        pixel.setGreen(2*average - 255);
        pixel.setBlue(255);
      }
    } else if(pixel.getY() < colorHeight*6){
      if(average(pixel) < 128){
        pixel.setRed(0.8 * average);
        pixel.setGreen(0);
        pixel.setBlue(2*average);
      } else{
        pixel.setRed(1.2*average - 51);
        pixel.setGreen(2*average - 255);
        pixel.setBlue(255);
      }
    } else if(pixel.getY() < colorHeight*7){
      if(average(pixel) < 128){
        pixel.setRed(1.6 * average);
        pixel.setGreen(0);
        pixel.setBlue(1.6*average);
      } else{
        pixel.setRed(0.4*average + 153);
        pixel.setGreen(2*average - 255);
        pixel.setBlue(0.4 * average + 153);
      }
    } 

  }
}

function loadBlur(){
  if(isLoaded(image)){
    image = copyImage;
    blurFilter();
  }
}

function outOfBounds(coordinate, size){
  if(coordinate >= size){
    return size - 1;
  }
  if(coordinate < 0){
    return 0;
  }
}

function nearbyPixel(img, x, y, blurSize){
  var xBlur = Math.random() * blurSize-blurSize/2;
  var yBlur = Math.random() * blurSize-blurSize/2;
  var newX = outOfBounds(xBlur + x, img.getWidth());
  var newY = outOfBounds(yBlur + y, img.getHeight());
  return img.getPixel(newX, newY);
}

function blurFilter(){
  var output = new SimpleImage(image.getWidth(), image.getHeight());
  
  for(var pixel of image.values()){
    var x = pixel.getX();
    var y = pixel.getY();
    var newPixel = nearbyPixel(image, x, y, 10);
    
    if(Math.random() < 0.5){
      output.setPixel(x, y, pixel);
    } else {
      output.setPixel(x, y, newPixel);
    }
  }
  output.drawTo(canvas);
}

function average(pixel){
  var average = pixel.getRed() + pixel.getGreen() + pixel.getBlue() / 3;
  return average;
}

function reset(img){
  img = copyImage;
  img.drawTo(canvas);
}

// function isImageFiltered(){
//   for(var i of image.values()){
//     for(var j of copyImage.values()){
//       if (image.getPixel(i.getX(), i.getY()) != copyImage.getPixel(j.getX(), j.getY())){
//         image = copyImage;
//       }
//     }
//   }
// }

function download(){
  
  var dataURL = canvas.toDataURL();

  // Create a temporary link element
  const link = document.createElement('a');
  link.href = dataURL;

  // Set the download attribute and filename
  link.download = 'filtered_image.png';

  // Simulate a click on the link to trigger the download
  link.click();
}