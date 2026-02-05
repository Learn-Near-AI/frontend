import React from 'react'
import Hero from '../../components/Hero'
import ThreeColumnFeatures from '../../components/ThreeColumnFeatures'
import AgentMode from '../../components/AgentMode'
import NextEditSuggestions from '../../components/NextEditSuggestions'
import CodeWithExtensions from '../../components/CodeWithExtensions'
import CodeInAnyLanguage from '../../components/CodeInAnyLanguage'

/**
 * Landing page feature - composes all landing page sections.
 */
export function LandingPage({ launchExamplesBrowser }) {
  return (
    <>
      <Hero launchExamplesBrowser={launchExamplesBrowser} />
      <ThreeColumnFeatures />
      <AgentMode launchExamplesBrowser={launchExamplesBrowser} />
      <NextEditSuggestions launchExamplesBrowser={launchExamplesBrowser} />
      <CodeWithExtensions launchExamplesBrowser={launchExamplesBrowser} />
      <CodeInAnyLanguage />
    </>
  )
}
