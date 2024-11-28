const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 400; // 캔버스 너비
canvas.height = 600; // 캔버스 높이

// 플레이어와 플랫폼 정보
let player = { x: 200, y: 0, width: 30, height: 30, velocity: 0, jumpPower: -15 };
let platforms = [];
let gravity = 0.5;
let score = 0;
let isGameOver = false;

// 고정된 첫 번째 플랫폼 생성
const basePlatform = { x: 150, y: 500, width: 100, height: 20 }; // 고정된 플랫폼
platforms.push(basePlatform); // 첫 플랫폼 추가

// 위쪽 플랫폼 생성
for (let i = 1; i < 6; i++) {
    platforms.push({
        x: Math.random() * (canvas.width - 100),
        y: basePlatform.y - i * 100,
        width: 100,
        height: 20,
    });
}

// 첫 번째 플랫폼 위에 플레이어 배치
player.y = basePlatform.y - player.height;

// 키 입력 처리
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") player.x -= 30; // 왼쪽 이동
    if (e.key === "ArrowRight") player.x += 30; // 오른쪽 이동
});

// 플레이어 위치 업데이트
function updatePlayer() {
    player.velocity += gravity; // 중력 적용
    player
