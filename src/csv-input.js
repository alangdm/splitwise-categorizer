import { html, css, LitElement } from "lit";

import { resetCSS } from "./reset.css.js";
import { sharedCSS } from "./shared.css.js";

const CSV_REGEX = /.*\.csv$/i;

class CSVInput extends LitElement {
  static get styles() {
    return [
      resetCSS,
      sharedCSS,
      css`
        :host {
          display: flex;
          flex-flow: column wrap;
          align-items: start;
          gap: 0.5rem;
        }

        input {
          position: fixed;
          top: 0px;
          left: 0px;
          width: 4px;
          height: 4px;
          opacity: 0;
          overflow: hidden;
          border: none;
          margin: 0;
          padding: 0;
          display: block;
          visibility: visible;
          pointer-events: none;
        }

        label {
          font-weight: bold;
        }

        #help-text {
          background-color: var(--primary-contrast-color);
          width: 100%;
          height: 4rem;
          border: 1px solid var(--gray-9);
          border-radius: 0.25rem;
          padding: 0.25rem 0.5rem;
        }

        :host([highlighted]) #help-text,
        input:focus-visible ~ #help-text {
          outline: solid var(--primary-color);
        }
      `,
    ];
  }

  static get properties() {
    return {
      csvArray: { type: Array },
      highlighted: { type: Boolean, reflect: true },
    };
  }

  render() {
    return html`
      <input
        id="csv"
        type="file"
        multiple
        accept="text/csv"
        @change=${({ target }) => this._handleFiles(target.files)}
      />
      <label for="csv">Splitwise CSV</label>
      <div id="help-text">Drop the Splitwise CSV files here</div>
    `;
  }

  constructor() {
    super();
    this.csvArray = [];
    this._highlight = this._highlight.bind(this);
    this._unhighlight = this._unhighlight.bind(this);
    this._drop = this._drop.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("dragenter", this._highlight, { capture: false });
    document.addEventListener("dragover", this._highlight, { capture: false });
    document.addEventListener("dragleave", this._unhighlight, {
      capture: false,
    });
    document.addEventListener("drop", this._unhighlight, { capture: false });
    document.addEventListener("drop", this._drop);
  }

  disconnectedCallback() {
    document.removeEventListener("dragenter", this._highlight);
    document.removeEventListener("dragover", this._highlight);
    document.removeEventListener("dragleave", this._unhighlight);
    document.removeEventListener("drop", this._unhighlight);
    document.removeEventListener("drop", this._drop);
  }

  _highlight(e) {
    e.preventDefault();
    e.stopPropagation();
    this.highlighted = true;
  }

  _unhighlight(e) {
    e.preventDefault();
    e.stopPropagation();
    this.highlighted = false;
  }

  _drop(e) {
    this._handleFiles(e.dataTransfer.files);
  }

  async _handleFiles(files) {
    this.csvArray = [];
    const fileArr = [...files];
    for (const f of fileArr) {
      if (CSV_REGEX.test(f.name)) {
        const content = await this._readFile(f);
        this.csvArray.push({ name: f.name, content });
      }
    }
    const event = new Event("change");
    this.dispatchEvent(event);
  }

  _readFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.addEventListener("loadend", () => resolve(reader.result));
      reader.addEventListener("error", reject);
    });
  }
}

window.customElements.define("csv-input", CSVInput);
