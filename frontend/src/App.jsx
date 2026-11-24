import { useState } from 'react'
import './App.css'

const API = '/api'
const shipments = [
  { Sno: 's2', Pno: 'p3', Qty: 200, Price: 0.006 },
  { Sno: 's4', Pno: 'p2', Qty: 100, Price: 0.005 },
]

// Requests go through the Vite proxy to the existing FastAPI backend.
async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options)
  const data = await response.json().catch(() => null)
  if (!response.ok || !data || data.success === false) {
    throw new Error(typeof data?.detail === 'string' ? data.detail : data?.message || `Request failed (HTTP ${response.status}). Check that FastAPI is running.`)
  }
  return data
}

function SupplierTable({ rows, loaded, emptyMessage }) {
  return <div className="table-wrap"><table>
    <thead><tr><th>Supplier ID</th><th>Supplier name</th><th>Status</th><th>City</th></tr></thead>
    <tbody>{rows.map(s => <tr key={s.Sno}><td><span className="id-tag">{s.Sno}</span></td><td className="supplier-name">{s.Sname}</td><td><span className="status-tag">{s.Status ?? '—'}</span></td><td>{s.City ?? '—'}</td></tr>)}</tbody>
  </table>{rows.length === 0 && <div className="empty"><span className="empty-icon">▤</span>{loaded ? emptyMessage : 'No data loaded yet.'}</div>}</div>
}

function App() {
  const [suppliers, setSuppliers] = useState([])
  const [results, setResults] = useState([])
  const [part, setPart] = useState('')
  const [searchedPart, setSearchedPart] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [messages, setMessages] = useState({})
  const [busy, setBusy] = useState('')
  const [connection, setConnection] = useState('Not checked')

  async function run(key, action) {
    setBusy(key)
    setMessages(prev => ({ ...prev, [key]: null }))
    try {
      const message = await action()
      setMessages(prev => ({ ...prev, [key]: { ok: true, text: message } }))
    } catch (error) {
      setMessages(prev => ({ ...prev, [key]: { ok: false, text: error.message === 'Failed to fetch' ? 'Cannot reach the API. Check that FastAPI and the Vite server are running.' : error.message } }))
    } finally { setBusy('') }
  }

  function clearSearch() {
    setResults([])
    setSearchedPart('')
    setMessages(prev => ({ ...prev, search: null }))
  }

  function checkConnection() {
    run('connection', async () => {
      setConnection('Checking…')
      try {
        const api = await request('/')
        const db = await request('/test-db')
        if (db.status !== 'success') throw new Error('Database check failed.')
        setConnection('Connected')
        return `${api.msg}. MySQL connection successful.`
      } catch (error) {
        setConnection('Check failed')
        throw error
      }
    })
  }

  function changeShipment(number, method) {
    const key = `shipment${number}`
    const action = method === 'POST' ? 'add' : 'delete'
    run(key, async () => {
      const data = await request(`/${action}-shipment${number}`, { method })
      if (data.status !== 'success') throw new Error('Shipment operation failed.')
      clearSearch()
      return method === 'POST' ? 'Shipment inserted successfully.' : 'Shipment deleted successfully.'
    })
  }

  function loadSuppliers() {
    run('suppliers', async () => {
      const data = await request('/get-all-suppliers')
      setSuppliers(data); setLoaded(true)
      return `${data.length} suppliers loaded.`
    })
  }

  function changeStatus(action) {
    run('status', async () => {
      const data = await request(`/${action}-status`, { method: 'PUT' })
      setSuppliers(data); setLoaded(true)
      clearSearch()
      return `Supplier statuses ${action === 'increase' ? 'increased' : 'decreased'} by 10%. Updated records are shown below.`
    })
  }

  function searchSuppliers(event) {
    event.preventDefault()
    const value = part.trim().toLowerCase()
    if (!value) return
    setResults([]); setSearchedPart('')
    run('search', async () => {
      const data = await request(`/search?part_no=${encodeURIComponent(value)}`)
      setResults(data); setSearchedPart(value)
      return `${data.length} matching suppliers found.`
    })
  }

  function notice(key) {
    const message = messages[key]
    return message && <div role="status" className={`notice ${message.ok ? 'success' : 'error'}`}>{message.ok ? '✓ ' : '✕ '}{message.text}</div>
  }

  return <div className="layout">
    <aside className="sidebar">
      <div className="brand"><div className="logo">S</div><div>Supply<span>Desk</span><small>DATABASE WORKSPACE</small></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav><a href="#overview">◫ <span>Overview</span></a><a href="#shipments">▣ <span>Shipments</span></a><a href="#suppliers">▤ <span>Suppliers</span></a><a href="#search">⌕ <span>Part search</span></a></nav>
      <div className="sidebar-bottom"><div className="course-icon">DB</div><div>CSCI 4560 / 5560<small>Homework 05</small></div></div>
    </aside>
    <main id="overview">
      <header className="topbar"><span>Workspace <span className="slash">/</span> Overview</span><span className="environment"><i /> MySQL · FastAPI · {connection}</span></header>
      <div className="content">
        <div className="intro"><div><div className="eyebrow">DATABASE MANAGEMENT SYSTEM</div><h1>Supplier dashboard</h1><p>Manage shipments, update supplier statuses, and explore supplier records.</p></div><span className="assignment">HOMEWORK 05</span></div>
        <div className="connection-bar"><button className="secondary compact" disabled={!!busy} onClick={checkConnection}>{busy === 'connection' ? 'Checking…' : 'Test API & database'}</button>{notice('connection')}</div>
        <div className="metrics"><div><span>Supplier records</span><strong>{loaded ? suppliers.length : '—'}</strong><small>Load records to view total</small></div><div><span>Shipment operations</span><strong>02</strong><small>Required insert operations</small></div><div><span>Status adjustment</span><strong>±10<span>%</span></strong><small>Applied to all suppliers</small></div></div>
        <section id="shipments"><div className="section-heading"><div><h2>Database operations</h2><p>Insert or remove the required shipments and adjust supplier statuses.</p></div><span className="section-number">01 / OPERATIONS</span></div>
          <div className="operations">{shipments.map((shipment, i) => <article className="panel operation" key={i}><div className="operation-top"><div className="tile-icon">↗</div><span className="pill">INSERT / DELETE</span></div><h3>Shipment {i + 1}</h3><p>Add the specified shipment record.</p><dl>{Object.entries(shipment).map(([key,value]) => <div key={key}><dt>{{Sno:'Supplier',Pno:'Part',Qty:'Quantity',Price:'Price'}[key]}</dt><dd>{key === 'Price' ? value.toFixed(3) : value}</dd></div>)}</dl><button disabled={!!busy} onClick={() => changeShipment(i + 1, 'POST')}>Insert shipment <span>→</span></button><button className="danger" disabled={!!busy} onClick={() => changeShipment(i + 1, 'DELETE')}>Delete shipment <span>×</span></button>{busy === `shipment${i + 1}` && <p>Working…</p>}{notice(`shipment${i + 1}`)}</article>)}
          <article className="panel operation"><div className="operation-top"><div className="tile-icon green">↑</div><span className="pill">UPDATE</span></div><h3>Supplier status</h3><p>Adjust the current status of every supplier.</p><div className="increase"><strong>±10%</strong><span>Current status × 1.10 or 0.90</span></div><button className="secondary" disabled={!!busy} onClick={() => changeStatus('increase')}>{busy === 'status' ? 'Updating…' : 'Increase statuses'} <span>↑</span></button><button className="secondary extra-action" disabled={!!busy} onClick={() => changeStatus('decrease')}>Decrease statuses <span>↓</span></button><p className="operation-hint">Decreasing by 10% does not exactly undo an increase.</p>{notice('status')}</article></div>
        </section>
        <section id="suppliers"><div className="section-heading"><div><h2>All suppliers</h2><p>View supplier IDs, names, statuses, and locations.</p></div><button className="compact" disabled={!!busy} onClick={loadSuppliers}>{busy === 'suppliers' ? 'Loading…' : '↻  Load suppliers'}</button></div><div className="panel table-panel"><SupplierTable rows={suppliers} loaded={loaded} emptyMessage="No supplier records found." />{notice('suppliers')}<div className="table-footer">{loaded ? `${suppliers.length} records` : 'Awaiting database query'}<span>SUPPLIER</span></div></div></section>
        <section id="search"><div className="section-heading"><div><h2>Find suppliers by part</h2><p>Find every supplier who has shipped a specific part.</p></div><span className="section-number">03 / QUERY</span></div><div className="panel search-panel"><form onSubmit={searchSuppliers}><label htmlFor="part">Part number</label><div className="search-row"><input id="part" value={part} onChange={e => setPart(e.target.value)} placeholder="e.g. p2" maxLength={2} required pattern="[pP][0-9]"/><button disabled={!!busy}>{busy === 'search' ? 'Searching…' : 'Search suppliers'}</button></div><small>Enter a part ID, such as p1, p2, or p3.</small></form>{notice('search')}{searchedPart && <div className="results-label">Results for <b>{searchedPart}</b></div>}<SupplierTable rows={results} loaded={!!searchedPart} emptyMessage="No suppliers shipped this part." /></div></section>
        <footer>SupplyDesk <span>Supplier · Part · Shipment</span></footer>
      </div>
    </main>
  </div>
}
export default App
