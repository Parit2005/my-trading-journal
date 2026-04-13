import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TradeForm({ onTradeAdded }) {
  const [formData, setFormData] = useState({ asset: '', result: 'Win', pnl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let imageUrl = null;

    try {
      // 1. อัปโหลดรูป (ถ้ามี)
      if (imageFile) {
        const fileExt = imageFile.name ? imageFile.name.split('.').pop() : 'png';
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('journal-images')
          .upload(`trades/${fileName}`, imageFile);
        
        if (!uploadError) {
          const { data } = supabase.storage.from('journal-images').getPublicUrl(`trades/${fileName}`);
          imageUrl = data.publicUrl;
        }
      }

      // 2. บันทึกลงตาราง trades
      const { error } = await supabase.from('trades').insert([{
        asset: formData.asset,
        result: formData.result,
        pnl: Number(formData.pnl),
        image_url: imageUrl
      }]);

      if (!error) {
        setFormData({ asset: '', result: 'Win', pnl: '' });
        setPreviewUrl('');
        setImageFile(null);
        if (onTradeAdded) onTradeAdded(); // รีเฟรชข้อมูลหน้าหลัก
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div onPaste={handlePaste} tabIndex={0} className="outline-none">
      <h2 className="text-xl font-semibold mb-4">บันทึกออร์เดอร์ใหม่</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">คู่เงิน / สินทรัพย์</label>
          <input type="text" required value={formData.asset} onChange={e => setFormData({...formData, asset: e.target.value})} className="w-full border p-2 rounded" placeholder="เช่น XAUUSD"/>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">ผลลัพธ์</label>
            <select value={formData.result} onChange={e => setFormData({...formData, result: e.target.value})} className="w-full border p-2 rounded">
              <option value="Win">ชนะ</option>
              <option value="Loss">แพ้</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">P/L ($)</label>
            <input type="number" required value={formData.pnl} onChange={e => setFormData({...formData, pnl: e.target.value})} className="w-full border p-2 rounded" placeholder="50 หรือ -20"/>
          </div>
        </div>
        
        <div className="border-2 border-dashed p-4 text-center rounded bg-gray-50 text-sm text-gray-500">
          {previewUrl ? (
             <img src={previewUrl} alt="Preview" className="max-h-32 mx-auto rounded" />
          ) : (
             <p>กด Ctrl+V เพื่อวางรูปภาพกราฟ</p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 disabled:bg-gray-400">
          {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเทรด'}
        </button>
      </form>
    </div>
  );
}