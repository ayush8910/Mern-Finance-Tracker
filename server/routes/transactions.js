import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';

router.post('/', auth, async (req, res) => {
  try {
    const { type, description, amount, date } = req.body;
    if(!type || amount===undefined) return res.status(400).json({ message: 'Missing fields' });
    const tx = new Transaction({ userId: req.user.id, type, description, amount, date: date || Date.now() });
    await tx.save();
    res.json(tx);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      type, dateFrom, dateTo, minAmount, maxAmount,
      sortBy = 'date', sortDir = 'desc',
      page = 1, limit = 10
    } = req.query;

    const q = { userId };

    if (type && (type === 'income' || type === 'expense')) q.type = type;
    if (dateFrom || dateTo) q.date = {};
    if (dateFrom) q.date.$gte = new Date(dateFrom);
    if (dateTo) q.date.$lte = new Date(dateTo);
    if (minAmount || maxAmount) q.amount = {};
    if (minAmount) q.amount.$gte = Number(minAmount);
    if (maxAmount) q.amount.$lte = Number(maxAmount);

    const sort = {};
    const dir = sortDir === 'asc' ? 1 : -1;
    if (['date','amount','type','createdAt'].includes(sortBy)) {
      sort[sortBy === 'date' ? 'date' : sortBy] = dir;
    } else {
      sort['date'] = -1;
    }

    const p = Math.max(1, Number(page));
    const lim = Math.max(1, Math.min(100, Number(limit)));

    const total = await Transaction.countDocuments(q);
    const items = await Transaction.find(q).sort(sort).skip((p-1)*lim).limit(lim).lean();

    res.json({ items, total, page: p, pages: Math.ceil(total/lim) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if(!tx) return res.status(404).json({ message: 'Not found' });
    if(tx.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await tx.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
