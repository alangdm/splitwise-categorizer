import { packd_export_0 } from 'https://srv.divriots.com/packd/lit,lit-html@next-major?env.NODE_ENV=development';const { css } = packd_export_0;;
export const resetCSS = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  /* Remove default margin */
  h1,
  h2,
  h3,
  h4,
  p,
  figure,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
  ul[role="list"],
  ol[role="list"] {
    list-style: none;
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img,
  picture {
    max-width: 100%;
    display: block;
  }

  /* Inherit fonts for inputs and buttons */
  :where(input, button, textarea, select),
  :where(input[type="file"])::-webkit-file-upload-button {
    font: inherit;
    font-size: inherit;
    color: inherit;
    letter-spacing: inherit;
  }

  /* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  :where(textarea, button, label[for]) {
    cursor: pointer;
    touch-action: manipulation;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }
`;