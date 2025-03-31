import { ITinTuc } from "@/components/user/data/Data";

export default async function NewsPage() {
  // Giả sử chúng ta có một mảng tin tức
  const tinTuc = await fetch("http://localhost:3005/api/tintuc");
  const tinTucData = await tinTuc.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tin Tức</h1>

      <div className="grid gap-6">
        {tinTucData.map((item: ITinTuc) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <a href={`/user/news/${item.id}`}>
              <h2 className="text-xl font-semibold mb-2">{item.tieu_de}</h2>
            </a>
            <p className="text-gray-600 mb-4">{item.mo_ta}</p>
            <div className="text-sm text-gray-500">
              Ngày đăng: {new Date(item.ngay).toLocaleDateString("vi-VN")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
