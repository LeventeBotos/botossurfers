// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a player (cube)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);
player.position.z = 5; // Move player forward

// Create a ground plane
const groundGeometry = new THREE.PlaneGeometry(20, 1000);
const groundMaterial = new THREE.MeshBasicMaterial({
  color: 0x808080,
  side: THREE.DoubleSide,
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = Math.PI / 2;
scene.add(ground);

// Create obstacles (random cubes)
let obstacles = [];
function createObstacle() {
  const obstacleGeometry = new THREE.BoxGeometry(1, 1, 1);
  const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
  obstacle.position.set(Math.random() * 6 - 3, 0.5, -10); // Random x-position
  scene.add(obstacle);
  obstacles.push(obstacle);
}

// Camera position
camera.position.set(0, 2, 10);

// Game state variables
let moveLeft = false;
let moveRight = false;
let playerSpeed = 0.1;
let obstacleSpeed = 0.1;
let score = 0;
let gameOver = false;
let touchStartX = 0;
let touchEndX = 0;

// Handle touch input (swipe)
document.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener("touchend", (event) => {
  touchEndX = event.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    moveLeft = true;
    moveRight = false;
  } else if (touchEndX > touchStartX + 50) {
    moveRight = true;
    moveLeft = false;
  }
}

// Adjust player movement for swipe
function updatePlayerPosition() {
  if (moveLeft && player.position.x > -3) {
    player.position.x -= playerSpeed;
    moveLeft = false; // Reset movement after action
  } else if (moveRight && player.position.x < 3) {
    player.position.x += playerSpeed;
    moveRight = false; // Reset movement after action
  }
}

// Game loop
function animate() {
  if (gameOver) return;
  requestAnimationFrame(animate);

  // Move player based on input (swipe)
  updatePlayerPosition();

  // Move obstacles towards the player
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].position.z += obstacleSpeed;

    // Check for collisions
    if (obstacles[i].position.distanceTo(player.position) < 1) {
      gameOver = true;
      alert(`Game Over! Your Score: ${score}`);
      document.location.reload();
    }

    // Remove obstacles that are off-screen
    if (obstacles[i].position.z > 10) {
      scene.remove(obstacles[i]);
      obstacles.splice(i, 1);
      score++; // Increase score when the obstacle is avoided
    }
  }

  // Add new obstacles periodically
  if (Math.random() < 0.01) {
    createObstacle();
  }

  // Render the scene
  renderer.render(scene, camera);
}

// Adjust canvas on window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
animate();
