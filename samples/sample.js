// Palette swatch card: a sample file for previewing the theme.
import { contrastRatio } from './color.js';

const SWATCHES = ['#0d0d0f', '#17171a', '#f6b3c5'];
const STORAGE_PREFIX = 'cb_';

export class SwatchCard {
  #selected = 2;
  #clicks = 0;

  constructor(root, { showHex = true, label = 'Cherry blossom' } = {}) {
    this.root = root;
    this.showHex = showHex;
    this.label = label;
  }

  get color() {
    return this.showHex ? SWATCHES[this.#selected] : null;
  }

  select(index) {
    if (!SWATCHES[index]) throw new Error(`Unknown swatch: ${index}`);
    this.#selected = index;
    this.#clicks += 1;
    localStorage.setItem(`${STORAGE_PREFIX}swatch`, String(index));
    this.render();
  }

  async render() {
    const ratio = await fetchRatio(this.color);
    const el = document.querySelector('#swatch-ratio');
    if (el) el.innerHTML = `${ratio.toFixed(1)}:1`;
    return { ratio, clicks: this.#clicks, isHex: /^#[0-9a-f]{6}$/i.test(this.color ?? '') };
  }
}

const fetchRatio = async (hex) => contrastRatio(hex ?? '#ffffff', '#17171a') ?? 4.5;

document.addEventListener('DOMContentLoaded', () => new SwatchCard(document.body).render());
