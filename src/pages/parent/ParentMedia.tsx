import { useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Video,
  Image as ImageIcon,
  Brain,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useActiveChild } from '../../context/ChildSelectionContext'
import { MediaAPI } from '../../lib/api'
import { FadeIn } from '../../components/motion/FadeIn'
import { Badge } from '../../components/ui/Badge'
import { SpecularButton } from '../../components/motion/SpecularButton'

export function ParentMedia() {
  const { myChildren, media, uploadMedia, refreshMedia } = useData()
  const { activeChild } = useActiveChild()
  const child = activeChild || myChildren[0]
  const items = useMemo(
    () => (child ? media.filter((m) => m.childId === child.id) : media),
    [media, child],
  )
  const [drag, setDrag] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: FileList | null) => {
    if (!files?.length || !child) {
      setError(child ? '' : 'No child linked to this parent account yet.')
      return
    }
    const file = files[0]
    setError('')
    setUploading(true)
    try {
      await uploadMedia(child.id, file)
      // poll until analysis completes
      const start = Date.now()
      while (Date.now() - start < 12000) {
        await new Promise((r) => setTimeout(r, 1200))
        await refreshMedia(child.id)
        break
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id: string) => {
    try {
      await MediaAPI.remove(id)
      await refreshMedia(child?.id)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <FadeIn>
        <h1 className="font-display text-2xl font-semibold text-ink">Behaviour media</h1>
        <p className="text-sm text-slate mt-1">
          Upload videos & photos for live AI analysis
          {child ? ` · ${child.name}` : ''}
        </p>
      </FadeIn>

      {error && (
        <p className="text-sm text-danger bg-danger/8 px-3 py-2 rounded-xl">{error}</p>
      )}

      <FadeIn delay={0.08}>
        <div
          className={`dropzone p-10 text-center cursor-pointer ${drag ? 'active' : ''}`}
          onDragOver={(e) => {
            e.preventDefault()
            setDrag(true)
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDrag(false)
            void processFiles(e.dataTransfer.files)
          }}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => void processFiles(e.target.files)}
          />
          <div className="w-14 h-14 rounded-2xl bg-leaf/10 text-leaf flex items-center justify-center mx-auto mb-4">
            {uploading ? <Loader2 size={26} className="animate-spin" /> : <Upload size={26} />}
          </div>
          <p className="font-semibold text-ink">
            {uploading ? 'Uploading & analyzing…' : 'Drop video or photo here'}
          </p>
          <p className="text-sm text-slate mt-1">Stored on server · MP4, MOV, JPG, PNG</p>
          <div className="mt-4">
            <SpecularButton
              size="sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                inputRef.current?.click()
              }}
            >
              Choose file
            </SpecularButton>
          </div>
        </div>
      </FadeIn>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-3xl p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    item.type === 'video' ? 'bg-sky/15 text-sky' : 'bg-lavender/15 text-lavender'
                  }`}
                >
                  {item.type === 'video' ? <Video size={22} /> : <ImageIcon size={22} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-semibold text-ink truncate">{item.name}</p>
                    <Badge status={item.analysisStatus}>
                      {item.analysisStatus === 'complete' ? 'Analyzed' : item.analysisStatus}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate">
                    {new Date(item.uploadedAt).toLocaleString()} · {item.type}
                    {item.url ? (
                      <>
                        {' · '}
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-leaf underline">
                          open file
                        </a>
                      </>
                    ) : null}
                  </p>

                  {item.analysisStatus === 'analyzing' && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-warn">
                      <Loader2 size={14} className="animate-spin" /> Running behavioural models…
                    </div>
                  )}

                  {item.analysis && (
                    <div className="mt-4 p-4 rounded-2xl bg-forest/5 border border-forest/10">
                      <div className="flex items-center gap-2 mb-2 text-forest">
                        <Brain size={15} />
                        <span className="text-xs font-bold uppercase tracking-wider">AI analysis</span>
                      </div>
                      <p className="text-sm text-ink leading-relaxed">{item.analysis}</p>
                      {item.findings && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {item.findings.map((f) => (
                            <span
                              key={f}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-ok/10 text-ok"
                            >
                              <CheckCircle2 size={11} /> {f}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-3 p-3 rounded-xl bg-white border border-mist">
                        <p className="text-xs font-bold uppercase tracking-wider text-leaf mb-1 flex items-center gap-1">
                          <Sparkles size={12} /> Solutions for parents
                        </p>
                        <p className="text-sm text-slate leading-relaxed">
                          {(item as { solutions?: string }).solutions ||
                            'Continue daily interactive play. Capture a speech sample next week. Share with your doctor at the next visit.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-mist text-slate"
                  onClick={() => void remove(item.id)}
                  aria-label="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {!items.length && (
          <p className="text-sm text-slate text-center py-8">No uploads yet — add a video or photo above.</p>
        )}
      </div>
    </div>
  )
}
