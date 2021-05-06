import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"

import { GatsbyImage, getImage } from "gatsby-plugin-image"

import Layout from "../../components/Layout"

import "./Portfolio.scss"

export const query = graphql`
query PorfolioQuery($id: String!) {
  wpPortfolio(id: {eq: $id}) {
    title
    excerpt
    featuredImages {
      images {
        id
        title
        caption
        thumbnail: localFile {
          childImageSharp {
            gatsbyImageData(
              width: 600
              height: 600
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        featured: localFile {
          childImageSharp {
            gatsbyImageData(
              width: 1200
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
}
`

const FeaturedPhoto = () => {
  return (
    <div>FEATURED PHOTO</div>
  )
}

/**
 * @todo Explore grid re-ordering based on index
 * @see https://stackoverflow.com/questions/45367864/change-the-column-order-in-a-css-grid†
 * 
 * @param {*} param0 
 * @returns 
 */
const PortfolioPhoto = ({ id, thumbnail, featured, index, title, caption, active, handlePresentation }) => {

  const thumbnailImage = getImage(thumbnail)
  const featuredImage = getImage(featured)
  const imageClass = active ? 'portfolioItem--active' : '';

  return (
    <>
      <div className={`portfolioItem ${imageClass}`}
          onClick={() => handlePresentation(index, id)}
      >
        <GatsbyImage
          className={`portfolioImage`}
          image={thumbnailImage} 
          alt={title}
        />
        { active && <div className="portfolioItem__overlay"><h5>{title}</h5><p>{caption}</p></div> }
        
      </div>
      { active && <GatsbyImage className={`portfolioImage--featured`} image={featuredImage} alt={title} /> }
    </>
  )

}

const Portfolio = ({data}) => {

  const { title, excerpt, featuredImages } = data?.wpPortfolio
  // Set portfolioImages.
  const [ portfolioImages, setPortfolioImages ] = useState( featuredImages?.images && featuredImages.images.map( image => (
    {...image, active: false}
  )))

  const handlePresentation = (index, id) => {
    console.log(index, id)
    console.log(portfolioImages[index])

    // Set clicked image to active and every other to not.
    const updatedPortfolioImages = portfolioImages.map( image => {
      if (image.id === id) {
        // If clicked image is currently active then deactivate, otherwise set to active.
        return Object.assign({}, {...image}, {active: image.active ? false : true})
      }
      return Object.assign({}, {...image}, {active: false})
    })

    // Update portfolioImages state.
    setPortfolioImages(updatedPortfolioImages)

    console.log(updatedPortfolioImages)
  }

  return (
    <Layout>
      <h1>{ title }</h1>
      <div dangerouslySetInnerHTML={{__html: excerpt}} />
      <div className="portfolio">
      { portfolioImages &&
        portfolioImages.map( (image, index) => <PortfolioPhoto key={image.id} {...image} handlePresentation={handlePresentation} /> )
      }
      </div>
    </Layout>
  )
}

export default Portfolio