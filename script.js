/* script.js
   Part 2: JS functions illustrating parameters, return values, local vs global scope
   Part 3: functions that trigger CSS animations by adding and removing classes
*/

/* ---------- Part 2: functions and scope demo ---------- */

// Global state variable demonstrating global scope
let globalCounter = 0;

/**
 * add
 * parameters: a, b
 * returns: numeric sum
 * This demonstrates a function that accepts parameters and returns a value.
 */
function add(a, b) {
  // coerce to number to be safe
  return Number(a) + Number(b);
}

/**
 * greet
 * shows local variable and return usage
 */
function greet(name = 'guest') {
  const greeting = `hi ${name}`; // local variable only inside function
  return greeting;
}

/**
 * incrementLocal
 * uses a local variable named count that is created each call.
 * It does not affect globalCounter.
 */
function incrementLocal() {
  let count = 0; // local, recreated each call
  count += 1;
  return count; // caller receives the incremented local value
}

/**
 * incrementGlobal
 * updates the globalCounter variable and returns the new value.
 * demonstrates modifying global scope from inside a function.
 */
function incrementGlobal() {
  globalCounter += 1;
  return globalCounter;
}

/* ---------- Part 3: reusable animation helper functions ---------- */

/**
 * toggleClass
 * parameters: selector string, className string
 * returns: boolean indicating whether class is present after toggle
 * This is a reusable small function that controls DOM classes.
 */
function toggleClass(selector, className) {
  const el = document.querySelector(selector);
  if (!el) return false;
  el.classList.toggle(className);
  return el.classList.contains(className);
}

/**
 * animateOnce
 * parameters:
 *  - selector: element selector
 *  - animationClass: CSS class that has an animation
 *  - duration: how long to keep the class (ms)
 * returns: timeout id so caller can clear if needed
 */
function animateOnce(selector, animationClass, duration = 700) {
  const el = document.querySelector(selector);
  if (!el) return null;
  // ensure reflow so repeated animations trigger reliably
  el.classList.remove(animationClass);
  void el.offsetWidth;
  el.classList.add(animationClass);

  const id = setTimeout(() => {
    el.classList.remove(animationClass);
  }, duration);
  return id;
}

/**
 * openModal / closeModal
 * show/hide modal by toggling the 'open' class
 * returns: boolean success
 */
function openModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  if (!modal) return false;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  return true;
}
function closeModal(modalSelector) {
  const modal = document.querySelector(modalSelector);
  if (!modal) return false;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  return true;
}

/* ---------- DOM wiring and examples ---------- */
document.addEventListener('DOMContentLoaded', function () {
  // Part 2 wiring: add numbers
  const num1 = document.getElementById('num1');
  const num2 = document.getElementById('num2');
  const addBtn = document.getElementById('addBtn');
  const sumResult = document.getElementById('sumResult');

  addBtn.addEventListener('click', function () {
    // add returns a value we use to update the DOM
    const result = add(num1.value, num2.value);
    sumResult.textContent = `result: ${result}`;
  });

  // Part 2 wiring: scope demo
  const incLocalBtn = document.getElementById('incLocal');
  const incGlobalBtn = document.getElementById('incGlobal');
  const localOut = document.getElementById('localOut');
  const globalOut = document.getElementById('globalOut');

  incLocalBtn.addEventListener('click', function () {
    // shows that incrementLocal does not change the globalCounter
    const value = incrementLocal();
    localOut.textContent = `returned local value: ${value}`;
  });

  incGlobalBtn.addEventListener('click', function () {
    const value = incrementGlobal();
    globalOut.textContent = `globalCounter is now: ${value}`;
  });

  // Part 3 wiring: animate a box using animateOnce helper
  const animateBoxBtn = document.getElementById('animateBoxBtn');
  animateBoxBtn.addEventListener('click', function () {
    // animateOnce adds the 'anim-pop' class which has keyframes in CSS
    animateOnce('#animBox', 'anim-pop', 700);
  });

  // also let clicking the box animate it
  const animBox = document.getElementById('animBox');
  animBox.addEventListener('click', () => animateOnce('#animBox', 'anim-pop', 700));

  // Flip card: use toggleClass helper and show returned boolean
  const flipBtn = document.getElementById('flipBtn');
  const flipCard = document.getElementById('flipCard');

  flipBtn.addEventListener('click', function () {
    const isNowFlipped = toggleClass('#flipCard', 'flipped');
    // update accessible state
    flipCard.setAttribute('aria-pressed', String(isNowFlipped));
  });

  // Also allow tapping the card to flip
  flipCard.addEventListener('click', function () {
    const isNowFlipped = toggleClass('#flipCard', 'flipped');
    flipCard.setAttribute('aria-pressed', String(isNowFlipped));
  });

  // Spinner start / stop
  const spinner = document.getElementById('spinner');
  const startSpin = document.getElementById('startSpin');
  const stopSpin = document.getElementById('stopSpin');

  startSpin.addEventListener('click', function () {
    spinner.classList.add('spinning');
    spinner.setAttribute('aria-hidden', 'false');
  });
  stopSpin.addEventListener('click', function () {
    spinner.classList.remove('spinning');
    spinner.setAttribute('aria-hidden', 'true');
  });

  // Modal open/close
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');

  openModalBtn.addEventListener('click', function () {
    openModal('#demoModal');
  });
  closeModalBtn.addEventListener('click', function () {
    closeModal('#demoModal');
  });

  // Close modal when clicking outside the content
  document.getElementById('demoModal').addEventListener('click', function (e) {
    if (e.target === this) closeModal('#demoModal');
  });

  // keyboard escape to close modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal('#demoModal');
  });
});
