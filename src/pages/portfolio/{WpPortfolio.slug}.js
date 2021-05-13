import React, { Component } from "react"
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
              width: 758
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
          <div className="portfolioItem__info"><h5>{title}</h5><div dangerouslySetInnerHTML={{__html: caption}}/></div>
        </div>
      ) }
    </>
  )

}

class Portfolio extends Component {

  constructor(props) {
    super(props)

    console.log(props)

    const { title, excerpt, featuredImage } = props?.data?.wpPortfolio
    console.log(title, excerpt, featuredImage)

    this.state = {}

  }

  render() {
    return (
      <div>PORTFOLIO</div>
    )
  }
  

  /*
  const { title, excerpt, featuredImages } = data?.wpPortfolio
  const [currentIndex, setCurrentIndex] = useState(0)
  // Set portfolioImages.
  const [ portfolioImages, setPortfolioImages ] = useState( featuredImages?.images && featuredImages.images.map( image => (
    {...image, active: false}
  )))

  useEffect(() => {

    const escKeys = ['ArrowRight', 'ArrowLeft']
    
    document.addEventListener( 'keydown', (e) => {
    
      const {key} = e

      console.log(currentIndex)
    
      // If arrowing left or right, let's continiue.
      if (escKeys.includes(String(key))) {

        let nextIndex = null;
        
        // Move forward
        if (key == 'ArrowRight' && currentIndex < portfolioImages.length) {
            console.log('move forward')
            nextIndex = currentIndex + 1
        }
        
        // Navigate back
        if (key == 'ArrowLeft' && currentIndex > 1) {
          console.log('move back')
          nextIndex = currentIndex + 1
        }

        const updatedPortfolioImages = portfolioImages.map( (image, index) => {
          if (index === nextIndex) { 
            return Object.assign({}, {...image}, {active: true})
          } else {
            return Object.assign({}, {...image}, {active: false})
          }
        })


        // Update portfolioImages state.
        setPortfolioImages(updatedPortfolioImages)

        setCurrentIndex(nextIndex)

      }
    })
  }, [currentIndex])

  const handlePresentation = (e, index, id) => {
    
    const order = index + 1
    const imageHeight = e.target.offsetHeight
    const elementOffset = e.target.getBoundingClientRect().top
    const y = elementOffset + window.pageYOffset + imageHeight
    window.scrollTo({top: y, behavior: 'smooth'})
    

    // Set clicked image to active and every other to not.
    const updatedPortfolioImages = portfolioImages.map( (image, index) => {
      
      if (image.id === id) {
        // If clicked image is currently active then deactivate, otherwise set to active.
        const active = image.active ? false : true
        // Determine appropriate row for 'featured' image.
        const featuredRow = Math.ceil(order/3) + 1
        // Update current photo index.
        if (active) setCurrentIndex(index)
        // Update clicked object.
        return Object.assign({}, {...image}, {active, order, featuredRow})
      }
      
      return Object.assign({}, {...image}, {active: false, order})
    })

    // Update portfolioImages state.
    setPortfolioImages(updatedPortfolioImages)

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
  */
}

export default Portfolio