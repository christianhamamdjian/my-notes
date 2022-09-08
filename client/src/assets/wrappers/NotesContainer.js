import styled from 'styled-components'

const Wrapper = styled.section`
  margin: 4rem 4rem;

  h2 {
    text-transform: none;
  }
  & > h5 {
    font-weight: 700;
  }
  .btn-container {
    column-gap: 0.5rem; 
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    button {
      background: transparent;
      border: 1px solid var(--clr-black);
      color: var(--clr-black);
      width: 1.5rem;
      border-radius: var(--radius);
      height: 1.5rem;
      cursor: pointer;
      svg {
        font-size: 1rem;
      }
    }
    .active {
      background: var(--clr-black);
      color: var(--clr-white);
    }
  }
  /* .notes {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 2rem;
  } */
  @media (min-width: 992px) {
    .notes {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
  }
`
export default Wrapper
