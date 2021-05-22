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
              layout: CONSTRAINED
              height: 700
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

const PortfolioCount = ({current, total}) => (
  <div className="porfolio__count">{current+1}/{total}</div>
)

const PortfolioPhotoDetail = ({title, caption}) => {
  return (
    <>
      <h4>{ title }</h4>
      <div dangerouslySetInnerHTML={{__html: caption}}/>
    </>
  )
}

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

  const { title, excerpt, featuredImages } = data?.wpPortfolio || []
  // Set portfolioImages.
  const [ portfolioImages, setPortfolioImages ] = useState( featuredImages?.images && featuredImages.images.map( (image, index) => {
    // Set the first item to active and rest not.
    const active = index === 0 ? true : false
    return {...image, active: index === 0}
  }))

  // Manage current item index.
  const [ currentIndex, setCurrentIndex ] = useState(0)

  const featuredPortfolioImage = (portfolioImages && portfolioImages.length) ? portfolioImages[0] : []

  // First portfolio item becomes the featured image.
  const [ featuredImage, setFeaturedImage ] = useState( featuredPortfolioImage )

  const handleKeyPress = useCallback( event => {

    // Key pushed.
    const { key } = event
    const escKeys = [ 'ArrowRight', 'ArrowLeft' ]

    // If arrowing left or right, let's continiue.
    if (escKeys.includes(String(key))) {
      
      // Move forward
      if (key == 'ArrowRight') {
        return goToNextImage()
      }
      
      // Navigate back
      return goToPreviousImage()
      
    }
    
  })

  useEffect(() => {
    
    window.addEventListener( 'keydown', handleKeyPress )

    return () => {
      window.removeEventListener( 'keydown', handleKeyPress )
    }

  }, [currentIndex, featuredImage, portfolioImages])

  const goToNextImage = () => {
    let nextIndex = currentIndex
    if (currentIndex < portfolioImages.length) {
      nextIndex++
      setFeaturedImageByIndex(nextIndex)
      setCurrentIndex(nextIndex)
    }
  }

  const goToPreviousImage = () => {
    let nextIndex = currentIndex
    if (currentIndex >= 1) {
      nextIndex--
      setFeaturedImageByIndex(nextIndex)
      setCurrentIndex(nextIndex)
    }
  }

  const setFeaturedImageByIndex = (nextIndex) => {
    const featuredImage = portfolioImages.filter( (image, index) => index === nextIndex )
    if (featuredImage && featuredImage.length) setFeaturedImage(featuredImage[0])
  }

  const handleThumbnailClick = (e, index, id) => {
    const featuredImage = portfolioImages.filter( (image) => image.id === id )
    if (featuredImage && featuredImage.length) setFeaturedImage(featuredImage[0])
    setCurrentIndex(index)
  }

  return (
    <Layout>
      <h1>{ title }</h1>
      <div dangerouslySetInnerHTML={{__html: excerpt}} />
      <div className="portfolio">
        <div className="portfolio__featured">
          { featuredImage && <GatsbyImage image={getImage(featuredImage.featured)} alt={featuredImage.title} /> }
        </div>
        <div className="portfolio__right">
          {
            portfolioImages && <PortfolioCount current={currentIndex} total={portfolioImages.length}/>
          }
          <div className="portfolio__grid">
            { 
              portfolioImages &&
              portfolioImages.map( (image, index ) => {
                return (
                  <GatsbyImage 
                    key={image.id}
                    image={getImage(image.thumbnail)}
                    alt={image.title}
                    onClick={(e) => handleThumbnailClick(e, index, image.id)} 
                  /> 
                )
              })
            }
          </div>
          {
            featuredImage && <PortfolioPhotoDetail {...featuredImage}/>
          }
        </div>
        
      </div>
    </Layout>
  )
}

export default Portfolio