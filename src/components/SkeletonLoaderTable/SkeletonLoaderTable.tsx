import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";

const SkeletonLoaderTable = ({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) => {
  return (
    <div className="rounded-md ">
      <table className="table-auto w-full border-collapse">
        <thead>
            <tr className=" " >
                <td colSpan={2}> 
                    <div className="px-4 mb-5">
                    <SkeletonLoader className="h-8 w-full" />
                    </div>
                </td>
            </tr>
          <tr>
            {Array.from({ length: columns }).map((_, columnIndex) => (
              <th key={columnIndex} className="px-4 py-2">
                <SkeletonLoader className="h-8 w-full" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <td key={columnIndex} className="px-4 py-2">
                  <SkeletonLoader className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonLoaderTable;
