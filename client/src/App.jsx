
import { useEffect, useState } from "react";
import { io } from "socket.io-client";



const socket = io("http://localhost:5001")
function App() {
  const [message, setMessage] = useState({ name: "", email: "" })
  const [received, setReceived] = useState([])

  const sendMessage = (e) => {
    e.preventDefault()
    socket.emit("message", message)
  }

  useEffect(() => {
    socket.emit("getMessages");
    socket.on("getMessages", (data) => {
      setReceived(data);
    });
    socket.on("message", (data) => {
      setReceived((prevMessages) => [...prevMessages, data]);
    });
    socket.on("delete", (data) => {
      setReceived(data);
    });

    return () => {
      socket.off("getMessages");
      socket.off("message");
      socket.off("delete");
    };
  }, [socket]);


  const deleteData = (id) => {
    socket.emit("delete", id)

    socket.on('delete', (data) => {
      setReceived(data)
    })
  }


  return (
    <div className="w-full py-4  flex flex-col items-center justify-center bg-indigo-600 ">
      <form className="flex flex-col " onSubmit={sendMessage}>
        <input className="mb-4" onChange={(e) => setMessage({ ...message, name: e.target.value })} type="text" />
        <input className="mb-4" onChange={(e) => setMessage({ ...message, email: e.target.value })} type="text" />
        <button type="submit">send</button>
      </form>

      {
        received.map((item) => {
          return (
            <div key={item._id}>
              <p>{item.name}</p>
              <p>{item._id}</p>
              <p>{item.email}</p>
              <button onClick={() => deleteData(item._id)}>delete</button>
            </div>
          )
        })
      }
    </div>
  )
}

export default App
