export default function DashboardStats({ trades, initialBalance }) {
    const totalTrades = trades.length;
    const wins = trades.filter(t => t.result === 'Win').length;
    const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(2) : 0;
    
    const totalPnl = trades.reduce((sum, trade) => sum + Number(trade.pnl), 0);
    const currentEquity = initialBalance + totalPnl;
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 font-medium">ทุนเริ่มต้น</p>
          <p className="text-2xl font-bold">${initialBalance.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500 font-medium">ยอดพอร์ตปัจจุบัน</p>
          <p className="text-2xl font-bold">${currentEquity.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500 font-medium">อัตราการชนะ (Win Rate)</p>
          <p className="text-2xl font-bold">{winRate}%</p>
        </div>
        <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${totalPnl >= 0 ? 'border-green-500' : 'border-red-500'}`}>
          <p className="text-sm text-gray-500 font-medium">กำไร/ขาดทุน สุทธิ</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }