import '../App.css'
import { useQuery } from '@tanstack/react-query'
import DelayedLink from '../components/DelayedLink'
import { fetchSiteSettingsQuery } from '../lib/siteDataQueries'
import ResponsiveText from '../components/ResponsiveText'
import useLocale from '../hooks/useLocale'
import { resolveTranslation } from '../lib/textLayout'

const DEFAULTS = {
  description:
    'Digital designer con +5 anni di esperienza da freelance, collaborando con diversi studi di design, startup e aziende come UI/UX Designer, con un forte focus su user experience, web design art direction e design systems',
}

const SERVICES = [
  'UI/UX Design',
  'User Experience (UX)',
  'E-commerce design',
  'Landing page',
  'Design System',
  'Sviluppo in Webflow',
  'Consulenza Figma/Design/Webflow',
]

function About() {
  const { locale } = useLocale()
  const { data: settings } = useQuery({
    queryKey: ['site_settings'],
    queryFn: fetchSiteSettingsQuery,
    staleTime: 1000 * 60 * 5,
  })

  const localizedSettings = resolveTranslation(settings, locale)
  const description = localizedSettings.about_description_text || localizedSettings.description_text || DEFAULTS.description
  const wrapSettings = localizedSettings.wrap_settings || {}

  return (
    <div className="about-page page-fade-in" lang={locale}>
      <section className="about-hero">
        <div className="about-container">
          <h1 className="about-title">About</h1>
        </div>
      </section>

      <section className="about-content">
        <div className="about-container">
          <div className="about-intro">
            <p className="about-intro-text"><ResponsiveText text={description} settings={wrapSettings} field="about_description_text" /></p>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">(SU DI ME)</h2>
            <div className="about-section-content">
              <p className="about-text">
                Mi piace mettere ordine, dalle piccole cose di ogni giorno ai
                file di lavoro. Allo stesso tempo non rinuncio mai alla
                creatività e a quel pizzico di follia che rende tutto più
                interessante.
              </p>
              <p className="about-text">
                Preferisco lavorare su progetti con obiettivi chiari, analizzando
                flussi e dati per migliorare l&apos;esperienza utente ed
                esplorando nuove strade creative per raccontare l&apos;identità
                di un brand online.
              </p>
              <p className="about-text">
                Fotografia, tipografia e branding sono il punto di partenza della
                mia ricerca e guidano la direzione artistica di ogni progetto.
                Webflow e lo studio dei framework, invece, sono fondamentali per
                organizzare i file e gestire al meglio l&apos;handoff verso lo
                sviluppo o direttamente al cliente.
              </p>
            </div>
          </div>

          <div className="about-section">
            <h2 className="about-section-title">(SERVIZI)</h2>
            <ul className="about-services-grid">
              {SERVICES.map((service, i) => (
                <li key={i} className="about-service-chip">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div className="about-section about-collaborations">
            <h2 className="about-section-title">(COLLABORAZIONI)</h2>
            <div className="about-section-content">
              <p className="about-text">
                Sono sempre aperto a nuove collaborazioni o anche solo a una
                chiacchierata per conoscerci meglio.
              </p>
              <DelayedLink to="/#contact-us" className="about-cta">
                Scrivimi
              </DelayedLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
