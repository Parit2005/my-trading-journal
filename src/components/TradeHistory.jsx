export default function TradeHistory({ trades }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">ประวัติการเทรดทั้งหมด</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-3 text-sm font-medium text-gray-600">วันที่</th>
                <th className="p-3 text-sm font-medium text-gray-600">สินทรัพย์</th>
                <th className="p-3 text-sm font-medium text-gray-600">ผลลัพธ์</th>
                <th className="p-3 text-sm font-medium text-gray-600">กำไร/ขาดทุน</th>
                <th className="p-3 text-sm font-medium text-gray-600">รูปภาพ</th>
              </tr>
            </thead>
            <tbody>
              {trades.length === 0 ? (
                <tr><td colSpan="5" className="p-4 text-center text-gray-500">ยังไม่มีข้อมูลการเทรด</td></tr>
              ) : (
                trades.map((trade) => (
                  <tr key={trade.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 text-sm text-gray-700">
                      {new Date(trade.created_at).toLocaleDateString('th-TH')}
                    </td>
                    <td className="p-3 text-sm font-medium">{trade.asset}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${trade.result === 'Win' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trade.result}
                      </span>
                    </td>
                    <td className={`p-3 text-sm font-bold ${Number(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(trade.pnl) >= 0 ? '+' : ''}{trade.pnl}
                    </td>
                    <td className="p-3 text-sm">
                      {trade.image_url ? (
                        <a href={trade.image_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">ดูรูปภาพ</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }