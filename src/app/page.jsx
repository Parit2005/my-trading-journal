'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import DashboardStats from '../components/DashboardStats';
import EquityChart from '../components/EquityChart';
import TradeForm from '../components/TradeForm';
import TradeHistory from '../components/TradeHistory';

export default function Dashboard() {
  const [trades, setTrades] = useState([]);
  const [initialBalance, setInitialBalance] = useState(1000); // กำหนดทุนเริ่มต้นจำลองที่ $1000

  // ฟังก์ชันดึงข้อมูลจากฐานข้อมูล
  const fetchTrades = async () => {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setTrades(data);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Trading Journal Dashboard</h1>
        
        {/* ส่วนแสดงสถิติ */}
        <DashboardStats trades={trades} initialBalance={initialBalance} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ส่วนกราฟ (ซ้าย 2 ส่วน) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-4">การเติบโตของพอร์ต (Equity Curve)</h2>
            <EquityChart trades={trades} initialBalance={initialBalance} />
          </div>

          {/* ส่วนฟอร์มเพิ่มการเทรด (ขวา 1 ส่วน) */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <TradeForm onTradeAdded={fetchTrades} />
          </div>
        </div>

        {/* ส่วนตารางประวัติ */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <TradeHistory trades={trades} />
        </div>
      </div>
    </div>
  );
}