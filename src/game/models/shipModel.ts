export class ShipModel {
  public hits: { x: number; y: number }[] = [];

  constructor(
    public position: { x: number; y: number },
    public direction: boolean,
    public length: number,
    public type: 'small' | 'medium' | 'large' | 'huge',
  ) {}

  hit(x: number, y: number) {
    this.hits.push({ x, y });
  }

  isSunk() {
    return this.hits.length >= this.length;
  }

  occupies(x: number, y: number) {
    for (let i = 0; i < this.length; i++) {
      const cellX = this.position.x + (this.direction ? i : 0);
      const cellY = this.position.y + (this.direction ? 0 : i);
      if (cellX === x && cellY === y) return true;
    }
    return false;
  }
}
