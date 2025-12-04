export default function Users() {
    const users = [
      { id: 1, name: "Sumaiya", email: "sumaiya@gmail.com" },
      { id: 2, name: "Afrin", email: "afrin@gmail.com" },
    ];
  
    return (
      <>
        <h2 className="text-2xl font-bold mb-4">Users List</h2>
  
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  }
  