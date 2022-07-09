
/**
 * @author  raizensoft.com
 */

import { Sprite } from "pixi.js";
import TheSnake from "./TheSnake";

const BLOCKSIZE = 32;

/**
 * Body
 * @class Body
 */
export default class SnakePart extends Sprite {

  ox:number;
  oy:number;
  i:number;
  j:number;
  ts:TheSnake;
  next:SnakePart;

  constructor(ts:TheSnake) {

    super(ts.ptex);
    this.ts = ts;
    this.init();
  }

  /**
   * Init class components
   * @method init
   */
  init() {

    this.scale.set(0.25);
    this.anchor.set(0.5);
  }

  /**
   * Set snake position from input matrix position
   */
  setPosition(i:number, j:number) {

    this.i = i; this.j = j;
    this.oy = this.y = i * BLOCKSIZE + BLOCKSIZE * 0.5;
    this.ox = this.x = j * BLOCKSIZE + BLOCKSIZE * 0.5;
  }

  update(etime:number) {

    this.x = this.ox + (etime / this.ts.stepDuration) * (this.next.ox - this.ox);
    this.y = this.oy + (etime / this.ts.stepDuration) * (this.next.oy - this.oy);
    this.rotation += 0.1;
  }

  applyNext() {
    this.setPosition(this.next.i, this.next.j);
  }

  reset() {
    //this.rotation = Math.random() * 2* Math.PI;
  }
}
