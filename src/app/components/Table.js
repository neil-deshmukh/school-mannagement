export default function Table({cols, renderRow, data}) {
  return (
    <table className="w-full mt-4">
      {data[0] ? (
        <>
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              {cols.map((col) => (
                <th key={col.accessor} className={col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{data.map((item) => renderRow(item))}</tbody>
        </>
      ) : (
        "None"
      )}
    </table>
  );
}
