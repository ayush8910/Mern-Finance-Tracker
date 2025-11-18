import React, {useEffect, useState} from 'react';
import API from '../api.jsx';

export default function Home(){
  const [form, setForm] = useState({type:'income', description:'', amount:''});
  const [txs, setTxs] = useState([]);
  const [filters, setFilters] = useState({
    page:1, limit:10, type:'all', dateFrom:'', dateTo:'', minAmount:'', maxAmount:'', sortBy:'date', sortDir:'desc'
  });
  const [meta, setMeta] = useState({total:0, pages:0, page:1});

  async function load(){
    try{
      const q = new URLSearchParams(filters).toString();
      const res = await API.get('/tx?'+q);
      setTxs(res.data.items);
      setMeta({ total: res.data.total, pages: res.data.pages, page: res.data.page });
    }catch(err){
      console.error(err);
      if(err.response?.status === 401){
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    }
  }

  useEffect(()=>{ load(); }, [filters]);

  async function add(e){
    e.preventDefault();
    try{
      await API.post('/tx', { ...form, amount: Number(form.amount) });
      setForm({type:'income', description:'', amount:''});
      setFilters({...filters, page:1}); 
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  }

  async function del(id){
    if(!confirm('Delete transaction?')) return;
    try{
      await API.delete('/tx/'+id);
      setFilters({...filters}); 
    }catch(err){
      alert(err.response?.data?.message || err.message);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2>Finance Tracker</h2>

      <form onSubmit={add} className="tx-form">
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input 
          className="border px-2 py-1 rounded w-full"  
          placeholder="Description"
          value={form.description}
          onChange={e=>setForm({...form,description:e.target.value})}
        />

        <input 
          className="border px-2 py-1 rounded w-full"  
          placeholder="Amount"
          value={form.amount}
          onChange={e=>setForm({...form,amount:e.target.value})}
        />

        <button className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
      </form>

      <hr/>

      <h3 className="text-xl font-bold my-3">Filters</h3>

      <div className="flex flex-wrap gap-2 items-center bg-white shadow p-3 rounded-lg">

  <select 
    value={filters.type} 
    onChange={e => setFilters({...filters, type: e.target.value})}
    className="border px-2 py-1 rounded"
  >
    <option value="all">All</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

  <input
    type="number"
    placeholder="Min Amount"
    value={filters.minAmount}
    onChange={e => setFilters({...filters, minAmount: e.target.value})}
    className="border px-2 py-1 rounded"
  />

  <input
    type="number"
    placeholder="Max Amount"
    value={filters.maxAmount}
    onChange={e => setFilters({...filters, maxAmount: e.target.value})}
    className="border px-2 py-1 rounded"
  />

  <input
    type="date"
    value={filters.dateFrom}
    onChange={e => setFilters({...filters, dateFrom: e.target.value})}
    className="border px-2 py-1 rounded"
  />

  <input
    type="date"
    value={filters.dateTo}
    onChange={e => setFilters({...filters, dateTo: e.target.value})}
    className="border px-2 py-1 rounded"
  />

  <select 
    value={filters.sortBy} 
    onChange={e => setFilters({...filters, sortBy: e.target.value})}
    className="border px-2 py-1 rounded"
  >
    <option value="date">Date</option>
    <option value="amount">Amount</option>
    <option value="type">Type</option>
  </select>

  <select 
    value={filters.sortDir} 
    onChange={e => setFilters({...filters, sortDir: e.target.value})}
    className="border px-2 py-1 rounded"
  >
    <option value="desc">Desc</option>
    <option value="asc">Asc</option>
  </select>

</div>


      <h3 className="text-xl font-bold mt-6 mb-2">Recent Transactions</h3>

      <table className="tx-table">
        <thead>
          <tr>
            <th>Type</th><th>Description</th><th>Amount</th><th>Date</th><th>Action</th>
          </tr>
        </thead>

        <tbody>
          {txs.map(t=> (
            <tr key={t._id}>
              <td>{t.type}</td>
              <td>{t.description}</td>
              <td>{t.amount}</td>
              <td>{new Date(t.date).toLocaleString()}</td>
              <td>
                <button 
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={()=>del(t._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button 
          className="bg-blue-600 text-white px-3 py-1 rounded"
          disabled={meta.page <= 1}
          onClick={()=>setFilters({...filters,page:meta.page-1})}
        >
          Prev
        </button>

        <span>
          Page {meta.page} / {meta.pages || 1} (Total: {meta.total})
        </span>

        <button 
          className="bg-blue-600 text-white px-3 py-1 rounded"
          disabled={meta.page >= meta.pages}
          onClick={()=>setFilters({...filters,page:meta.page+1})}
        >
          Next
        </button>
      </div>
    </div>
  );
}