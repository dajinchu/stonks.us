import React from 'react';
import { graphql } from 'gatsby';
import Img from 'gatsby-image';

export default ({ data }) => {
  const isUp = data.allStonk.edges[0].node.isGoingUp;
  const imageUp = data.up.childImageSharp.fluid;
  const imageDown = data.down.childImageSharp.fluid;
  return (
    <div style={{ width: 960, margin: "4rem auto" }}>
      {isUp ? "stonks are UP today" : "uh oh poo poo"}
      <Img fluid={isUp ? imageUp : imageDown} />
    </div>
  )
}

export const query = graphql`
  query Stonks {
    allStonk {
      edges {
        node {
          isGoingUp
        }
      }
    }
    up: file(relativePath: { eq: "up.png"}) {
      childImageSharp {
        fluid {
          ... GatsbyImageSharpFluid
        }
      }
    }
    down: file(relativePath: { eq: "down.png"}) {
      childImageSharp {
        fluid {
          ... GatsbyImageSharpFluid
        }
      }
    }
  }
`
