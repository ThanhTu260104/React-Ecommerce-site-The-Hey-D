import { ITinTuc } from "@/components/user/data/Data";
import Image from "next/image";
export default async function NewsDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const news = await fetch(`http://localhost:3005/api/tintuc/${id}`);
  const newsData: ITinTuc = await news.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          {newsData.tieu_de}
        </h1>

        {/* Ảnh đại diện nếu có */}
        {newsData.hinh && (
          <div className="mb-6">
            <Image
              src={`${newsData.hinh}`}
              alt={newsData.tieu_de}
              className="w-full h-auto rounded-lg shadow-lg"
              width={1000}
              height={1000}
            />
          </div>
        )}

        {/* Thông tin bài viết */}
        <div className="flex justify-between items-center text-gray-600 mb-6 border-b pb-4">
          <div>
            Ngày đăng: {new Date(newsData.ngay).toLocaleDateString("vi-VN")}
          </div>
          <div>Lượt xem: {newsData.luot_xem}</div>
        </div>

        {/* Mô tả */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
          <p className="text-gray-700 italic text-lg">{newsData.mo_ta}</p>
        </div>

        {/* Nội dung chính */}
        <div className="prose max-w-none">
          <div
            className="news-content"
            dangerouslySetInnerHTML={{ __html: newsData.noi_dung }}
          />
        </div>
      </article>
    </div>
  );
}
