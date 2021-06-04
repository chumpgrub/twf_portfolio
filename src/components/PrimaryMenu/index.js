import React, { useState, useEffect } from "react"
import { Link, StaticQuery, graphql } from "gatsby"

import "./PrimaryMenu.scss"

// Single menu item.
const Item = ({ item, handleHasFocus, handleBlur }) => {
  return (
    <li className="menuItem">
      <div className="menuItem__wrap">
        <Link
          key={item.id}
          to={item.path}
          onFocus={handleHasFocus ? handleHasFocus : undefined}
          onBlur={handleBlur ? handleBlur : undefined}
        >
          {item.label}
        </Link>
      </div>
    </li>
  )
}

// Menu item with children.
const ItemSubMenu = ({ item, items }) => {
  useEffect(() => {
    const escKeys = ["27", "Escape"]
    document.addEventListener("keydown", e => {
      const { key } = e
      if (escKeys.includes(String(key))) {
        setIsShown(false)
      }
    })
  })

  const [isShown, setIsShown] = useState(false)
  const activeClass = isShown ? "subMenu--active" : ""

  const handleHasFocus = () => {
    setIsShown(true)
  }

  const handleBlur = () => {
    setIsShown(false)
  }

  return (
    <li
      key={item.id}
      className="menuItem menuItem--hasChildren"
      onMouseLeave={() => setIsShown(false)}
    >
      <div className="menuItem__wrap">
        <Link
          to={item.path}
          onFocus={() => setIsShown(true)}
          onBlur={() => setIsShown(false)}
        >
          {item.label}
        </Link>
        <span className="menuItem__toggle" onClick={() => setIsShown(!isShown)}>
          +
        </span>
      </div>
      <ul className={`subMenu ${activeClass}`}>
        {items.map(item => (
          <Item
            key={item.id}
            item={item}
            handleHasFocus={handleHasFocus}
            handleBlur={handleBlur}
          />
        ))}
      </ul>
    </li>
  )
}

const PrimaryMenu = () => (
  <StaticQuery
    query={graphql`
      query PrimaryMenuQuery {
        menu: allWpMenuItem(
          filter: { menu: { node: { name: { eq: "Primary Menu" } } } }
          sort: { order: ASC, fields: order }
        ) {
          items: nodes {
            id
            label
            path
            parentId
          }
        }
      }
    `}
    render={data => {
      // Get menu items from object.
      const menuItems = data?.menu?.items || []

      // Top level items.
      let topLevel = menuItems.filter(item => item.parentId === null)

      // Build hierarchical menu structure.
      let structuredMenu = topLevel.map(item => {
        // Collect children of current menu item.
        const children = menuItems.filter(
          subItem => subItem.parentId === item.id
        )

        // Return item and include children property.
        return {
          ...item,
          children,
        }
      })

      return (
        <nav className={`menuWrapper`}>
          <ul className="menu menu--primary">
            {structuredMenu.map(item =>
              item.children && item.children.length ? (
                <ItemSubMenu key={item.id} item={item} items={item.children} />
              ) : (
                <Item key={item.id} item={item} />
              )
            )}
          </ul>
        </nav>
      )
    }}
  />
)

export default PrimaryMenu
