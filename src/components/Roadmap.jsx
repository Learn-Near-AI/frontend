import React from 'react'
import { Calendar, CheckCircle2, Circle } from 'lucide-react'
import Footer from './Footer'

function Roadmap({ scrollToTop }) {
  const milestones = [
    {
      id: 1,
      title: "Working platform + 30 examples",
      date: "End of January 2026",
      status: "completed",
      deliverables: [
        "Live website https://near.peersurf.xyz/",
        "In-browser execution (Run & Deploy)",
        "AI Code Assistant integrated",
        "First 30 examples with auto-tests", 
        "Search + difficulty tags"
      ]
    },
    {
      id: 2,
      title: "Full 60 examples + AI features",
      date: "Mid-February 2026",
      status: "in-progress",
      deliverables: [
        "Additional 30 examples (total 60)",
        "AI Bug Fixer + Code Generator live",
        "Dark mode + mobile optimization",
        "All examples tested and documented",
        "Implement dependencies build caching to speed up deployments",
        "Fix multi-user deployment: unique testnet accounts per user to prevent contract overrides"
      ]
    },
    {
      id: 3,
      title: "Polish, audit & official launch",
      date: "End of February 2026",
      status: "upcoming",
      deliverables: [
        "Security & code review",
        "Integration with docs.near.org",
        "Full documentation for contributors",
        "Official announcement & promotion",
        "Performance optimization and deployment pipeline improvements",
        "Comprehensive testing of multi-user deployment system",
        "Final compatibility verification with NEAR node requirements"
      ]
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-6 w-6 text-near-primary" />
      case 'in-progress':
        return <Circle className="h-6 w-6 text-yellow-500 fill-yellow-500" />
      case 'upcoming':
        return <Circle className="h-6 w-6 text-gray-500" />
      default:
        return <Circle className="h-6 w-6 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'border-near-primary bg-near-primary/10'
      case 'in-progress':
        return 'border-yellow-500 bg-yellow-500/10'
      case 'upcoming':
        return 'border-[#3e3e42] bg-[#111216]'
      default:
        return 'border-[#3e3e42] bg-[#111216]'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-xs font-semibold text-near-primary uppercase">Completed</span>
      case 'in-progress':
        return <span className="text-xs font-semibold text-yellow-500 uppercase">In Progress</span>
      case 'upcoming':
        return <span className="text-xs font-semibold text-gray-500 uppercase">Upcoming</span>
      default:
        return null
    }
  }

  return (
    <>
      <section className="bg-[#111216] pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Roadmap
            </h1>
          </div>

          {/* Milestones Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`relative bg-[#111216] rounded-xl p-6 border-2 ${getStatusColor(milestone.status)} transition-all duration-300 hover:shadow-lg hover:shadow-near-primary/10 flex flex-col`}
              >
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(milestone.status)}
                    {getStatusLabel(milestone.status)}
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {milestone.title}
                </h3>

                {/* Date */}
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{milestone.date}</span>
                </div>

                {/* Deliverables */}
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                    Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {milestone.deliverables.map((deliverable, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className={`mt-1 flex-shrink-0 ${
                          milestone.status === 'completed' ? 'text-near-primary' : 'text-gray-500'
                        }`}>
                          {milestone.status === 'completed' ? '✓' : '•'}
                        </span>
                        <span className="leading-relaxed">{deliverable}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer scrollToTop={scrollToTop} />
    </>
  )
}

export default Roadmap
