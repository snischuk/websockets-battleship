export interface Ship {
  position: { x: number; y: number };
  length: number;
  direction: boolean;
  type: 'small' | 'medium' | 'large' | 'huge';
}

export class ShipModel {
  position: { x: number; y: number };
  length: number;
  direction: boolean;
  type: 'small' | 'medium' | 'large' | 'huge';
  hits: boolean[];

  constructor(ship: Ship) {
    this.position = ship.position;
    this.length = ship.length;
    this.direction = ship.direction;
    this.type = ship.type;
    this.hits = Array(this.length).fill(false);
  }

  registerHit(x: number, y: number): boolean {
    for (let i = 0; i < this.length; i++) {
      const shipX = this.direction ? this.position.x : this.position.x + i;
      const shipY = this.direction ? this.position.y + i : this.position.y;

      if (x === shipX && y === shipY) {
        this.hits[i] = true;
        return true;
      }
    }
    return false;
  }

  get isSunk(): boolean {
    return this.hits.every((h) => h);
  }

  getCoordinates(): { x: number; y: number }[] {
    return Array.from({ length: this.length }, (_, i) => ({
      x: this.direction ? this.position.x : this.position.x + i,
      y: this.direction ? this.position.y + i : this.position.y,
    }));
  }
}
