import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EquityChart({ trades, initialBalance }) {
  // คำนวณยอดพอร์ตสะสมในแต่ละไม้
  let runningEquity = initialBalance;
  const chartData = trades.map((trade, index) => {
    runningEquity += Number(trade.pnl);
    return {
      name: `Trade ${index + 1}`,
      equity: runningEquity,
      asset: trade.asset
    };
  });

  // เพิ่มจุดเริ่มต้นของพอร์ต
  const fullData = [{ name: 'Start', equity: initialBalance }, ...chartData];

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={fullData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <YAxis domain={['auto', 'auto']} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
          <Tooltip 
            formatter={(value) => [`$${value}`, 'ยอดพอร์ต']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}