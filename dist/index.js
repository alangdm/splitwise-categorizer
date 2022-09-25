import { packd_export_0 } from 'https://srv.divriots.com/packd/lit,lit-html@next-major?env.NODE_ENV=development';const { html,css,LitElement } = packd_export_0;;
import { isExcludedCategory, normalizeCategoryName, CATEGORIES } from "./utils.js";
import { resetCSS } from "./reset.css.js";
import { sharedCSS } from "./shared.css.js";
import "./category-table.js";
import "./csv-input.js";
import { getColumnIndexes, parseDescription } from "./utils.js";

class SplitwiseCategorizer extends LitElement {
  static get styles() {
    return [resetCSS, sharedCSS, css`
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
      `];
  }

  static get properties() {
    return {
      categories: {
        type: Array,
        state: true
      },
      isCategorizing: {
        type: Boolean,
        reflect: true
      },
      totals: {
        type: Object,
        state: true
      }
    };
  }

  constructor() {
    super();
    this.isCategorizing = false;
    this.categories = {};
    this.columns = {};
    this.totals = {};
    this.paymentMethodTotals = {};
  }

  get csvArray() {
    return this.shadowRoot.querySelector("csv-input").csvArray;
  }

  render() {
    return html`
      <header>
        <csv-input @change=${this._categorize}></csv-input>
      </header>
      <main>
        ${this.isCategorizing ? html`Categorizing...` : html`<category-table
              .categories=${this.categories}
              .totals=${this.totals}
              .paymentMethodTotals=${this.paymentMethodTotals}
            ></category-table>`}
      </main>
    `;
  }

  _reset() {
    this.categories = {};
    this.totals = {};
    this.paymentMethodTotals = {};

    for (const {
      en
    } of CATEGORIES) {
      this.categories[en] = {
        items: [],
        subtotals: {}
      };
    }
  }

  _parseContents(csvContents) {
    const cols = this.columns;

    for (const row of csvContents) {
      const values = row.split(",");
      const date = values[cols.date];
      const {
        paymentMethod,
        description
      } = parseDescription(values[cols.description]);
      const rawCategory = values[cols.category];
      const cost = parseFloat(values[cols.cost]);
      const currency = values[cols.currency];

      if (isExcludedCategory(rawCategory)) {
        // do nothing
        continue;
      }

      const category = normalizeCategoryName(rawCategory);

      if (!category) {
        console.error("Couldn't find category: ", category);
        continue;
      }

      this.categories[category].items.push({
        date,
        description,
        cost,
        currency,
        paymentMethod
      });

      if (!this.categories[category].subtotals[currency]) {
        this.categories[category].subtotals[currency] = cost;
      } else {
        this.categories[category].subtotals[currency] += cost;
      }

      if (!this.totals[currency]) {
        this.totals[currency] = cost;
      } else {
        this.totals[currency] += cost;
      } // payment method


      if (!paymentMethod) {
        continue;
      }

      if (!this.paymentMethodTotals[paymentMethod]) {
        this.paymentMethodTotals[paymentMethod] = {};
      }

      if (!this.paymentMethodTotals[paymentMethod][currency]) {
        this.paymentMethodTotals[paymentMethod][currency] = cost;
      } else {
        this.paymentMethodTotals[paymentMethod][currency] += cost;
      }
    }
  }

  _categorize() {
    if (!this.csvArray || this.isCategorizing) {
      // TODO error handling
      return;
    }

    this.isCategorizing = true;

    this._reset();

    for (const csv of this.csvArray) {
      const csvRows = csv.content.split("\n").filter(i => i);
      const csvHeaders = csvRows[0];
      this.columns = getColumnIndexes(csvHeaders.split(","));
      const csvContents = csvRows.slice(1, csvRows.length - 1);

      this._parseContents(csvContents);
    }

    this.isCategorizing = false;
  }

}

window.customElements.define("splitwise-categorizer", SplitwiseCategorizer);