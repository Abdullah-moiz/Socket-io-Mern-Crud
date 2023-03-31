
import { useEffect, useState } from "react";
import { io } from "socket.io-client";



const socket = io("http://localhost:5000")
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
      <form className="flex flex-col mb-4 " onSubmit={sendMessage}>
        <input className="mb-4" placeholder="name" onChange={(e) => setMessage({ ...message, name: e.target.value })} type="text" />
        <input className="mb-4" placeholder="email" onChange={(e) => setMessage({ ...message, email: e.target.value })} type="text" />
        <button type="submit" className="border-2 text-white  py-2 px-4 uppercase">send</button>
      </form>

      {
        received.map((item) => {
          return (
            <di className="py-4 px-4 text-white mb-4 " key={item._id}>
              <p>ID : {item._id}</p>
              <p>Name: {item.name}</p>
              <p>Email : {item.email}</p>
              <button className="border-2 text-white mt-4 py-2 px-4 uppercase" onClick={() => deleteData(item._id)}>delete</button>
            </di>
          )
        })
      }
    </div>
  )
}

export default App
