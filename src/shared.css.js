import { css } from "lit";

export const sharedCSS = css`
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
`;
