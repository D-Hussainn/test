
const $timer = document.querySelector('.timer');
const $score = document.querySelector('.score');
const $life = document.querySelector('.life');
const $game = document.querySelector('.game');
const $start = document.querySelector('.start');
const $$cells = document.querySelectorAll('.cell');
 
const holes = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // Represent holes as a 1-dimensional array
let started = false;
let score = 0;
let time;
let life;
let timerId;
let tickId;
 
$start.addEventListener('click', () => {
    if (started) return; // Ignore if already started
    started = true;
    console.log('Start');
    life = 3;////////////levens
    $life.textContent = life; 
    time = 30;////////tijd
    timerId = setInterval(() => {
        time = (time * 10 - 1) / 10; // Alternatively, time -= 0.1, but there may be floating point calculation issues
        $timer.textContent = time;
        if (time === 0) {
            clearInterval(timerId);
            clearInterval(tickId);
            setTimeout(() => {
                alert(`Game over! Your score is ${score} points`);
                score = 0;
                $score.textContent = score;
                life = 0;
                $life.textContent = life;
                started = false;
            }, 50);
        }
    }, 100);
    tickId = setInterval(tick, 1000);
    tick();
});
 
let gopherPercent = 0.3;
let bombPercent = 0.5;
 
// Function to make gophers and bombs appear and disappear every 1 second
function tick() {
    for (let index = 0; index < holes.length; index++) {
        const hole = holes[index];
        // If there is a value in the holes array, it means a gopher is visible, so we don't add a timer in that case
        if (hole) continue; // Continue if something is happening, which ensures setTimeout is executed once every 2 seconds
        const randomValue = Math.random();
        if (randomValue < gopherPercent) {
            const $gopher = $$cells[index].querySelector('.gopher');
            // If a timer is registered, a non-zero value is recorded in the array, and if there is no timer, 0 is stored in the array, so we can distinguish whether there is a gopher or not in each cell
            holes[index] = setTimeout(() => {
                // Disappear after 1 second
                $gopher.classList.add('hidden');
                holes[index] = 0;
            }, 1000);
            $gopher.classList.remove('hidden');
        } else if (randomValue < bombPercent) {
            const $bombs = $$cells[index].querySelector('.bomb');
            holes[index] = setTimeout(() => {
                // Disappear after 1 second
                $bombs.classList.add('hidden');
                holes[index] = 0;
            }, 1000);
            $bombs.classList.remove('hidden');
        }
    }
}
 
for (let index = 0; index < $$cells.length; index++) {
    const $cell = $$cells[index];
    $cell.querySelector('.gopher').addEventListener('click', (event) => {
        if (!event.target.classList.contains('dead')) {
            score += 1;
            $score.textContent = score;
        }
        event.target.classList.add('dead');
        event.target.classList.add('hidden');
        // If the gopher is hit while it's coming up, it should immediately go down, so the existing timer that makes it disappear after 1 second needs to be cleared
        clearTimeout(holes[index]); // Clear the existing timer for going down
        setTimeout(() => {
            holes[index] = 0;
            event.target.classList.remove('dead');
        }, 1000);
    });
    $cell.querySelector('.bomb').addEventListener('click', (event) => {
        if (!event.target.classList.contains('boom')) {
            life -= 1;
            $life.textContent = life;
        }
        event.target.classList.add('boom');
        event.target.classList.add('hidden');
        clearTimeout(holes[index]);
        setTimeout(() => {
            holes[index] = 0;
            event.target.classList.remove('boom');
        }, 1000);
        if (life === 0) {
            clearInterval(timerId);
            clearInterval(tickId);
            setTimeout(() => {
                alert(`Game over! Your score is ${score} points`);
                score = 0;
                $score.textContent = score;
                life = 0;
                $life.textContent = life;
                started = false;
            }, 50);
        }
    });
}
 