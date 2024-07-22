class Ray {
    constructor(pos, angle) {
        this.pos = pos.copy();
        this.dir = p5.Vector.fromAngle(radians(angle));
    }

    // Check for intersection with a wall
    cast(wall) {
        const x1 = wall.a.x;
        const y1 = wall.a.y;
        const x2 = wall.b.x;
        const y2 = wall.b.y;

        const x3 = this.pos.x;
        const y3 = this.pos.y;
        const x4 = this.pos.x + this.dir.x;
        const y4 = this.pos.y + this.dir.y;

        const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (den === 0) return; // The lines are parallel or overlapping

        const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
        const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

        if (t > 0 && t < 1 && u > 0) {
            const intersectionX = x1 + t * (x2 - x1);
            const intersectionY = y1 + t * (y2 - y1);
            return createVector(intersectionX, intersectionY);
        } else {
            return; // No intersection
        }
    }
}

class Particle {
    constructor() {
        this.pos = createVector(width / 2, height / 2);
        this.velocity = createVector(0, 0);
        this.rays = [];
        // Change the restrictions of a for more/less rays
        for (let a = -20; a <= 20; a += 1) {
            this.rays.push(new Ray(this.pos, a));
        }
    }

    update() {
        this.pos.add(this.velocity);
        for (let ray of this.rays) {
            ray.pos = this.pos.copy();
        }
    }

    move(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    stopMoving() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    turn(angle) {
        for (let ray of this.rays) {
            ray.dir.rotate(angle);
        }
    }

    lookAt(walls) {
        const hits = [];
        for (let ray of this.rays) {
            let closest = null;
            let record = Infinity;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record) {
                        record = d;
                        closest = pt;
                    }
                }
            }
            hits.push(closest);
        }
        return hits;
    }

    show(walls) {
        for (let i = 0; i < this.rays.length; i++) {
            const closest = this.lookAt(walls)[i];
            if (closest) {
                stroke(255);
                line(this.pos.x, this.pos.y, closest.x, closest.y);
            }
        }
    }
}

class Wall {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1); // Start point of the wall
        this.b = createVector(x2, y2); // End point of the wall
    }

    show() {
        stroke(255); 
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}

let particle;
let walls = [];
let turnSpeed = 0.1;

function setup() {
    createCanvas(500, 500);
    
    walls.push(new Wall(300, 100, 300, 300));
    walls.push(new Wall(400, 300, 500, 200));
    walls.push(new Wall(100, 450, 400, 450));
    
    walls.push(new Wall(0, 0, 0, 500));
    walls.push(new Wall(0, 0, 500, 0));
    walls.push(new Wall(500, 500, 0, 500));
    walls.push(new Wall(500, 500, 500, 0));

    particle = new Particle();
}

function draw() {
    background(0);

    particle.update();
  
    for (let wall of walls) {
        wall.show();
    }

    particle.show(walls);
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        particle.move(-1, 0);
    } else if (keyCode === RIGHT_ARROW) {
        particle.move(1, 0);
    } else if (keyCode === UP_ARROW) {
        particle.move(0, -1);
    } else if (keyCode === DOWN_ARROW) {
        particle.move(0, 1);
    } else if (key === 'A' || key === 'a') {
        particle.turn(-turnSpeed);
    } else if (key === 'D' || key === 'd') {
        particle.turn(turnSpeed);
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
        particle.stopMoving();
    }
}

    