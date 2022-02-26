import { html, css, LitElement } from "lit";

import { resetCSS } from "./reset.css.js";
import { sharedCSS } from "./shared.css.js";

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
        label {
          font-weight: bold;
        }
        textarea {
          resize: block;
        }
        textarea:focus-visible {
          outline: solid var(--primary-color);
        }
      `,
    ];
  }

  static get properties() {
    return {
      csv: { type: String },
    };
  }

  render() {
    return html`
      <label for="csv">Splitwise CSV</label>
      <textarea
        id="csv"
        rows="5"
        cols="80"
        placeholder="Paste the full Splitwise CSV here"
        .value=${this.csv}
        @change=${this._textChange}
      ></textarea>
    `;
  }

  constructor() {
    super();
    this.csv = "";
  }

  _textChange(e) {
    this.csv = e.target.value;
  }
}

window.customElements.define("csv-input", CSVInput);
