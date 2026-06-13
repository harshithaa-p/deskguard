export const initialDesks = [
  // Zone Alpha — rows A & B
  { id:'A-01', row:'A', zone:'alpha', status:'free' },
  { id:'A-02', row:'A', zone:'alpha', status:'free' },
  { id:'A-03', row:'A', zone:'alpha', status:'occupied', studentName:'Rahul Sharma',   checkedInAt: Date.now() - 47*60*1000 },
  { id:'A-04', row:'A', zone:'alpha', status:'away',     studentName:'Priya Nair',     checkedInAt: Date.now() - 30*60*1000, awayAt: Date.now() - 12*60*1000 },
  { id:'A-05', row:'A', zone:'alpha', status:'free' },

  { id:'B-01', row:'B', zone:'alpha', status:'free' },
  { id:'B-02', row:'B', zone:'alpha', status:'occupied', studentName:'Arjun Mehta',    checkedInAt: Date.now() - 22*60*1000 },
  { id:'B-03', row:'B', zone:'alpha', status:'free' },
  { id:'B-04', row:'B', zone:'alpha', status:'free' },
  { id:'B-05', row:'B', zone:'alpha', status:'free' },

  // Zone Beta — rows C & D
  { id:'C-01', row:'C', zone:'beta', status:'free' },
  { id:'C-02', row:'C', zone:'beta', status:'occupied', studentName:'Meera Pillai',    checkedInAt: Date.now() - 8*60*1000 },
  { id:'C-03', row:'C', zone:'beta', status:'free' },
  { id:'C-04', row:'C', zone:'beta', status:'away',     studentName:'Aditya Singh',    checkedInAt: Date.now() - 90*60*1000, awayAt: Date.now() - 25*60*1000 },
  { id:'C-05', row:'C', zone:'beta', status:'free' },

  { id:'D-01', row:'D', zone:'beta', status:'occupied', studentName:'Karan Kapoor',    checkedInAt: Date.now() - 63*60*1000 },
  { id:'D-02', row:'D', zone:'beta', status:'free' },
  { id:'D-03', row:'D', zone:'beta', status:'away',     studentName:'Sneha Reddy',     checkedInAt: Date.now() - 45*60*1000, awayAt: Date.now() - 5*60*1000 },
  { id:'D-04', row:'D', zone:'beta', status:'free' },
  { id:'D-05', row:'D', zone:'beta', status:'free' },

  // Zone Gamma — row E
  { id:'E-01', row:'E', zone:'gamma', status:'free' },
  { id:'E-02', row:'E', zone:'gamma', status:'occupied', studentName:'Vikram Joshi',   checkedInAt: Date.now() - 35*60*1000 },
  { id:'E-03', row:'E', zone:'gamma', status:'free' },
  { id:'E-04', row:'E', zone:'gamma', status:'free' },
  { id:'E-05', row:'E', zone:'gamma', status:'free' },
]