import React, { useState, useEffect, useCallback, useMemo } from "react"
import { graphql } from "gatsby"

import { GatsbyImage, getImage } from "gatsby-plugin-image"
import { useSwipeable } from "react-swipeable"

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

const Portfolio = ({data}) => {

  const { title, excerpt, featuredImages } = data?.wpPortfolio || [{ title: null, excerpt: null, featuredImages: {images: []}}]
  
  // Set portfolioImages.
  const portfolioImages = useMemo(() => (featuredImages?.images || []), [featuredImages])
  const portfolioImagesTotal = portfolioImages.length

  // Manage current item index.
  const [ currentIndex, setCurrentIndex ] = useState(0)

  const featuredPortfolioImage = (portfolioImages && portfolioImages.length) ? portfolioImages[0] : []

  // First portfolio item becomes the featured image.
  const [ featuredImage, setFeaturedImage ] = useState( featuredPortfolioImage )

  const goToNextImage = useCallback(() => {
    setCurrentIndex(c => {
      if (c < (portfolioImagesTotal - 1)) {
        return c + 1
      }
      return c
    })
  }, [ setCurrentIndex, portfolioImagesTotal ])

  const goToPreviousImage = useCallback(() => {
    setCurrentIndex(c => {
      if (c >= 1) {
        return c - 1
      }
      return c
    })
  }, [ setCurrentIndex ])

  const handlers = useSwipeable({
    onSwiped: (eventData) => console.log("User Swiped!", eventData),
    onSwipedLeft: () => goToNextImage(),
    onSwipedRight: () => goToPreviousImage()
  })

  const handleKeyPress = useCallback( event => {

    // Key pushed.
    const { key } = event
    const escKeys = [ 'ArrowRight', 'ArrowLeft' ]

    // If arrowing left or right, let's continiue.
    if (escKeys.includes(String(key))) {
      
      // Move forward
      if (key === 'ArrowRight') {
        goToNextImage()
        return
      }
      
      // Navigate back
      goToPreviousImage()
      
    }

  }, [ goToNextImage, goToPreviousImage ])

  useEffect(() => {
    
    window.addEventListener( 'keydown', handleKeyPress )

    return () => {
      window.removeEventListener( 'keydown', handleKeyPress )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    
    // setFeaturedImageByIndex && setFeaturedImageByIndex(currentIndex)

    // const setFeaturedImageByIndex = (currentIndex) => {
    //   const featuredImage = portfolioImages.filter( (image, index) => index === currentIndex )
    //   if (featuredImage && featuredImage.length) setFeaturedImage(featuredImage[0])
    // }

    const featuredImage = portfolioImages.filter( (image, index) => index === currentIndex )
    if (featuredImage && featuredImage.length) setFeaturedImage(featuredImage[0])
    
  }, [ currentIndex, portfolioImages, setFeaturedImage ])

  

  const handleThumbnailClick = (e, index, id) => {
    const featuredImage = portfolioImages.filter( (image) => image.id === id )
    if (featuredImage && featuredImage.length) setFeaturedImage(featuredImage[0])
    setCurrentIndex(index)
  }

  const myCount = ((currentIndex + 1) <= portfolioImagesTotal) ? currentIndex + 1 : currentIndex

  return (
    <Layout>
      <h1>{ title }: {myCount}</h1>
      <div dangerouslySetInnerHTML={{__html: excerpt}} />
      <div className="portfolio">
        <div className="portfolio__featured" {...handlers}>
          { featuredImage && <GatsbyImage image={getImage(featuredImage.featured)} alt={featuredImage.title} /> }
        </div>
        <div className="portfolio__right">
          {
            portfolioImages && portfolioImages.length > 1 && <PortfolioCount current={currentIndex} total={portfolioImages.length}/>
          }
          <div className="portfolio__grid">
            { 
              portfolioImages &&
              portfolioImages.length > 1 &&
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