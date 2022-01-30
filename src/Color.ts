export class Color {
  public red: number;

  public green: number;

  public blue: number;

  public transparency: number;

  constructor(red:number, green:number, blue:number, transparency: number) {
    this.red = red;
    this.green = green;
    this.blue = blue;
    this.transparency = transparency;
  }

  toString(): string {
    return `rgba(${this.red},${this.green},${this.blue},${this.transparency})`;
  }

  equals(c: Color): boolean {
    return (this.red === c.red
      && this.green === c.green
      && this.blue === c.blue
      && this.transparency === c.transparency);
  }
}

export const colorBible: Color[] = [
  new Color(0, 0, 255, 1.0), // Blue
  new Color(255, 0, 0, 1.0), // Red
  new Color(0, 128, 21, 1.0), // Dark green
  new Color(77, 0, 153, 1.0), // Purple
  new Color(230, 191, 0, 1.0), // Orange
  new Color(93, 206, 216, 1.0), // Cyan
  new Color(93, 216, 165, 1.0), // Pale green
  new Color(252, 230, 60, 1.0), // Yellow
  new Color(252, 126, 233, 1.0), // Pink
  new Color(156, 167, 252, 1.0), // Lila
  new Color(130, 69, 5, 1.0), // Brown
];
