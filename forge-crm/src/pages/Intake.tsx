import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import Card from '../components/Card'

const industrySectors = [
  'Defense / DOD',
  'Federal Government',
  'Healthcare',
  'Financial Services',
  'State & Local Government',
  'Critical Infrastructure',
  'Other',
]

const complianceFrameworks = [
  'CMMC 2.0',
  'NIST 800-53',
  'NIST 800-171',
  'FedRAMP',
  'HIPAA',
  'PCI-DSS',
  'SOX',
  'SOC 2',
]

const serviceOptions = [
  'Security Posture Assessment',
  'CMMC Gap Analysis',
  'Penetration Testing',
  'HIPAA Compliance',
  'Managed SOC Services',
  'Incident Response',
  'GRC Consulting',
  'Security Awareness Training',
]

const intakeSchema = z.object({
  organization: z.object({
    name: z.string().min(2, 'Organization name is required'),
    sector: z.string().min(1, 'Please select a sector'),
    address: z.string().optional(),
    cityStateZip: z.string().optional(),
    website: z
      .string()
      .refine(
        (val) => {
          if (!val) return true
          try { new URL(val); return true } catch { return false }
        },
        { message: 'Must be a valid URL' },
      )
      .optional(),
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

const getInputClasses = (hasError: boolean): string =>
  [
    'w-full py-3 px-4 border rounded-xl text-sm',
    'font-[family-name:var(--font-body)] text-forge-text bg-forge-card',
    'transition-all focus:outline-none',
    hasError
      ? 'border-forge-danger focus:border-forge-danger focus:ring-forge-danger/20'
      : 'border-forge-border focus:border-forge-teal focus:shadow-[0_0_0_3px_var(--color-forge-teal-glow)]',
  ].join(' ')

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

  const onSubmit = async (_data: unknown) => {
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
    <Card glow>
      {showSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-forge-success/30 bg-forge-success/10 px-5 py-4 animate-fadeInScale">
          <CheckCircle className="text-forge-success" size={20} />
          <p className="text-sm font-medium text-forge-success">
            Customer created successfully! Redirecting to assessments...
          </p>
        </div>
      )}

      <form className="space-y-10" onSubmit={handleSubmit(onSubmit)}>
        {/* Organization Information */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-text mb-5">
            Organization Information
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  className={getInputClasses(!!errors.organization?.name)}
                  placeholder="Enter organization name"
                  {...register('organization.name')}
                />
                {errors.organization?.name && (
                  <p className="text-forge-danger text-xs mt-1">{errors.organization.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Industry Sector *
                </label>
                <select
                  className={getInputClasses(!!errors.organization?.sector)}
                  {...register('organization.sector')}
                >
                  <option value="">Select sector...</option>
                  {industrySectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                {errors.organization?.sector && (
                  <p className="text-forge-danger text-xs mt-1">{errors.organization.sector.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Address</label>
              <input type="text" className={getInputClasses(false)} placeholder="Street address" {...register('organization.address')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">City, State, ZIP</label>
              <input type="text" className={getInputClasses(false)} placeholder="City, State ZIP" {...register('organization.cityStateZip')} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Website</label>
                <input
                  type="url"
                  className={getInputClasses(!!errors.organization?.website)}
                  placeholder="https://"
                  {...register('organization.website')}
                />
                {errors.organization?.website && (
                  <p className="text-forge-danger text-xs mt-1">{errors.organization.website.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Employee Count</label>
                <select className={getInputClasses(false)} {...register('organization.employeeCount')}>
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
          <h3 className="font-heading text-lg font-semibold text-forge-text mb-5">
            Primary Contact
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Full Name *</label>
                <input
                  type="text"
                  className={getInputClasses(!!errors.contact?.name)}
                  placeholder="Contact name"
                  {...register('contact.name')}
                />
                {errors.contact?.name && (
                  <p className="text-forge-danger text-xs mt-1">{errors.contact.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Title</label>
                <input type="text" className={getInputClasses(false)} placeholder="Job title" {...register('contact.title')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Email *</label>
                <input
                  type="email"
                  className={getInputClasses(!!errors.contact?.email)}
                  placeholder="email@company.com"
                  {...register('contact.email')}
                />
                {errors.contact?.email && (
                  <p className="text-forge-danger text-xs mt-1">{errors.contact.email.message}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Phone</label>
                <input type="tel" className={getInputClasses(false)} placeholder="(555) 000-0000" {...register('contact.phone')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Preferred Contact Method</label>
                <select className={getInputClasses(false)} {...register('contact.preferredContact')}>
                  <option value="Email">Email</option>
                  <option value="Phone">Phone</option>
                  <option value="Microsoft Teams">Microsoft Teams</option>
                  <option value="Slack">Slack</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance & Security Requirements */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-text mb-5">
            Compliance & Security Requirements
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-3">Applicable Frameworks</label>
              <Controller
                name="compliance"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-4 gap-3">
                    {complianceFrameworks.map((fw) => {
                      const values = field.value ?? []
                      const isChecked = values.includes(fw)
                      return (
                        <label
                          key={fw}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-forge-teal bg-forge-teal-glow'
                              : 'border-forge-border hover:border-forge-teal/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? values.filter((v: string) => v !== fw)
                                : [...values, fw]
                              field.onChange(updated)
                            }}
                            className="w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal"
                          />
                          <span className="text-sm text-forge-text">{fw}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Current Security Tools & Technologies</label>
              <textarea rows={3} className={getInputClasses(false)} placeholder="List current security tools, SIEM, EDR, firewalls, etc." {...register('securityTools')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">Known Security Challenges</label>
              <textarea rows={3} className={getInputClasses(false)} placeholder="Describe any known security gaps, recent incidents, or concerns..." {...register('securityChallenges')} />
            </div>
          </div>
        </section>

        {/* Engagement Details */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-text mb-5">
            Engagement Details
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-3">Requested Services</label>
              <Controller
                name="services"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3">
                    {serviceOptions.map((svc) => {
                      const values = field.value ?? []
                      const isChecked = values.includes(svc)
                      return (
                        <label
                          key={svc}
                          className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isChecked
                              ? 'border-forge-teal bg-forge-teal-glow'
                              : 'border-forge-border hover:border-forge-teal/40'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? values.filter((v: string) => v !== svc)
                                : [...values, svc]
                              field.onChange(updated)
                            }}
                            className="w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal"
                          />
                          <span className="text-sm text-forge-text">{svc}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Desired Timeline</label>
                <select className={getInputClasses(false)} {...register('timeline')}>
                  <option value="">Select timeline...</option>
                  <option value="immediate">Immediate (within 2 weeks)</option>
                  <option value="1month">Within 1 month</option>
                  <option value="quarter">This quarter</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">Budget Range</label>
                <select className={getInputClasses(false)} {...register('budget')}>
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
              <textarea rows={4} className={getInputClasses(false)} placeholder="Any additional context, special requirements, or notes..." {...register('notes')} />
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-forge-border">
          <button
            type="button"
            disabled={isDraftSaving}
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-forge-border text-sm font-semibold text-forge-text-muted hover:bg-forge-bg-subtle transition-colors disabled:opacity-50"
          >
            {isDraftSaving ? (
              <><Loader2 size={18} className="animate-spin" /> Saving...</>
            ) : draftSaved ? (
              <><CheckCircle size={18} className="text-forge-success" /> Saved!</>
            ) : (
              <><Save size={18} /> Save as Draft</>
            )}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <><Loader2 size={18} className="animate-spin" /> Creating...</>
            ) : (
              <>Create Customer & Start Assessment <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </form>
    </Card>
  )
}
