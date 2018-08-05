import React from 'react'
import PropTypes from 'prop-types'
import { I18nProvider } from '@lingui/react'
import { navigateTo } from 'gatsby-link'
import CssBaseline from '@material-ui/core/CssBaseline'
import { withStyles } from '@material-ui/core/styles'
import Head from '../components/head'
import Header from '../components/header'
import Main from '../components/main'
import Footer from '../components/footer'
import * as i18nPluginHelper from '../../plugins/gatsby-plugin-herodamage-i18n'
import withRoot from '../../plugins/gatsby-plugin-herodamage-material-ui/withRoot'

const styles = (theme) => ({
  layout: Object.assign({}, theme.typography.body1, {
    margin: '0 auto',
    maxWidth: theme.breakpoints.values.lg,
    [theme.breakpoints.up('xl')]: {
      maxWidth: 2 / 3 * 100 + '%'
    },
    '& h1': theme.typography.headline,
    '& h2': theme.typography.title,
    '& h3': theme.typography.subheading,
    '& h4': theme.typography.body2,
    '& figcaption': theme.typography.caption,
    '& a': {
      color: theme.palette.secondary.main,
      textDecoration: 'none',
      '&:hover': {
        color: theme.palette.secondary.light
      }
    }
  })
})

const Layout = ({classes, ...props}) => {
  const {data, i18nPlugin} = props
  const siteMetadata = data.site.siteMetadata
  return (
    <div className={classes.layout}>
      <Head siteMetadata={siteMetadata}/>
      <Header i18nPlugin={i18nPlugin} siteMetadata={siteMetadata}/>
      <Main {...props}/>
      <Footer siteMetadata={siteMetadata}/>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.func,
  classes: PropTypes.object,
  data: PropTypes.object,
  i18nPlugin: PropTypes.object
}

const IndexLayout = (props) => {
  const {pathname} = props.location
  const lang = i18nPluginHelper.langFromPath(pathname)
  const i18nPlugin = {
    changeLang: (newLang) => {
      navigateTo(i18nPluginHelper.replacePrefix(newLang, pathname))
    },
    lang,
    isIntlPage: i18nPluginHelper.isIntlPage(pathname),
    t: i18nPluginHelper.translation(lang),
    tLink: (path) => i18nPluginHelper.replacePrefix(lang, path)
  }
  return (
    <I18nProvider language={lang} catalogs={i18nPluginHelper.catalogs}>
      <CssBaseline/>
      <Layout {...props} i18nPlugin={i18nPlugin}/>
    </I18nProvider>
  )
}

IndexLayout.propTypes = {
  location: PropTypes.object
}

export default withRoot(withStyles(styles)(IndexLayout))

export const query = graphql`
  query HeadQuery {
    site {
      siteMetadata {
        title
        github
        description
        keywords
      }
    }
  }
`
