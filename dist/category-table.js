import { packd_export_0 } from 'https://srv.divriots.com/packd/lit,lit-html@next-major?env.NODE_ENV=development';const { html,css,LitElement,empty } = packd_export_0;;
import { resetCSS } from "./reset.css.js";
import { sharedCSS } from "./shared.css.js";
const CLIPBOARD_MESSAGES = {
  success: "Table copied to clipboard!",
  error: "Couldn't copy to clipboard. Please do it manually."
};

class CategoryTable extends LitElement {
  static get styles() {
    return [resetCSS, sharedCSS, css`
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
        tbody
          tr:not(.category-footer, .category-header, .table-header, .table-footer):hover {
          background: var(--teal-2);
        }
        .category-header th {
          text-align: left;
        }
        :where(.category-footer, .table-footer) th,
        .currency {
          text-align: right;
        }
        .category-footer + .category-header {
          border-top: 2px solid var(--teal-9);
        }
      `];
  }

  static get properties() {
    return {
      categories: {
        type: Array,
        attribute: false
      },
      total: {
        type: Number
      },
      clipboardMessage: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.categories = {};
    this.clipboardMessage = "";
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

  _categoryTemplate([category, {
    items,
    subtotal
  }]) {
    return html`
      <tr class="category-header">
        <th scope="row" colspan="4">${category}</th>
      </tr>
      ${items.map(({
      date,
      description,
      cost,
      currency
    }) => html`
          <tr>
            <td>${date}</td>
            <td>${description}</td>
            <td class="currency">${currency}</td>
            <td>${cost}</td>
          </tr>
        `)}
      <tr class="category-footer">
        <th scope="row" colspan="3">${category} subtotal</th>
        <td>${subtotal}</td>
      </tr>
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
          <tr class="table-header">
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope="col">Currency</th>
            <th scope="col">Cost</th>
          </tr>
          ${categories.map(this._categoryTemplate)}
          <tr class="table-footer">
            <th scope="row" colspan="3">Total</th>
            <td>${this.total}</td>
          </tr>
        </tbody>
      </table>
    `;
  }

}

window.customElements.define("category-table", CategoryTable);