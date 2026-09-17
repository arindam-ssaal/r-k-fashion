import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Legend,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Line, Pie, Doughnut } from 'react-chartjs-2'

import Footer from './components/Footer'
import LoginForm from './components/LoginForm'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Legend, Tooltip)

function LoginPage() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="login-page">
      {/* Animated BG grid */}
      <div className="login-bg-grid" />

      {/* Glowing orbs */}
      <div className="login-orb login-orb1" />
      <div className="login-orb login-orb2" />
      <div className="login-orb login-orb3" />

      {/* LEFT: Retail Visualization Panel */}
      <div className="login-left-panel">
        {/* Main Chart: Sales Trend */}
        <div className={`login-retail-hero ${loaded ? 'login-chart-enter' : 'opacity-0'}`}>
          <div className="text-[13px] font-bold tracking-[2px] uppercase mb-1.5" style={{ color: '#00B4D8', opacity: 0.9 }}>
            📊 Retail Intelligence Dashboard
          </div>
          <div className="text-[22px] font-extrabold leading-tight mb-4" style={{ color: '#E8F4FD' }}>
            Real-time <span style={{ color: '#00B4D8' }}>Sales Analytics</span> & Automation
          </div>
          <div className="relative" style={{ height: '180px', width: '100%' }}>
            <Line
              data={{
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                  {
                    label: 'Weekly Sales (₹)',
                    data: [42000, 58000, 51000, 67000, 73000, 89000, 95000],
                    borderColor: '#00B4D8',
                    backgroundColor: 'rgba(0,180,216,0.1)',
                    pointBackgroundColor: '#00B4D8',
                    pointBorderColor: '#fff',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    borderWidth: 2.5,
                    fill: true,
                    tension: 0.4,
                  },
                  {
                    label: 'Target',
                    data: [50000, 55000, 60000, 65000, 70000, 75000, 80000],
                    borderColor: 'rgba(244,162,97,0.5)',
                    borderDash: [6, 4],
                    pointRadius: 0,
                    borderWidth: 1.5,
                    fill: false,
                    tension: 0.4,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 1500, easing: 'easeOutQuart' },
                plugins: {
                  legend: {
                    display: true,
                    position: 'top',
                    labels: { color: '#B8D9F0', boxWidth: 12, font: { family: "'Exo 2', sans-serif", size: 11 } },
                  },
                  tooltip: {
                    callbacks: { label: (ctx) => '₹ ' + (ctx.parsed.y ?? 0).toLocaleString() },
                  },
                },
                scales: {
                  x: {
                    ticks: { color: '#B8D9F0', font: { family: "'Exo 2', sans-serif", size: 11 } },
                    grid: { color: 'rgba(184,217,240,0.07)' },
                  },
                  y: {
                    ticks: {
                      color: '#B8D9F0',
                      font: { family: "'Exo 2', sans-serif", size: 11 },
                      callback: (v) => '₹' + Number(v).toLocaleString(),
                    },
                    grid: { color: 'rgba(184,217,240,0.07)' },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Mini Charts Row */}
        <div className="login-chart-row">
          {/* Category Sales */}
          <div className={`login-mini-chart-card ${loaded ? 'login-chart-enter login-chart-enter-d1' : 'opacity-0'}`}>
            <h4>📦 Category Sales</h4>
            <div className="relative" style={{ height: '100px' }}>
              <Pie
                data={{
                  labels: ['Groceries', 'Electronics', 'Clothing', 'FMCG', 'Others'],
                  datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: ['#00B4D8', '#2D5BA3', '#06D6A0', '#F4A261', '#B8D9F0'],
                    borderColor: 'rgba(20,32,53,0.9)',
                    borderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: { duration: 1500 },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                      labels: { color: '#B8D9F0', boxWidth: 10, font: { size: 9, family: "'Exo 2', sans-serif" } },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Payment Modes */}
          <div className={`login-mini-chart-card ${loaded ? 'login-chart-enter login-chart-enter-d2' : 'opacity-0'}`}>
            <h4>💳 Payment Modes</h4>
            <div className="relative" style={{ height: '100px' }}>
              <Doughnut
                data={{
                  labels: ['Cash', 'UPI', 'Card', 'Credit'],
                  datasets: [{
                    data: [45, 30, 18, 7],
                    backgroundColor: ['#06D6A0', '#00B4D8', '#2D5BA3', '#F4A261'],
                    borderColor: 'rgba(20,32,53,0.9)',
                    borderWidth: 2,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: '65%',
                  animation: { duration: 1500 },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'right',
                      labels: { color: '#B8D9F0', boxWidth: 10, font: { size: 9, family: "'Exo 2', sans-serif" } },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* KPI Stat Pills */}
        <div className="login-stat-pills">
          {[
            { icon: '🏪', value: '—', label: 'Stores Live', delay: '0.8s' },
            { icon: '🧾', value: '—', label: "Today's Bills", delay: '0.95s' },
            { icon: '📈', value: '—', label: "Today's Sales", delay: '1.1s' },
            { icon: '🔄', value: 'SAP B1', label: 'Integrated', delay: '1.25s' },
          ].map(({ icon, value, label, delay }) => (
            <div key={label} className={`login-stat-pill ${loaded ? 'login-stat-enter' : 'opacity-0'}`}
              style={{ animationDelay: delay }}>
              <span className="text-[22px]">{icon}</span>
              <div className="flex flex-col gap-px">
                <span className="text-lg font-extrabold" style={{ color: '#E8F4FD', fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.8px]" style={{ color: '#B8D9F0' }}>{label}</span>
              </div>
            </div>
          ))}
        </div>


      </div>

      {/* RIGHT: Login Form Panel */}
      <div className={`login-right-panel ${loaded ? 'login-chart-enter' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
        {/* SAP stripe */}
        <div className="login-sap-stripe" />

        {/* Brand */}
        <div className="flex flex-col items-center gap-3.5 mb-8">
          <div className="w-[68px] h-[68px] rounded-[18px] flex items-center justify-center text-[32px] relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1E3A6E, #2D5BA3, #00B4D)', boxShadow: '0 8px 32px rgba(0,180,216,0.35)' }}>
            💎
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
          </div>
          <div className="text-center">
            <div className="text-[28px] font-black" style={{
              background: 'linear-gradient(135deg, #E8F4FD 0%, #00B4D8 50%, #2D5BA3 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              <span>sapphire</span> POS
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[2px]" style={{ color: '#B8D9F0', opacity: 0.7 }}>
              Enterprise Retail Management
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <h3 className="text-xl font-bold mb-1.5" style={{ color: '#E8F4FD' }}>Welcome Back</h3>
          <p className="text-[13px] mb-6" style={{ color: '#B8D9F0', opacity: 0.7 }}>
            Sign in to your account • Press <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>Enter ↵</kbd> to login
          </p>
          <LoginForm />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default LoginPage
