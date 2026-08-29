const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

const gridSize = 20; // 한 칸 크기
const tileCount = canvas.width / gridSize;

let snake = [{x:8, y:8}];
let dir = {x:0, y:0};
let food = null;
let score = 0;
let running = false;
let tickInterval = 120; // ms
let timer = null;

function placeFood(){
  while(true){
    const f = { x: Math.floor(Math.random()*tileCount), y: Math.floor(Math.random()*tileCount) };
    if(!snake.some(s => s.x===f.x && s.y===f.y)) { food = f; break; }
  }
}

function reset(){
  snake = [{x:8,y:8}];
  dir = {x:0,y:0};
  score = 0;
  scoreEl.textContent = score;
  placeFood();
  running = true;
  if(timer) clearInterval(timer);
  timer = setInterval(loop, tickInterval);
}

function loop(){
  update();
  draw();
}

function update(){
  if(!running) return;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // 벽 충돌
  if(head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount){
    gameOver();
    return;
  }

  // 자기 충돌
  if(snake.some(s => s.x===head.x && s.y===head.y)) { gameOver(); return; }

  snake.unshift(head);

  // 먹이 먹었나?
  if(food && head.x===food.x && head.y===food.y){
    score += 1;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }
}

function draw(){
  // 배경
  ctx.fillStyle = '#0b0b0b';
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // 먹이
  if(food){
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x*gridSize, food.y*gridSize, gridSize, gridSize);
  }

  // 스네이크
  for(let i=0;i<snake.length;i++){
    ctx.fillStyle = i===0 ? '#2ecc71' : '#27ae60';
    ctx.fillRect(snake[i].x*gridSize, snake[i].y*gridSize, gridSize-1, gridSize-1);
  }
}

function gameOver(){
  running = false;
  clearInterval(timer);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('게임 오버 - R로 재시작', canvas.width/2, canvas.height/2);
}

document.addEventListener('keydown', e => {
  const key = e.key;
  if(key === 'ArrowUp' && dir.y!==1){ dir = {x:0,y:-1}; }
  if(key === 'ArrowDown' && dir.y!==-1){ dir = {x:0,y:1}; }
  if(key === 'ArrowLeft' && dir.x!==1){ dir = {x:-1,y:0}; }
  if(key === 'ArrowRight' && dir.x!==-1){ dir = {x:1,y:0}; }
  if(key === 'r' || key === 'R'){ reset(); }
});

// 초기화
placeFood();
draw();
