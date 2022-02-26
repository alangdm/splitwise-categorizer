import { packd_export_0 } from 'https://srv.divriots.com/packd/lit,lit-html@next-major?env.NODE_ENV=development';const { html,css,LitElement } = packd_export_0;;
import { resetCSS } from "./reset.css.js";
import { sharedCSS } from "./shared.css.js";
const PLACEHOLDERS = {
  normal: "Paste the full Splitwise CSV here",
  highlight: "Drop the Splitwise CSV file here"
};
const CSV_REGEX = /.*\.csv$/i;

class CSVInput extends LitElement {
  static get styles() {
    return [resetCSS, sharedCSS, css`
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
        :host([highlighted]) textarea,
        textarea:focus-visible {
          outline: solid var(--primary-color);
        }
      `];
  }

  static get properties() {
    return {
      csv: {
        type: String
      },
      highlighted: {
        type: Boolean,
        reflect: true
      }
    };
  }

  render() {
    return html`
      <label for="csv">Splitwise CSV</label>
      <textarea
        id="csv"
        rows="5"
        cols="80"
        placeholder=${this.highlighted ? PLACEHOLDERS.highlight : PLACEHOLDERS.normal}
        .value=${this.csv}
        @change=${this._textChange}
      ></textarea>
    `;
  }

  constructor() {
    super();
    this.csv = "";
    this._highlight = this._highlight.bind(this);
    this._unhighlight = this._unhighlight.bind(this);
    this._drop = this._drop.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("dragenter", this._highlight, {
      capture: false
    });
    document.addEventListener("dragover", this._highlight, {
      capture: false
    });
    document.addEventListener("dragleave", this._unhighlight, {
      capture: false
    });
    document.addEventListener("drop", this._unhighlight, {
      capture: false
    });
    document.addEventListener("drop", this._drop);
  }

  disconnectedCallback() {
    document.removeEventListener("dragenter", this._highlight);
    document.removeEventListener("dragover", this._highlight);
    document.removeEventListener("dragleave", this._unhighlight);
    document.removeEventListener("drop", this._unhighlight);
    document.removeEventListener("drop", this._drop);
  }

  _textChange(e) {
    this.csv = e.target.value;
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
    const fileArr = [...files];

    for (const f of fileArr) {
      if (CSV_REGEX.test(f.name)) {
        this.csv = await this._readFile(f);
        return;
      }
    }
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