import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { pipelineColumns, customers } from '../data/mockData';
import Badge from '../components/Badge';
import Card from '../components/Card';

type Tab = 'pipeline' | 'customers' | 'opportunities';

export default function CRM() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline');
  const [sectorFilter, setSectorFilter] = useState('all');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pipeline', label: 'Pipeline View' },
    { key: 'customers', label: 'Customer List' },
    { key: 'opportunities', label: 'Opportunities' },
  ];

  const filteredCustomers =
    sectorFilter === 'all'
      ? customers
      : customers.filter((c) =>
          c.detail.toLowerCase().includes(sectorFilter.toLowerCase())
        );

  return (
    <div className="space-y-6">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-forge-bg p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white shadow-sm text-forge-teal'
                : 'text-forge-text-muted hover:text-forge-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pipeline View */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-5 gap-4">
          {pipelineColumns.map((col) => (
            <div key={col.title} className="space-y-3">
              {/* Column Header */}
              <div
                className={`bg-white rounded-xl border border-forge-border border-t-4 ${col.colorClass} p-4`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-sm font-bold text-forge-navy">
                    {col.title}
                  </h3>
                  <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-forge-bg text-xs font-bold text-forge-text-muted">
                    {col.cards.length}
                  </span>
                </div>
              </div>

              {/* Column Cards */}
              {col.cards.map((card) => (
                <div
                  key={card.name}
                  className="bg-white rounded-xl border border-forge-border p-4 hover:shadow-md hover:border-forge-teal/40 transition-all duration-200 cursor-pointer"
                >
                  <p className="font-semibold text-sm text-forge-navy mb-1">
                    {card.name}
                  </p>
                  <p className="text-xs text-forge-text-muted mb-3">
                    {card.meta}
                  </p>
                  <p className="font-heading font-bold text-forge-teal">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Customer List */}
      {activeTab === 'customers' && (
        <Card
          title="All Customers"
          action={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-forge-text-muted"
                />
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="pl-9 pr-4 py-2 rounded-lg border border-forge-border text-sm text-forge-text bg-white focus:outline-none focus:border-forge-teal appearance-none cursor-pointer"
                >
                  <option value="all">All Sectors</option>
                  <option value="defense">Defense</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="financial">Financial</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-forge-teal to-forge-teal-light text-white text-sm font-semibold shadow-lg shadow-forge-teal/25 hover:-translate-y-0.5 transition-all duration-200">
                <Plus size={16} />
                Add Customer
              </button>
            </div>
          }
        >
          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.name}
                className="flex items-center gap-4 p-4 rounded-xl border border-forge-border hover:bg-forge-bg/50 hover:border-forge-teal/30 transition-all cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-forge-navy to-forge-navy-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {customer.initials}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forge-navy text-sm">
                    {customer.name}
                  </p>
                  <p className="text-xs text-forge-text-muted mt-0.5 truncate">
                    {customer.detail}
                  </p>
                </div>

                {/* Stage Badge */}
                <Badge variant={customer.stageType}>
                  {customer.stage}
                </Badge>

                {/* Last Contact */}
                <p className="text-xs text-forge-text-muted whitespace-nowrap">
                  {customer.lastContact}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Opportunities */}
      {activeTab === 'opportunities' && (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-forge-teal-glow flex items-center justify-center mb-4">
              <Filter size={28} className="text-forge-teal" />
            </div>
            <h3 className="font-heading text-lg font-bold text-forge-navy mb-2">
              Opportunities View Coming Soon
            </h3>
            <p className="text-sm text-forge-text-muted max-w-md">
              Track and manage sales opportunities with advanced pipeline analytics, win/loss tracking, and forecasting capabilities.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
