import { html, css, LitElement } from "lit";

import { resetCSS } from "./reset.css.js";
import "./category-table.js";

class SplitwiseCategorizer extends LitElement {
  static get styles() {
    return [
      resetCSS,
      css`
        :host {
          height: 100%;
          padding: 0.5rem;
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 1rem;
          color: var(--gray-9);
        }
        /* header */
        header {
          display: flex;
          flex-flow: column wrap;
          align-items: start;
          gap: 0.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--gray-5);
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
        button {
          background: var(--primary-color);
          text-shadow: 0 1px 0 var(--primary-color);
          color: var(--primary-contrast-color);
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 5px;
          box-shadow: 0 3px 5px -2px var(--gray-9);
        }
        button:focus-visible {
          outline: none;
          filter: opacity(0.7);
        }
        button:hover {
          filter: opacity(0.85);
        }
        ::selection {
          color: var(--gray-9);
          background: var(--teal-3);
        }
      `,
    ];
  }

  static get properties() {
    return {
      categories: { type: Array, state: true },
      isCategorizing: { type: Boolean, reflect: true },
      total: { type: Number, state: true },
    };
  }

  constructor() {
    super();
    this.isCategorizing = false;
    this.categories = {};
    this.columns = {
      date: 0,
      description: 1,
      category: 2,
      cost: 3,
      currency: 4,
    };
  }

  get csv() {
    return this.shadowRoot.querySelector("#csv").value;
  }

  render() {
    return html`
      <header>
        <label for="csv">Splitwise CSV</label>
        <textarea
          id="csv"
          rows="5"
          cols="80"
          placeholder="Paste the full Splitwise CSV here"
        ></textarea>
        <button type="button" @click=${this._categorize}>Categorize</button>
      </header>
      <main>
        ${this.isCategorizing
          ? html`Categorizing...`
          : html`<category-table
              .categories=${this.categories}
              .total=${this.total}
            ></category-table>`}
      </main>
    `;
  }

  _parseContents(csvContents) {
    // TODO multiple currencies?
    const cols = this.columns;
    for (const row of csvContents) {
      const values = row.split(",");
      const date = values[cols.date];
      const description = values[cols.description];
      const category = values[cols.category];
      const cost = parseFloat(values[cols.cost]);
      const currency = values[cols.currency];

      if (!this.categories[category]) {
        this.categories[category] = {
          items: [],
          subtotal: 0,
        };
      }

      this.categories[category].items.push({
        date,
        description,
        cost,
        currency,
      });

      this.categories[category].subtotal += cost;
      this.total += cost;
    }
  }

  _categorize() {
    if (!this.csv || this.isCategorizing) {
      // TODO error handling
      return;
    }
    this.isCategorizing = true;
    this.categories = {};
    this.total = 0;

    const csvRows = this.csv.split("\n").filter((i) => i);
    // TODO set col indexes from csv headers
    // const csvHeaders = csvRows[0];
    const csvContents = csvRows.slice(1, csvRows.length - 1);

    this._parseContents(csvContents);

    this.isCategorizing = false;
  }
}

window.customElements.define("splitwise-categorizer", SplitwiseCategorizer);
