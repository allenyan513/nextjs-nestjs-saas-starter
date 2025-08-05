import {Product} from "@/types";


export default function ProductTableView({data}: { data: Product[] }) {
  return (
    <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <thead className="bg-gray-100">
      <tr>
        <th className="text-left px-4 py-2 border-b border-gray-300 font-semibold">No.</th>
        <th className="text-left px-4 py-2 border-b border-gray-300 font-semibold">Name</th>
        <th className="text-left px-4 py-2 border-b border-gray-300 font-semibold">Description</th>
      </tr>
      </thead>
      <tbody>
      {data.map((item: any, index: number) => (
        <tr
          key={item.id}
          className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
        >
          <td className="px-4 py-2 border-b border-gray-300">{index + 1}</td>
          <td className="px-4 py-2 border-b border-gray-300 font-medium text-blue-600">
            {item.name}
          </td>
          <td className="px-4 py-2 border-b border-gray-300 text-gray-600">{item.description}</td>
        </tr>
      ))}
      </tbody>
    </table>
  )
}
