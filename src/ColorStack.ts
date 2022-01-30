import { Stack } from 'stack-typescript';
import { Color } from '@/Color';

export const defaultColor = new Color(0, 0, 0, 1.0);

export default class ColorStack extends Stack<Color> {
  pop(): Color {
    if (this.size === 0) {
      return defaultColor;
    }
    return super.pop();
  }

  push(c: Color): void {
    if (!c.equals(defaultColor)) {
      super.push(c);
    }
  }
}
