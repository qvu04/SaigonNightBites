const COMMENT_TEMPLATES = [
  'Đồ ăn ở {name} ngon thật sự nhưng giá hơi chát so với sinh viên như mình 😅',
  'Ngon vãi lúa, quẩy tới bến luôn 🔥🔥',
  'Phục vụ như hạch, đợi 30 phút mới có món, chắc không quay lại nữa.',
  '5 sao cho {name} luôn, xịn xò từ không gian đến đồ ăn.',
  'Chỗ để xe hơi chật, gửi xe xong lại quên mất chỗ để 😂',
  'Đi ăn sinh nhật đứa bạn ở {name}, mọi người đều vui vẻ.',
  'Bún ở đây đậm đà, nước lèo ngọt thanh, không bị ngấy.',
  'Nhân viên hơi cộc, hỏi gì cũng trả lời nhát gừng.',
  'Không gian máy lạnh mát rượi, ngồi làm việc cả buổi chiều cũng được.',
  'Ngon hơn hẳn quán bên cạnh, nhưng hơi xa chỗ mình ở.',
  'Tệ. Không quay lại nữa.',
  'Order online giao thiếu món, gọi hotline không ai nghe máy.',
  'Buổi tối cuối tuần đông kinh khủng, phải xếp hàng cả 20 phút.',
  'Mình thấy bình thường, không có gì đặc sắc lắm so với giá tiền.',
  'Trẻ con nhà mình mê món này lắm, đi hoài không chán.',
  'Vệ sinh nhà vệ sinh hơi kém, cần cải thiện.',
  'Ai chưa ăn thử {name} thì nên đi 1 lần cho biết, must-try luôn.',
  'Giá cả phải chăng, hợp túi tiền sinh viên.',
  'Cho mình hỏi quán có ship không ạ?',
  'Follow fanpage mình để nhận ưu đãi nha mọi người 🎉',
];

const SAMPLE_SIZE = 10;

// Bình luận giả để test pipeline AI phân tích ưu/nhược điểm — tắt hẳn ở production, thay bằng review thật khi tích hợp Google Places/Foursquare
export function getMockComments(placeName: string): string[] {
  if (process.env.NODE_ENV === 'production') return [];

  return [...COMMENT_TEMPLATES]
    .sort(() => Math.random() - 0.5)
    .slice(0, SAMPLE_SIZE)
    .map((t) => t.replace('{name}', placeName));
}
