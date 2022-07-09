
/**
 * @author  raizensoft.com
 */

import { Howl } from "howler";
import { Application, TilingSprite, Texture } from "pixi.js";
import SnakePart from "./SnakePart";
import TheSnake from "./TheSnake";

const BLOCKSIZE = 32;
const APP_WIDTH = BLOCKSIZE * 20;
const APP_HEIGHT = BLOCKSIZE * 20;

/**
 * SnakeGame
 * @class Snakegame
 */
export default class Snakegame {

  pixiApp:Application;
  view:HTMLCanvasElement;
  root:HTMLDivElement;
  ts:TheSnake;
  rlist:SnakePart[];
  isGameOver:boolean;
  gameText:HTMLDivElement;
  scoreCount:number;
  soundHit:Howl;
  soundGameOver:Howl;

  constructor(root:HTMLDivElement) {

    this.root = root;
    this.init();
  }

  /**
   * Init class components
   * @method init
   */
  private init() {

    const papp = this.pixiApp = new Application(
      {
        width:APP_WIDTH, 
        height:APP_HEIGHT, 
        backgroundColor:0x111111,
        antialias:true});
    this.view = papp.view;
    this.root.appendChild(this.view);

    this.initComponents();

    this.initKeyboard();

    // Start rendering
    papp.ticker.add(this.update.bind(this));

    // Start new game
    this.newGame();
  }

  private initKeyboard() {

    document.body.addEventListener('keydown', (e) => {

      const ts = this.ts;

      switch (e.key) {

        case "ArrowUp": 
          if (ts.currentDir !== 2)
            ts.currentDir = 0; break;
        case "ArrowRight": 
          if (ts.currentDir !== 3)
            ts.currentDir = 1; break;
        case "ArrowDown": 
          if (ts.currentDir !== 0)
            ts.currentDir = 2; break;
        case "ArrowLeft": 
          if (ts.currentDir !== 1)
            ts.currentDir = 3; break;
        case " ":
          this.newGame(); break;
      }
    });
  }

  private initComponents() {

    const stage = this.pixiApp.stage;

    const grid = new TilingSprite(Texture.from('assets/Grid.png'), APP_WIDTH, APP_HEIGHT);
    grid.tileScale.set(BLOCKSIZE / 128);
    stage.addChild(grid);

    // Load sound
    this.soundHit = new Howl({
      src:['assets/ButtonSound.mp3']
    });
    this.soundGameOver = new Howl({
      src:['assets/GameOver.mp3']
    });

    // Construct the snake
    const ts = this.ts = new TheSnake();
    stage.addChild(ts);

    // Initial part list
    this.rlist = [];

    // Init game text
    this.gameText = document.createElement('div');
    this.gameText.className = 'game-text';
    this.root.appendChild(this.gameText);
  }

  /**
   * Start a new game
   */
  newGame() {

    this.isGameOver = false;
    this.scoreCount = 0;
    if (this.root.contains(this.gameText))
      this.root.removeChild(this.gameText);

    // Clean up random parts
    this.rlist.forEach((it) => {
      this.pixiApp.stage.removeChild(it);
    });
    this.rlist.splice(0);
    for (let i = 0; i < 5; i++) {
      this.placeRandomPart();
    }
    this.ts.reset();
  }

  /**
   * Update game loop
   */
  update(delta:number) {

    if (this.isGameOver) return;
    this.ts.update(delta);

    const head = this.ts.plist[0] as SnakePart;

    // Update random part and hit test detection
    let hitPart:any = null;
    this.rlist.forEach((it) => {

      if (head.i == it.i && head.j == it.j) {
        hitPart = it;
      }
    });
    if (hitPart) {

      if (this.soundHit.playing()) this.soundHit.stop();
      this.soundHit.play();

      this.scoreCount++;

      // Add more snake head
      this.ts.addHead(hitPart.i, hitPart.j);

      // Remove random part
      this.pixiApp.stage.removeChild(hitPart);

      let i;
      for (i = this.rlist.length - 1; i >= 0; i--) {
        if (this.rlist[i] == hitPart) break;
      }
      this.rlist.splice(i, 1);

      // Add new random segment
      this.placeRandomPart();
    }

    if (this.ts.selfHitTest()) {
      this.setGameOver();
    }
  }

  /**
   * Place random segment in the current matrix
   */
  placeRandomPart() {

    const rj = Math.floor(Math.random() * 20);
    const ri = Math.floor(Math.random() * 20);

    const part = new SnakePart(this.ts);
    part.tint = Math.random() * 0xffffff;
    part.rotation = Math.random() * 2 * Math.PI;
    part.setPosition(ri, rj);
    this.pixiApp.stage.addChild(part);
    this.rlist.push(part);
  }

  /**
   * Set game over state
   */
  setGameOver() {

    this.isGameOver = true;
    this.gameText.innerHTML = `
      <h1>Game Over</h1>
      <h2>Your Score: ${this.scoreCount}</h2>
      <p>Hit Spacebar to restart</p>
    `;

    this.root.appendChild(this.gameText);
    this.soundGameOver.play();
  }

}
