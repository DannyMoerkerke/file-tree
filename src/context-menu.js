import {onOutsideClick} from './on-outside-click.js';

export class ContextMenu extends HTMLElement {

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: absolute;
          --font-family: -apple-system, BlinkMacSystemFont, Segoe WPC, Segoe UI, HelveticaNeue-Light, Ubuntu, Droid Sans, sans-serif;
          --font-size: 1em;
          --background-color: #b1b1b1;
          --font-color: #1e1e1e;
          --background-color-hover: #2b79d7;
          --font-color-hover: #ffffff;
        }
        :host([hidden]) {
          display: none;
        }
        ul {
          font-family: var(--font-family);
          font-size: var(--font-size);
          display: flex;
          flex-direction: column;
          list-style-type: none;
          padding: 8px 12px;
          min-width: 200px;
          background-color: var(--background-color);
          border-radius: 6px;
          box-shadow: 0 0.625rem 0.75rem 0 rgba(0, 0, 0, 0.14);
        }
        
        ul li {
          justify-content: space-between;
          padding: 4px 4px 4px 8px;
          color: var(--font-color);
          border-radius: 4px;
          position: relative;
        }
        
        ul li ul {
          display: none;
          position: absolute;
          top: 0;
          left: 100%;
        }
        
        ul li:hover {
          background-color: #2b79d7;
          color: var(--font-color-hover);
          cursor: pointer;
        }
        
        ul li[disabled],
        ul li[disabled]:hover {
          opacity: .5;
          pointer-events: none;
          cursor: default;
        }
      </style>
            
      <ul part="menu"></ul>      
    `;
  }

  connectedCallback() {
    this.menu = this.shadowRoot.querySelector('ul');
    this.hide();

    onOutsideClick(this.menu, () => this.hide());
  }

  set options(options) {
    this.menu.innerHTML = '';

    options.forEach(({label, callback, disabled}) => {
      const li = document.createElement('li');
      const action = label.toLowerCase().replace(' ', '-').trim();

      if(disabled) {
        li.setAttribute('disabled', '');
      }

      li.dataset.action = action;
      li.innerText = label;
      li.addEventListener('click', async e => {
        await callback(e);

        this.hide();
      });

      this.menu.appendChild(li);

    });

    this.style.opacity = '0';
    this.removeAttribute('hidden');
    this.menuHeight =  this.offsetHeight;
    this.setAttribute('hidden', '');
    this.style.opacity = '1';
  }

  show({x = 0, y = 0}) {
    if(y + this.menuHeight > document.documentElement.clientHeight) {
      y = y - this.menuHeight;
    }
    this.style.top = `${y}px`;
    this.style.left = `${x}px`;

    this.removeAttribute('hidden');
  }

  hide() {
    this.setAttribute('hidden', '');
  }
}

customElements.define('context-menu', ContextMenu);
