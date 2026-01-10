function Logo({ isScrolled, isHomePage }) {
  const logoClass = isHomePage
    ? isScrolled
      ? 'logo logo--header'
      : 'logo logo--hero'
    : 'logo logo--header'

  return <div className={logoClass}>an(y) designs</div>
}

export default Logo

