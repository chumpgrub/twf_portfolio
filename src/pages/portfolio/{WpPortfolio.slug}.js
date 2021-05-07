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
const PortfolioPhoto = ({ id, index, thumbnail, featured, featuredRow, title, caption, active, handlePresentation }) => {

  const thumbnailImage = getImage(thumbnail)
  const featuredImage = getImage(featured)
  const imageClass = active ? 'portfolioItem--active' : '';
  const featuredStyle = {
    gridRowStart: featuredRow
  }

  return (
    <>
      <div className={`portfolioItem ${imageClass}`}
        onClick={(e) => handlePresentation(e, index, id)}
      >
        <GatsbyImage
          className={`portfolioImage`}
          image={thumbnailImage} 
          alt={title}
        />
        { active && <div className="portfolioItem__overlay"><h5>{title}</h5><div dangerouslySetInnerHTML={{__html: caption}}/></div> }
      </div>
      { active && (
        <div className={`portfolioItem portfolioItem--featured`} style={featuredStyle}>
          <GatsbyImage image={featuredImage} alt={title} />
        </div>
      ) }
    </>
  )

}

const Portfolio = ({data}) => {

  const { title, excerpt, featuredImages } = data?.wpPortfolio
  // Set portfolioImages.
  const [ portfolioImages, setPortfolioImages ] = useState( featuredImages?.images && featuredImages.images.map( image => (
    {...image, active: false}
  )))

  const handlePresentation = (e, index, id) => {

    const imageHeight = e.target.offsetHeight
    const elementOffset = e.target.getBoundingClientRect().top
    const y = elementOffset + window.pageYOffset + imageHeight
    window.scrollTo({top: y, behavior: 'smooth'})
    // console.log(e.target.offsetHeight)
    // console.log(e.target)
    // e.target.scrollIntoView()
    const order = index + 1

    // Set clicked image to active and every other to not.
    const updatedPortfolioImages = portfolioImages.map( (image, index) => {
      
      if (image.id === id) {
        // If clicked image is currently active then deactivate, otherwise set to active.
        const active = image.active ? false : true
        // const featuredOrder = (index % 3)
        // order = order + (index % 3) + 10
        // console.log(order)
        const featuredRow = Math.ceil(order/3) + 1
        console.log(index, featuredRow)
        return Object.assign({}, {...image}, {active, order, featuredRow})
      }
      
      return Object.assign({}, {...image}, {active: false, order})
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
        portfolioImages.map( (image, index ) => <PortfolioPhoto key={image.id} index={index} featuredRow={image.featuredRow} {...image} handlePresentation={handlePresentation} /> )
      }
      </div>
    </Layout>
  )
}

export default Portfolio