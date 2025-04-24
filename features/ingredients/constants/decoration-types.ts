/**
 * Các loại trang trí bánh với việt hóa tương ứng
 */

export const CAKE_DECORATION_TYPES = {
  // Các loại trang trí chính
  OuterIcing: "Phủ Kem Ngoài",
  Sprinkles: "Hạt Rắc",
  Decoration: "Trang Trí",
  Bling: "Đồ Trang Trí Lấp Lánh",
  TallSkirt: "Váy Bánh Cao",
  Drip: "Sốt Chảy Tràn",
  ShortSkirt: "Váy Bánh Ngắn",

  // Có thể thêm các loại khác nếu cần
} as const;

/**
 * Hàm lấy tên việt hóa của loại trang trí
 */
export function getDecorationTypeDisplayName(type: string): string {
  return (CAKE_DECORATION_TYPES as Record<string, string>)[type] || type;
}

/**
 * Mặc định các loại trang trí cần khởi tạo cho bakery mới
 */
export const DEFAULT_DECORATION_TYPES = [
  "OuterIcing",
  "Sprinkles",
  "Decoration",
  "Bling",
  "TallSkirt",
  "Drip",
  "ShortSkirt",
];

/**
 * Thông tin mẫu cho mỗi loại trang trí
 */
export const DECORATION_TYPE_SAMPLES = {
  OuterIcing: [
    { name: "Kem bơ truyền thống", color: "#F5F0D6", price: 50000 },
    { name: "Kem phô mai", color: "#FFF8E1", price: 60000 },
    { name: "Kem tươi", color: "#FFFFFF", price: 70000 },
    { name: "Kem matcha", color: "#78C850", price: 65000 },
    { name: "Kem chocolate", color: "#7B3F00", price: 55000 },
  ],
  Sprinkles: [
    { name: "Hạt màu sắc", color: "#FF90C9", price: 20000 },
    { name: "Hạt đường ngũ sắc", color: "#B1FC7C", price: 15000 },
    { name: "Hạt socola", color: "#7B5539", price: 25000 },
  ],
  Decoration: [
    { name: "Hoa kem tươi", color: "#FF90BB", price: 40000 },
    { name: "Trái cây", color: "#FFB997", price: 50000 },
    { name: "Socola mảnh", color: "#7B5539", price: 35000 },
  ],
  Bling: [
    { name: "Kim tuyến thực phẩm", color: "#FFD700", price: 30000 },
    { name: "Ngọc trai thực phẩm", color: "#FFFFFF", price: 35000 },
    { name: "Đá đường lấp lánh", color: "#C6E2FF", price: 25000 },
  ],
  TallSkirt: [
    { name: "Váy xòe cao", color: "#FFCCFF", price: 45000 },
    { name: "Váy gân sóng", color: "#97C1FC", price: 50000 },
    { name: "Váy đứng dáng", color: "#FFB997", price: 55000 },
  ],
  Drip: [
    { name: "Sốt socola đen", color: "#3A2213", price: 30000 },
    { name: "Sốt caramel", color: "#C69647", price: 35000 },
    { name: "Sốt trái cây", color: "#FF7F7F", price: 40000 },
  ],
  ShortSkirt: [
    { name: "Váy ngắn đơn giản", color: "#BAFC7C", price: 30000 },
    { name: "Váy ngắn xếp ly", color: "#FFA5E0", price: 35000 },
    { name: "Váy ngắn nhún", color: "#97D5FC", price: 40000 },
  ],
};
