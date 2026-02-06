import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import Card from '../components/Card'

const intakeSchema = z.object({
  orgName: z.string().min(2, 'Organization name is required'),
  sector: z.string().min(1, 'Please select a sector'),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  employeeCount: z.string().optional(),
  contactName: z.string().min(2, 'Contact name is required'),
  contactTitle: z.string().optional(),
  contactEmail: z.string().email('Valid email is required'),
  contactPhone: z.string().optional(),
  preferredContact: z.string().optional(),
  compliance: z.array(z.string()).optional(),
  securityTools: z.string().optional(),
  securityChallenges: z.string().optional(),
  services: z.array(z.string()).optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
})

type IntakeForm = z.infer<typeof intakeSchema>

const industrySectors = [
  'Defense / DOD', 'Federal Government', 'Healthcare',
  'Financial Services', 'State & Local Government', 'Critical Infrastructure', 'Other',
]

const complianceFrameworks = [
  'CMMC 2.0', 'NIST 800-53', 'NIST 800-171', 'FedRAMP',
  'HIPAA', 'PCI-DSS', 'SOX', 'SOC 2',
]

const serviceOptions = [
  'Security Posture Assessment', 'CMMC Gap Analysis', 'Penetration Testing',
  'HIPAA Compliance', 'Managed SOC Services', 'Incident Response',
  'GRC Consulting', 'Security Awareness Training',
]

const inputBase = 'w-full py-3 px-4 border rounded-xl text-sm transition-all focus:outline-none'
const inputOk = `${inputBase} border-forge-border focus:border-forge-teal focus:ring-3 focus:ring-forge-teal-glow`
const inputErr = `${inputBase} border-forge-danger focus:border-forge-danger focus:ring-3 focus:ring-forge-danger/20`

export default function Intake() {
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<IntakeForm>({
    resolver: zodResolver(intakeSchema),
    defaultValues: { compliance: [], services: [], preferredContact: '', sector: '' },
  })

  const selectedCompliance = watch('compliance') || []
  const selectedServices = watch('services') || []

  const toggleArray = (field: 'compliance' | 'services', value: string) => {
    const current = field === 'compliance' ? selectedCompliance : selectedServices
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    setValue(field, next)
  }

  const onSubmit = async (data: IntakeForm) => {
    setSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    const existing = JSON.parse(localStorage.getItem('forge_customers') || '[]')
    existing.push({ id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() })
    localStorage.setItem('forge_customers', JSON.stringify(existing))
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => { setSuccess(false); reset() }, 3000)
  }

  const onSaveDraft = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 500))
    const data = watch()
    const drafts = JSON.parse(localStorage.getItem('forge_drafts') || '[]')
    drafts.push({ id: crypto.randomUUID(), ...data, savedAt: new Date().toISOString() })
    localStorage.setItem('forge_drafts', JSON.stringify(drafts))
    setSubmitting(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <Card>
      {success && (
        <div className="mx-6 mt-6 flex items-center gap-3 p-4 rounded-xl bg-forge-success/10 border border-forge-success/30">
          <CheckCircle2 size={20} className="text-forge-success flex-shrink-0" />
          <span className="text-sm font-medium text-forge-success">Customer created successfully!</span>
        </div>
      )}

      <form className="space-y-10 p-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Organization Information */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">Organization Information</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Organization Name *</label>
                <input {...register('orgName')} className={errors.orgName ? inputErr : inputOk} placeholder="Enter organization name" />
                {errors.orgName && <p className="text-forge-danger text-xs mt-1">{errors.orgName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Industry Sector *</label>
                <select {...register('sector')} className={errors.sector ? inputErr : inputOk}>
                  <option value="">Select sector...</option>
                  {industrySectors.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.sector && <p className="text-forge-danger text-xs mt-1">{errors.sector.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Address</label>
              <input {...register('address')} className={inputOk} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">City</label>
                <input {...register('city')} className={inputOk} placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">State</label>
                <input {...register('state')} className={inputOk} placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">ZIP Code</label>
                <input {...register('zip')} className={inputOk} placeholder="ZIP" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Website</label>
                <input {...register('website')} className={errors.website ? inputErr : inputOk} placeholder="https://" />
                {errors.website && <p className="text-forge-danger text-xs mt-1">{errors.website.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Employee Count</label>
                <select {...register('employeeCount')} className={inputOk}>
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

        {/* Primary Contact */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">Primary Contact</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Full Name *</label>
                <input {...register('contactName')} className={errors.contactName ? inputErr : inputOk} placeholder="Contact name" />
                {errors.contactName && <p className="text-forge-danger text-xs mt-1">{errors.contactName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Title</label>
                <input {...register('contactTitle')} className={inputOk} placeholder="Job title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Email *</label>
                <input {...register('contactEmail')} className={errors.contactEmail ? inputErr : inputOk} placeholder="email@company.com" />
                {errors.contactEmail && <p className="text-forge-danger text-xs mt-1">{errors.contactEmail.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Phone</label>
                <input {...register('contactPhone')} className={inputOk} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Preferred Contact Method</label>
                <select {...register('preferredContact')} className={inputOk}>
                  <option value="">Select method...</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="teams">Microsoft Teams</option>
                  <option value="slack">Slack</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance & Security */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">Compliance & Security Requirements</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-3">Applicable Frameworks</label>
              <div className="grid grid-cols-4 gap-3">
                {complianceFrameworks.map((fw) => (
                  <label key={fw} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedCompliance.includes(fw) ? 'border-forge-teal bg-forge-teal-glow' : 'border-forge-border hover:border-forge-teal/40'}`}>
                    <input type="checkbox" checked={selectedCompliance.includes(fw)} onChange={() => toggleArray('compliance', fw)} className="w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal" />
                    <span className="text-sm text-forge-text">{fw}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Current Security Tools & Technologies</label>
              <textarea {...register('securityTools')} rows={3} className={inputOk} placeholder="List current security tools, SIEM, EDR, firewalls, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Known Security Challenges</label>
              <textarea {...register('securityChallenges')} rows={3} className={inputOk} placeholder="Describe any known security gaps, recent incidents, or concerns..." />
            </div>
          </div>
        </section>

        {/* Engagement Details */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">Engagement Details</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-3">Requested Services</label>
              <div className="grid grid-cols-2 gap-3">
                {serviceOptions.map((svc) => (
                  <label key={svc} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedServices.includes(svc) ? 'border-forge-teal bg-forge-teal-glow' : 'border-forge-border hover:border-forge-teal/40'}`}>
                    <input type="checkbox" checked={selectedServices.includes(svc)} onChange={() => toggleArray('services', svc)} className="w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal" />
                    <span className="text-sm text-forge-text">{svc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Desired Timeline</label>
                <select {...register('timeline')} className={inputOk}>
                  <option value="">Select timeline...</option>
                  <option value="immediate">Immediate (within 2 weeks)</option>
                  <option value="1month">Within 1 month</option>
                  <option value="quarter">This quarter</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Budget Range</label>
                <select {...register('budget')} className={inputOk}>
                  <option value="">Select range...</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-250k">$100,000 - $250,000</option>
                  <option value="250k+">$250,000+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Additional Notes</label>
              <textarea {...register('notes')} rows={4} className={inputOk} placeholder="Any additional context, special requirements, or notes..." />
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-forge-border">
          <button type="button" onClick={onSaveDraft} disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-forge-border text-sm font-semibold text-forge-text-muted hover:bg-forge-bg transition-colors disabled:opacity-50">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Save as Draft
          </button>
          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : null}
            Create Customer & Start Assessment
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </Card>
  )
}
