import { useState } from 'react';
import { Save, ArrowRight } from 'lucide-react';
import Card from '../components/Card';

const industrySectors = [
  'Defense / DOD',
  'Federal Government',
  'Healthcare',
  'Financial Services',
  'State & Local Government',
  'Critical Infrastructure',
  'Other',
];

const complianceFrameworks = [
  'CMMC 2.0',
  'NIST 800-53',
  'NIST 800-171',
  'FedRAMP',
  'HIPAA',
  'PCI-DSS',
  'SOX',
  'SOC 2',
];

const serviceOptions = [
  'Security Posture Assessment',
  'CMMC Gap Analysis',
  'Penetration Testing',
  'HIPAA Compliance',
  'Managed SOC Services',
  'Incident Response',
  'GRC Consulting',
  'Security Awareness Training',
];

const inputClasses =
  'w-full py-3 px-4 border border-forge-border rounded-xl text-sm focus:outline-none focus:border-forge-teal focus:ring-3 focus:ring-forge-teal-glow transition-all';

export default function Intake() {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleFramework = (fw: string) => {
    setSelectedFrameworks((prev) =>
      prev.includes(fw) ? prev.filter((f) => f !== fw) : [...prev, fw]
    );
  };

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  return (
    <Card>
      <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
        {/* Organization Information */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">
            Organization Information
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Organization Name *
                </label>
                <input type="text" className={inputClasses} placeholder="Enter organization name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Industry Sector *
                </label>
                <select className={inputClasses}>
                  <option value="">Select sector...</option>
                  {industrySectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">
                Address
              </label>
              <input type="text" className={inputClasses} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  City
                </label>
                <input type="text" className={inputClasses} placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  State
                </label>
                <input type="text" className={inputClasses} placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  ZIP Code
                </label>
                <input type="text" className={inputClasses} placeholder="ZIP" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Website
                </label>
                <input type="url" className={inputClasses} placeholder="https://" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Employee Count
                </label>
                <select className={inputClasses}>
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
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">
            Primary Contact
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Full Name *
                </label>
                <input type="text" className={inputClasses} placeholder="Contact name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Title
                </label>
                <input type="text" className={inputClasses} placeholder="Job title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Email *
                </label>
                <input type="email" className={inputClasses} placeholder="email@company.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Phone
                </label>
                <input type="tel" className={inputClasses} placeholder="(555) 000-0000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Preferred Contact Method
                </label>
                <select className={inputClasses}>
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

        {/* Compliance & Security Requirements */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">
            Compliance & Security Requirements
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-3">
                Applicable Frameworks
              </label>
              <div className="grid grid-cols-4 gap-3">
                {complianceFrameworks.map((fw) => (
                  <label
                    key={fw}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedFrameworks.includes(fw)
                        ? 'border-forge-teal bg-forge-teal-glow'
                        : 'border-forge-border hover:border-forge-teal/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFrameworks.includes(fw)}
                      onChange={() => toggleFramework(fw)}
                      className="w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal"
                    />
                    <span className="text-sm text-forge-text">{fw}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">
                Current Security Tools & Technologies
              </label>
              <textarea
                rows={3}
                className={inputClasses}
                placeholder="List current security tools, SIEM, EDR, firewalls, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">
                Known Security Challenges
              </label>
              <textarea
                rows={3}
                className={inputClasses}
                placeholder="Describe any known security gaps, recent incidents, or concerns..."
              />
            </div>
          </div>
        </section>

        {/* Engagement Details */}
        <section>
          <h3 className="font-heading text-lg font-semibold text-forge-navy mb-5">
            Engagement Details
          </h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-forge-text mb-3">
                Requested Services
              </label>
              <div className="grid grid-cols-2 gap-3">
                {serviceOptions.map((svc) => (
                  <label
                    key={svc}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedServices.includes(svc)
                        ? 'border-forge-teal bg-forge-teal-glow'
                        : 'border-forge-border hover:border-forge-teal/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(svc)}
                      onChange={() => toggleService(svc)}
                      className="w-4 h-4 rounded border-forge-border text-forge-teal focus:ring-forge-teal"
                    />
                    <span className="text-sm text-forge-text">{svc}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Desired Timeline
                </label>
                <select className={inputClasses}>
                  <option value="">Select timeline...</option>
                  <option value="immediate">Immediate (within 2 weeks)</option>
                  <option value="1month">Within 1 month</option>
                  <option value="quarter">This quarter</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forge-text mb-2">
                  Budget Range
                </label>
                <select className={inputClasses}>
                  <option value="">Select range...</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-250k">$100,000 - $250,000</option>
                  <option value="250k+">$250,000+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-forge-text mb-2">
                Additional Notes
              </label>
              <textarea
                rows={4}
                className={inputClasses}
                placeholder="Any additional context, special requirements, or notes..."
              />
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-forge-border">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-forge-border text-sm font-semibold text-forge-text-muted hover:bg-forge-bg transition-colors"
          >
            <Save size={18} />
            Save as Draft
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Customer & Start Assessment
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </Card>
  );
}
