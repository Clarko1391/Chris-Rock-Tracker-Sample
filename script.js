const cursorTrace = document.querySelector("#cursorTrace");

// globals for current mouse x / y coordinates and offset
let x = 0;
let y = 0;
let y_off = 0;

// globals for tracer position
let tracerX = 0;
let tracerY = 0;

// acceleration speed of cursor animation
let speed = 0.05;

// Animation function for cursor movements (found on SO)
function animate(){
  
  let distX = x - tracerX;
  let distY = y - tracerY;
  
  tracerX = tracerX + (distX * speed);
  tracerY = tracerY + (distY * speed);
  
  cursorTrace.style.left = tracerX + "px";
  cursorTrace.style.top = tracerY + "px";
  
  requestAnimationFrame(animate);
}
animate();

// Declare a throttler to avoid blowing up our browser
let throttle = (func, delay) => {
  let prev = Date.now() - delay;
  return (...args) => {
    let current = Date.now();
    if (current - prev >= delay) {
      prev = current;
      func.apply(null, args);
    }
  }
};

// Declare a callback for updating our globals and tracer position
const handleMouseMove = (event) =>
{
  x = event.pageX;
  y = event.pageY;
  y_off = event.offsetY
  cursorTrace.style.top = `${y}px`;
  cursorTrace.style.left = `${x}px`;
}

// listener for tracking mouse position
document.addEventListener("mousemove", throttle(handleMouseMove, 10));


// listener for testing coordinates stored in globals
document.addEventListener("click", (event) => {
  console.log(x, y);
});

// grab an arbitrary element
const pugsley = document.getElementById("pugsley-1");

// Generic function for displaying custom data @ the tracer
const handleElementMessage = (element_ref, message) =>
{
  // extract element's container data from DOM
  const {x: left_bound, width, height } = element_ref.getBoundingClientRect();
  
  // infer right bounding rect extent
  const right_bound = left_bound + width;

  // set up checks for validating if the cursor is on the element or not
  const x_check = ( left_bound < x && x < right_bound ) ? true : false;
  const y_check = (0 < y_off && y_off < height ) ? true : false;

  if (x_check && y_check) {
    console.log('setting HTML');
    cursorTrace.innerHTML = message;
  }
}

const handleMessageReset = () =>
{
  cursorTrace.innerHTML = '';
}

pugsley.addEventListener('mousemove', () => {handleElementMessage(pugsley, `Hello, I'm Pugsley!`)})
pugsley.addEventListener('mouseleave', () => {handleMessageReset(pugsley)})

