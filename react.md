# Create
  yarn create react-app my-app --template typescript

# DevDependencies - Package.json
  criar o DevDependencies e colocar todos os @testing e @ types dentro

# Styled Components
  CSS in JS 
  yarn add styled-components

  # estilizando CSS em uma pagina especifica ./styles.ts
    import styled from 'styled-components'

    export const Title = styled.h1`
    background: red 
    ...
    `

  # Estilizaçao global src/styles/global.ts
    

    import {createGlobalStyle} from 'styled-components'

    export const GlobalStyle = createGlobalStyle`
      :root{
        --var-black: #000;
      }

      body{
        webkit-font-smoothing: antialiased;
      }

      *{
        margin: 0
        ...
      }
    `