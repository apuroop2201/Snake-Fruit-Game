const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

class Snake {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        this.total = 0;
        this.tail = [];
    }

    draw() {
        ctx.fillStyle = "#000";
        for (let i = 0; i < this.tail.length; i++) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
        }
        ctx.fillRect(this.x, this.y, scale, scale);
    }

    update() {
        for (let i = 0; i < this.tail.length - 1; i++) {
            this.tail[i] = this.tail[i + 1];
        }
        if (this.total > 0) {
            this.tail[this.total - 1] = { x: this.x, y: this.y };
        }

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width) {
            this.x = 0;
        }
        if (this.y >= canvas.height) {
            this.y = 0;
        }
        if (this.x < 0) {
            this.x = canvas.width - scale;
        }
        if (this.y < 0) {
            this.y = canvas.height - scale;
        }
    }

    changeDirection(direction) {
        switch (direction) {
            case "Up":
                if (this.ySpeed !== scale * 1) {
                    this.xSpeed = 0;
                    this.ySpeed = -scale * 1;
                }
                break;
            case "Down":
                if (this.ySpeed !== -scale * 1) {
                    this.xSpeed = 0;
                    this.ySpeed = scale * 1;
                }
                break;
            case "Left":
                if (this.xSpeed !== scale * 1) {
                    this.xSpeed = -scale * 1;
                    this.ySpeed = 0;
                }
                break;
            case "Right":
                if (this.xSpeed !== -scale * 1) {
                    this.xSpeed = scale * 1;
                    this.ySpeed = 0;
                }
                break;
        }
    }

    eat(fruit) {
        if (this.x === fruit.x && this.y === fruit.y) {
            this.total++;
            return true;
        }
        return false;
    }

    checkCollision() {
        for (let i = 0; i < this.tail.length; i++) {
            if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
                return true;
            }
        }
        return false;
    }
}

class Fruit {
    constructor() {
        this.x;
        this.y;
    }

    pickLocation() {
        this.x = Math.floor(Math.random() * rows) * scale;
        this.y = Math.floor(Math.random() * columns) * scale;
        if (this.x >= canvas.width) {
            this.x = canvas.width - scale;
        }
        if (this.y >= canvas.height) {
            this.y = canvas.height - scale;
        }
    }

    draw() {
        ctx.fillStyle = "#f00";
        ctx.fillRect(this.x, this.y, scale, scale);
    }
}

let snake;
let fruit;
let gameOver = false;

(function setup() {
    canvas.width = 400;
    canvas.height = 400;
    snake = new Snake();
    fruit = new Fruit();
    fruit.pickLocation();

    window.setInterval(() => {
        if (!gameOver) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "yellow"; // Set canvas background color to yellow
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill canvas with yellow color
            fruit.draw();
            snake.update();
            snake.draw();

            if (snake.eat(fruit)) {
                fruit.pickLocation();
            }

            if (snake.checkCollision()) {
                gameOver = true;
            }

            document.querySelector(".score-value").innerText = snake.total;
        } else {
            endGame();
        }
    }, 250);
}());

window.addEventListener("keydown", (evt) => {
    const direction = evt.key.replace("Arrow", "");
    snake.changeDirection(direction);
});

function endGame() {
    if (!document.querySelector("button")) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("Game Over! Your Score: " + snake.total, 50, canvas.height / 2);
        ctx.fillText("Click 'Restart' to play again", 50, (canvas.height / 2) + 30);

        const restartButton = document.createElement("button");
        restartButton.textContent = "Restart";
        restartButton.addEventListener("click", restartGame);
        document.body.appendChild(restartButton);
    }
}

function restartGame() {
    gameOver = false;
    snake = new Snake();
    fruit.pickLocation();
    document.querySelector("button").remove();
}

