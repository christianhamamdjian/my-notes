import styled from 'styled-components'

const ListView = styled.section`
  .notes {
    display: grid;
    grid-template-columns: 1fr ;
    row-gap: 2rem;
  }
 
  @media (min-width: 992px) {
    article {
      display: grid;
      grid-template-columns: 2fr 2fr;
      column-gap: 2rem;
      align-items: center;
    }
  }
`

export default ListView
