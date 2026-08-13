import { useState } from 'react'
import { Download, FileText, Check } from 'lucide-react'
import { formatAge, DIET_PLAN } from '../../data/mock'
import { useData } from '../../context/DataContext'
import { useActiveChild } from '../../context/ChildSelectionContext'
import { FadeIn } from '../../components/motion/FadeIn'
import { SpecularButton } from '../../components/motion/SpecularButton'
import { Badge } from '../../components/ui/Badge'
import { ChildAvatar } from '../../components/ui/ChildAvatar'

export function ParentReport() {
  const { myChildren, children: allChildren } = useData()
  const { activeChild } = useActiveChild()
  const [downloaded, setDownloaded] = useState(false)
  const child = activeChild || myChildren[0] || allChildren[0]
  if (!child) return <p className="text-slate text-sm">No child data yet.</p>

  const download = () => {
    const lines = [
      'BALVIKAS AI — CHILD DEVELOPMENT REPORT',
      '=====================================',
      '',
      `Child: ${child.name}`,
      `Age: ${formatAge(child.ageMonths)}`,
      `Gender: ${child.gender}`,
      `DOB: ${child.dob}`,
      `Parent: ${child.parentName}`,
      `Village: ${child.village}, ${child.district}`,
      '',
      `Height: ${child.heightCm} cm`,
      `Weight: ${child.weightKg} kg`,
      `Development: ${child.developmentStatus}`,
      `Risk: ${child.riskLevel}`,
      `Allergies: ${child.allergies.join(', ') || 'None'}`,
      `Conditions: ${child.medicalConditions.join(', ') || 'None'}`,
      '',
      'CLINICAL SUMMARY',
      child.summary || '',
      '',
      'SCREENINGS',
      ...child.screenings.map(
        (s) => `- ${s.date} | ${s.type} | ${s.result} | score ${s.score} | ${s.notes}`,
      ),
      '',
      'VACCINATIONS',
      ...child.vaccinations.map(
        (v) => `- ${v.name}: ${v.status}${v.givenDate ? ` (given ${v.givenDate})` : ` (due ${v.dueDate})`}`,
      ),
      '',
      'DIET SNAPSHOT',
      ...DIET_PLAN.map((d) => `- ${d.meal} (${d.time}): ${d.items}`),
      '',
      `Generated: ${new Date().toLocaleString()}`,
      'BalVikas AI · For clinical accompaniment only',
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `BalVikas_${child.name.replace(/\s+/g, '_')}_Report.txt`
    a.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Summary report</h1>
        <p className="text-sm text-slate mt-1">Downloadable overview for records and clinic visits</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="glass-card rounded-3xl p-6 md:p-8" id="report-preview">
          <div className="flex items-start justify-between gap-4 border-b border-mist pb-5 mb-5">
            <div className="flex items-center gap-4">
              <ChildAvatar name={child.name} gender={child.gender} size={56} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-leaf">BalVikas AI Report</p>
                <h2 className="font-display text-xl font-semibold text-ink">{child.name}</h2>
                <p className="text-sm text-slate">
                  {formatAge(child.ageMonths)} · {child.gender} · {child.village}
                </p>
              </div>
            </div>
            <FileText className="text-slate shrink-0" size={28} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-5">
            <div className="p-3 rounded-xl bg-mist/60">
              <p className="text-xs text-slate">Height / Weight</p>
              <p className="font-semibold text-ink">
                {child.heightCm} cm · {child.weightKg} kg
              </p>
            </div>
            <div className="p-3 rounded-xl bg-mist/60">
              <p className="text-xs text-slate">Development</p>
              <Badge status={child.developmentStatus} />
            </div>
            <div className="p-3 rounded-xl bg-mist/60">
              <p className="text-xs text-slate">Risk</p>
              <Badge status={child.riskLevel} />
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate mb-2">Summary</p>
            <p className="text-sm text-ink leading-relaxed">{child.summary}</p>
          </div>

          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate mb-2">Latest screening</p>
            {child.screenings[0] && (
              <p className="text-sm text-ink">
                {child.screenings[0].type} — score {child.screenings[0].score} ({child.screenings[0].result})
                <br />
                <span className="text-slate">{child.screenings[0].notes}</span>
              </p>
            )}
          </div>

          <SpecularButton onClick={download} className="w-full sm:w-auto">
            {downloaded ? (
              <>
                <Check size={16} /> Downloaded
              </>
            ) : (
              <>
                <Download size={16} /> Download report
              </>
            )}
          </SpecularButton>
          <p className="text-[11px] text-slate mt-3">
            Demo exports a text summary. Production builds generate branded PDF.
          </p>
        </div>
      </FadeIn>
    </div>
  )
}
