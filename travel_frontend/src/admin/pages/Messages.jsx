export default function Messages() {
    const messages = [
      { id: 1, name: "John", message: "Need details about Dubai package." },
      { id: 2, name: "Sara", message: "Booking issue, please help." },
    ];
  
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4">Messages</h2>
  
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white p-4 shadow rounded-lg">
              <h3 className="font-semibold">{msg.name}</h3>
              <p className="text-gray-700">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
  