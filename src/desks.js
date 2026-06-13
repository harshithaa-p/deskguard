export const initialDesks = [
  { id: 'A1', row: 'A', status: 'free' },
  { id: 'A2', row: 'A', status: 'free' },
  { id: 'A3', row: 'A', status: 'free' },
  { id: 'A4', row: 'A', status: 'free' },
  { id: 'B1', row: 'B', status: 'free' },
  { id: 'B2', row: 'B', status: 'occupied', studentName: 'Rahul', checkedInAt: Date.now() - 1000 * 60 * 47},
  { id: 'B3', row: 'B', status: 'free' },
  { id: 'B4', row: 'B', status: 'free' },
  { id: 'C1', row: 'C', status: 'free' },
  { id: 'C2', row: 'C', status: 'away', studentName: 'Priya', checkedInAt: Date.now() - 1000 * 60 * 30, awayAt: Date.now() - 1000 * 60 * 12},
  { id: 'C3', row: 'C', status: 'free' },
  { id: 'C4', row: 'C', status: 'free' },
]