import { html, css, LitElement, empty } from "lit";

import { resetCSS } from "./reset.css.js";
import { sharedCSS } from "./shared.css.js";

import { getPaymentMethodName } from "./utils.js";

const CLIPBOARD_MESSAGES = {
  success: "Table copied to clipboard!",
  error: "Couldn't copy to clipboard. Please do it manually.",
};

class CategoryTable extends LitElement {
  static get styles() {
    return [
      resetCSS,
      sharedCSS,
      css`
        :host {
          display: grid;
          grid-template-rows: auto 1fr;
          gap: 1rem;
        }
        table {
          width: 100%;
          line-height: 2;
          border-collapse: collapse;
        }
        td,
        th {
          padding: 0 0.5rem;
        }
        .table-header,
        .table-footer {
          background: var(--teal-9);
          color: var(--gray-0);
          font-weight: bold;
        }
        .payment-method-footer {
          background: var(--teal-7);
          color: var(--gray-0);
          font-weight: bold;
        }
        tbody
          tr:not(.category-footer, .category-header, .table-header, .table-footer, .payment-method-footer):hover {
          background: var(--teal-2);
        }
        .category-header th {
          text-align: left;
        }
        :where(.category-footer, .table-footer, .payment-method-footer) th,
        .currency {
          text-align: right;
        }
        .category-footer + .category-header {
          border-top: 2px solid var(--teal-9);
        }
      `,
    ];
  }

  static get properties() {
    return {
      categories: { type: Array, attribute: false },
      totals: { type: Object, attribute: false },
      paymentMethodTotals: { type: Object, attribute: false },
      clipboardMessage: { type: String },
    };
  }

  constructor() {
    super();
    this.categories = {};
    this.clipboardMessage = "";
    this._categoryTemplate = this._categoryTemplate.bind(this);
    this._categoryTotalsTemplate = this._categoryTotalsTemplate.bind(this);
  }

  async _copy() {
    const table = this.shadowRoot.querySelector("table");
    const text = table.innerText.trim();
    try {
      await window.navigator.clipboard.writeText(text);
      this.clipboardMessage = CLIPBOARD_MESSAGES.success;
    } catch (e) {
      this.clipboardMessage = CLIPBOARD_MESSAGES.error;
    }
  }

  _totalsTemplate({ header, totals, cssClass = "table-footer" }) {
    const entries = Object.entries(totals);

    if (entries.length === 0) {
      return html`
        <tr class=${cssClass}>
          <td></td>
          <td></td>
          <th scope="row">${header ? `${header} subtotal` : "Total"}</th>
          <td></td>
          <td>0</td>
        </tr>
      `;
    }

    return html`
      ${entries.map(
        ([currency, total], index) => html`
          <tr class=${cssClass}>
            <td></td>
            <td></td>
            ${index === 0
              ? html`<th scope="row">
                  ${header ? `${header} subtotal` : "Total"}
                </th>`
              : html`<td></td>`}
            <td class="currency">${currency}</td>
            <td>${total}</td>
          </tr>
        `
      )}
    `;
  }

  _categoryTemplate([category, { items }]) {
    if (items.length === 0) {
      return empty;
    }
    return html`
      <tr class="category-header">
        <th scope="row" colspan="5">* ${category}</th>
      </tr>
      ${items.map(
        ({ date, description, cost, currency, paymentMethod = "" }) => html`
          <tr>
            <td>${date}</td>
            <td>${description}</td>
            <td>${getPaymentMethodName(paymentMethod)}</td>
            <td class="currency">${currency}</td>
            <td>${cost}</td>
          </tr>
        `
      )}
    `;
  }

  _categoryTotalsTemplate([category, { subtotals }]) {
    return html`
      ${this._totalsTemplate({
        header: category,
        totals: subtotals,
        cssClass: "category-footer",
      })}
    `;
  }

  _paymentMethodTotalsTemplate() {
    const entries = Object.entries(this.paymentMethodTotals);
    return html`
      ${entries.map(([paymentMethod, totals]) =>
        this._totalsTemplate({
          header: getPaymentMethodName(paymentMethod),
          totals,
          cssClass: "payment-method-footer",
        })
      )}
    `;
  }

  render() {
    const categories = Object.entries(this.categories);
    if (categories.length === 0) {
      return empty;
    }
    return html`
      <div>
        <button type="button" @click=${this._copy}>Copy to clipboard</button>
        <span>${this.clipboardMessage}</span>
      </div>
      <table>
        <tbody>
          ${this._totalsTemplate({ totals: this.totals })}
          ${categories.map(this._categoryTotalsTemplate)}
          ${this._paymentMethodTotalsTemplate()}
          <tr class="table-header">
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope="col">Payment Method</th>
            <th scope="col">Currency</th>
            <th scope="col">Cost</th>
          </tr>
          ${categories.map(this._categoryTemplate)}
        </tbody>
      </table>
    `;
  }
}

window.customElements.define("category-table", CategoryTable);
