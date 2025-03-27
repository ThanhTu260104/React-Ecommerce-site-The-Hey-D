import { ISanPham } from "../../../components/user/data/Data";
import Show1Product from "../../../components/user/layout/Show1Product";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const tu_khoa = searchParams.tu_khoa || "";
  const page = Number(searchParams.page) || 1;

  if (!tu_khoa) {
    return (
      <div className="container mx-auto px-4 pt-24 pb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Vui lòng nhập từ khóa tìm kiếm
        </h1>
      </div>
    );
  }

  const resProduct = await fetch(
    `http://localhost:3005/api/timkiem/${encodeURIComponent(
      tu_khoa as string
    )}?page=${page}`
  );

  if (!resProduct.ok) {
    throw new Error("Không thể tải sản phẩm");
  }
  const product_arr = await resProduct.json();
  const product_list: ISanPham[] = product_arr as ISanPham[];

  console.log("Từ khóa tìm kiếm:", tu_khoa);
  console.log("Trang số:", page);
  console.log("Kết quả tìm kiếm:", product_list);

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Kết quả tìm kiếm cho: &quot;{tu_khoa}&quot;
        </h1>
        <p className="text-gray-600 mt-2">
          Tìm thấy {product_list.length} sản phẩm
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {product_list.map((item) => (
          <Show1Product key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
