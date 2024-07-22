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

let walls = [];

function setup() {
    createCanvas(500, 500);
    
    walls.push(new Wall(300, 100, 300, 300));
    walls.push(new Wall(400, 300, 500, 200));
    walls.push(new Wall(100, 450, 400, 450));
    
    walls.push(new Wall(0, 0, 0, 500));
    walls.push(new Wall(0, 0, 500, 0));
    walls.push(new Wall(500, 500, 0, 500));
    walls.push(new Wall(500, 500, 500, 0));
}

function draw() {
    background(0);
}

