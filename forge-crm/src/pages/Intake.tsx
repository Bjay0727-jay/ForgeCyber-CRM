import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import Card from '../components/Card'
import { createOrganization } from '../lib/api'
import type { IntakeFormData as IntakePayload } from '../types'

const industrySectors = ['Defense / DOD', 'Federal Government', 'Healthcare', 'Financial Services', 'State & Local Government', 'Critical Infrastructure', 'Other']
const complianceFrameworks = ['CMMC 2.0', 'NIST 800-53', 'NIST 800-171', 'FedRAMP', 'HIPAA', 'PCI-DSS', 'SOX', 'SOC 2']
const serviceOptions = ['Security Posture Assessment', 'CMMC Gap Analysis', 'Penetration Testing', 'HIPAA Compliance', 'Managed SOC Services', 'Incident Response', 'GRC Consulting', 'Security Awareness Training']

const intakeSchema = z.object({
  organization: z.object({
    name: z.string().min(2, 'Organization name is required'),
    sector: z.string().min(1, 'Please select a sector'),
    address: z.string().optional(),
    cityStateZip: z.string().optional(),
    website: z.string().refine((val) => { if (!val) return true; try { new URL(val); return true } catch { return false } }, { message: 'Must be a valid URL' }).optional(),
    employeeCount: z.string().optional(),
  }),
  contact: z.object({
    name: z.string().min(2, 'Contact name is required'),
    title: z.string().optional(),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    preferredContact: z.string().default('Email'),
  }),
  compliance: z.array(z.string()).optional(),
  securityTools: z.string().optional(),
  securityChallenges: z.string().optional(),
  services: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
})

type IntakeFormData = z.infer<typeof intakeSchema>

const inputClasses = (hasError: boolean): string =>
  `w-full py-2.5 px-3.5 border rounded-lg text-sm text-forge-text bg-white transition-colors focus:outline-none ${
    hasError
      ? 'border-forge-danger focus:ring-2 focus:ring-forge-danger/20 focus:border-forge-danger'
      : 'border-forge-border focus:ring-2 focus:ring-forge-teal/20 focus:border-forge-teal'
  }`

export default function Intake() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm<IntakeFormData>({
    resolver: zodResolver(intakeSchema) as never,
    defaultValues: {
      organization: { name: '', sector: '', address: '', cityStateZip: '', website: '', employeeCount: '' },
      contact: { name: '', title: '', email: '', phone: '', preferredContact: 'Email' },
      compliance: [],
      securityTools: '',
      securityChallenges: '',
      services: [],
      timeline: '',
      budget: '',
      notes: '',
    },
  })

  // Restore saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('intake-draft')
      if (saved) reset(JSON.parse(saved))
    } catch { /* ignore corrupt data */ }
  }, [reset])

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true)
    createOrganization({
      organization: { name: data.organization.name, sector: data.organization.sector, address: data.organization.address ?? '', cityStateZip: data.organization.cityStateZip ?? '', website: data.organization.website ?? '', employeeCount: data.organization.employeeCount ?? '' },
      contact: { name: data.contact.name, title: data.contact.title ?? '', email: data.contact.email, phone: data.contact.phone ?? '', preferredContact: data.contact.preferredContact },
      compliance: data.compliance ?? [],
      securityTools: data.securityTools ?? '',
      securityChallenges: data.securityChallenges ?? '',
      services: data.services ?? [],
      timeline: data.timeline ?? '',
      budget: data.budget ?? '',
      notes: data.notes ?? '',
    } satisfies IntakePayload)
    localStorage.removeItem('intake-draft')
    setIsSubmitting(false)
    setShowSuccess(true)
    setTimeout(() => { setShowSuccess(false); reset() }, 2000)
  }

  const handleSaveDraft = async () => {
    setIsDraftSaving(true)
    const values = getValues()
    await new Promise((resolve) => setTimeout(resolve, 1000))
    localStorage.setItem('intake-draft', JSON.stringify(values))
    setIsDraftSaving(false)
    setDraftSaved(true)
    setTimeout(() => setDraftSaved(false), 2000)
  }

  return (
    <Card>
      {showSuccess && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-forge-success/20 bg-forge-success/6 px-4 py-3 animate-fadeIn">
          <CheckCircle className="text-forge-success" size={18} />
          <p className="text-sm font-medium text-forge-success">Customer created successfully!</p>
        </div>
      )}

      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Organization */}
        <section>
          <h3 className="text-sm font-semibold text-forge-text mb-4">Organization Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Organization Name *</label>
                <input type="text" className={inputClasses(!!errors.organization?.name)} placeholder="Enter organization name" {...register('organization.name')} />
                {errors.organization?.name && <p className="text-forge-danger text-xs mt-1">{errors.organization.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Industry Sector *</label>
                <select className={inputClasses(!!errors.organization?.sector)} {...register('organization.sector')}>
                  <option value="">Select sector...</option>
                  {industrySectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.organization?.sector && <p className="text-forge-danger text-xs mt-1">{errors.organization.sector.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">Address</label>
              <input type="text" className={inputClasses(false)} placeholder="Street address" {...register('organization.address')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">City, State, ZIP</label>
              <input type="text" className={inputClasses(false)} placeholder="City, State ZIP" {...register('organization.cityStateZip')} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Website</label>
                <input type="url" className={inputClasses(!!errors.organization?.website)} placeholder="https://" {...register('organization.website')} />
                {errors.organization?.website && <p className="text-forge-danger text-xs mt-1">{errors.organization.website.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Employee Count</label>
                <select className={inputClasses(false)} {...register('organization.employeeCount')}>
                  <option value="">Select range...</option>
                  <option value="1-50">1 - 50</option>
                  <option value="51-200">51 - 200</option>
                  <option value="201-1000">201 - 1,000</option>
                  <option value="1001-5000">1,001 - 5,000</option>
                  <option value="5001+">5,001+</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section>
          <h3 className="text-sm font-semibold text-forge-text mb-4">Primary Contact</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Full Name *</label>
                <input type="text" className={inputClasses(!!errors.contact?.name)} placeholder="Contact name" {...register('contact.name')} />
                {errors.contact?.name && <p className="text-forge-danger text-xs mt-1">{errors.contact.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Title</label>
                <input type="text" className={inputClasses(false)} placeholder="Job title" {...register('contact.title')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Email *</label>
                <input type="email" className={inputClasses(!!errors.contact?.email)} placeholder="email@company.com" {...register('contact.email')} />
                {errors.contact?.email && <p className="text-forge-danger text-xs mt-1">{errors.contact.email.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Phone</label>
                <input type="tel" className={inputClasses(false)} placeholder="(555) 000-0000" {...register('contact.phone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Preferred Contact</label>
                <select className={inputClasses(false)} {...register('contact.preferredContact')}>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Slack">Slack</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section>
          <h3 className="text-sm font-semibold text-forge-text mb-4">Compliance & Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Applicable Frameworks</label>
              <Controller
                name="compliance"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-4 gap-2">
                    {complianceFrameworks.map((fw) => {
                      const values = field.value ?? []
                      const isChecked = values.includes(fw)
                      return (
                        <label key={fw} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'border-forge-teal bg-forge-teal-subtle' : 'border-forge-border hover:border-forge-text-faint'}`}>
                          <input type="checkbox" checked={isChecked} onChange={() => { const updated = isChecked ? values.filter((v: string) => v !== fw) : [...values, fw]; field.onChange(updated) }} className="w-3.5 h-3.5 rounded border-forge-border text-forge-teal focus:ring-forge-teal" />
                          <span className="text-sm text-forge-text">{fw}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">Current Security Tools</label>
              <textarea rows={3} className={inputClasses(false)} placeholder="List current security tools, SIEM, EDR, firewalls, etc." {...register('securityTools')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">Known Security Challenges</label>
              <textarea rows={3} className={inputClasses(false)} placeholder="Describe any known security gaps or concerns..." {...register('securityChallenges')} />
            </div>
          </div>
        </section>

        {/* Engagement */}
        <section>
          <h3 className="text-sm font-semibold text-forge-text mb-4">Engagement Details</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Requested Services</label>
              <Controller
                name="services"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-2">
                    {serviceOptions.map((svc) => {
                      const values = field.value ?? []
                      const isChecked = values.includes(svc)
                      return (
                        <label key={svc} className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'border-forge-teal bg-forge-teal-subtle' : 'border-forge-border hover:border-forge-text-faint'}`}>
                          <input type="checkbox" checked={isChecked} onChange={() => { const updated = isChecked ? values.filter((v: string) => v !== svc) : [...values, svc]; field.onChange(updated) }} className="w-3.5 h-3.5 rounded border-forge-border text-forge-teal focus:ring-forge-teal" />
                          <span className="text-sm text-forge-text">{svc}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Timeline</label>
                <select className={inputClasses(false)} {...register('timeline')}>
                  <option value="">Select timeline...</option>
                  <option value="immediate">Immediate (within 2 weeks)</option>
                  <option value="1month">Within 1 month</option>
                  <option value="quarter">This quarter</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-1.5">Budget Range</label>
                <select className={inputClasses(false)} {...register('budget')}>
                  <option value="">Select range...</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-250k">$100,000 - $250,000</option>
                  <option value="250k+">$250,000+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-1.5">Additional Notes</label>
              <textarea rows={3} className={inputClasses(false)} placeholder="Any additional context or requirements..." {...register('notes')} />
            </div>
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-5 border-t border-forge-border">
          <button type="button" disabled={isDraftSaving} onClick={handleSaveDraft} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-forge-border text-sm font-medium text-forge-text-muted hover:bg-forge-bg transition-colors disabled:opacity-50">
            {isDraftSaving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : draftSaved ? <><CheckCircle size={15} className="text-forge-success" /> Saved!</> : <><Save size={15} /> Save Draft</>}
          </button>
          <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-forge-teal text-white text-sm font-medium hover:bg-forge-teal/90 transition-colors disabled:opacity-50">
            {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Creating...</> : <>Create Customer <ArrowRight size={15} /></>}
          </button>
        </div>
      </form>
    </Card>
  )
}
