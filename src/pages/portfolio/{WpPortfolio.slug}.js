import React, { useState, useEffect, useCallback } from "react"
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
              width: 60
              height: 60
              placeholder: BLURRED
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
        featured: localFile {
          childImageSharp {
            gatsbyImageData(
              layout: FULL_WIDTH
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

/**
 * @todo Explore grid re-ordering based on index
 * @see https://stackoverflow.com/questions/45367864/change-the-column-order-in-a-css-grid†
 * 
 * @param {*} param0 
 * @returns 
 */
const PortfolioPhoto = ({ id, index, thumbnail, title, active, handlePresentation }) => {

  const thumbnailImage = getImage(thumbnail)
  const imageClass = active ? 'portfolioImage--active' : '';

  return (
    <GatsbyImage
      className={`portfolioImage ${imageClass}`}
      image={thumbnailImage} 
      alt={title}
      onClick={(e) => handlePresentation(e, index, id)}
    />
  )

}

const Portfolio = ({data}) => {

  const { title, excerpt, featuredImages } = data?.wpPortfolio
  // Set portfolioImages.
  const [ portfolioImages, setPortfolioImages ] = useState( featuredImages?.images && featuredImages.images.map( (image, index) => {
    // Set the first item to active and rest not.
    const active = index === 0 ? true : false
    return {...image, active}
  }))

  // Manage current item index.
  const [ currentIndex, setCurrentIndex ] = useState(0)

  // First portfolio item becomes the featured image.
  const [ featuredImage, setFeaturedImage ] = useState( portfolioImages[0] )

  const handleKeyPress = useCallback( event => {

    // Key pushed.
    const { key } = event
    const escKeys = ['ArrowRight', 'ArrowLeft']

    // If arrowing left or right, let's continiue.
    if (escKeys.includes(String(key))) {
      
      let nextIndex = null;
      
      // Move forward
      if (key == 'ArrowRight' && currentIndex < portfolioImages.length) {
          nextIndex = currentIndex + 1
      }
      
      // Navigate back
      if (key == 'ArrowLeft' && currentIndex > 1) {
        nextIndex = currentIndex - 1
      }

      console.log(currentIndex, nextIndex)

      const updatedPortfolioImages = portfolioImages.map( (image, index) => {
        if (index === nextIndex) { 
          setFeaturedImage(image)
          setCurrentIndex(nextIndex)
          return Object.assign({}, {...image}, {active: true})
        } else {
          return Object.assign({}, {...image}, {active: false})
        }
      })
      
      // Update portfolioImages state.
      setPortfolioImages(updatedPortfolioImages)
      
    }

  }, [currentIndex])

  useEffect(() => {
    
    window.addEventListener( 'keydown', handleKeyPress )

    return () => {
      window.removeEventListener( 'keydown', handleKeyPress )
    }

  })

  const handlePresentation = (e, index, id) => {

    const order = index + 1

    setCurrentIndex(index)

    console.log(currentIndex)

    // Set clicked image to active and every other to not.
    const updatedPortfolioImages = portfolioImages.map( (image, index) => {
      
      if (image.id === id) {
        setFeaturedImage(image)
        return Object.assign({}, {...image}, {active: true})
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
        <div className="portfolio__featured">
          { featuredImage && <GatsbyImage image={getImage(featuredImage.featured)} alt={featuredImage.title} /> }
        </div>
        <div className="portfolio__grid">
          { portfolioImages &&
            portfolioImages.map( (image, index ) => <PortfolioPhoto key={image.id} index={index} featuredRow={image.featuredRow} {...image} handlePresentation={handlePresentation} /> )
          }
        </div>
      </div>
    </Layout>
  )
}

export default Portfolio