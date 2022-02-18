import { html, css, LitElement, empty } from "lit";

import { resetCSS } from "./reset.css.js";

class CategoryTable extends LitElement {
  static get styles() {
    return [
      resetCSS,
      css`
        /* table */
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
        ::selection {
          color: var(--gray-9);
          background: var(--teal-3);
        }
      `,
    ];
  }

  static get properties() {
    return {
      categories: { type: Array, attribute: false },
      total: { type: Number },
    };
  }

  constructor() {
    super();
    this.categories = {};
  }

  _categoryTemplate([category, { items, subtotal }]) {
    return html`
      <tr class="category-header">
        <th scope="row" colspan="4">${category}</th>
      </tr>
      ${items.map(
        ({ date, description, cost, currency }) => html`
          <tr>
            <td>${date}</td>
            <td>${description}</td>
            <td class="currency">${currency}</td>
            <td>${cost}</td>
          </tr>
        `
      )}
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
