import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [lembarKerjaBelumSelesai, setLembarKerjaBelumSelesai] = useState([]);

  useEffect(() => {
    fetchClients();
    fetchLembarKerja();
  }, []);

  /* ---------- DATA ---------- */
  const fetchClients = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/clients");
      const sorted = [...data].sort(
        (a, b) => new Date(b.tglMasuk) - new Date(a.tglMasuk)
      );
      setClients(data);
      setRecentClients(sorted.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchLembarKerja = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/admin/LembarKerja"
      );
      const belumSelesai = data
        .filter((l) => l.status !== "Selesai")
        .slice(0, 45);
      setLembarKerjaBelumSelesai(belumSelesai);
    } catch (err) {
      console.error("Failed to fetch lembar kerja:", err);
    }
  };

  /* ---------- HITUNG STAT ---------- */
  const totalClients = clients.length;
  const completed = clients.filter((c) => c.status === "Selesai").length;
  const ongoing = clients.filter((c) => c.status === "On-Going").length;
  const canceled = clients.filter((c) => c.status === "Cancel").length;

  /* ---------- RENDER ---------- */
  return (
    <div className="container mx-auto px-4 py-8 text-black min-h-screen">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </header>

      {/* Kartu ringkasan client */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Client" value={totalClients} />
        <StatCard title="Selesai" value={completed} bg="bg-green-200" />
        <StatCard title="On‑Going" value={ongoing} bg="bg-yellow-200" />
        <StatCard title="Cancel" value={canceled} bg="bg-red-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Client terbaru */}
        <div className="bg-white rounded-md p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Client Terbaru</h2>
          <HeaderRow labels={["Nama", "Tanggal Bergabung"]} />
          <ul className="space-y-2 mt-2">
            {recentClients.map((c, i) => (
              <ListRow
                key={i}
                cols={[
                  <span className="font-bold">{c.nama}</span>,
                  <span className="text-sm text-gray-500">
                    {new Date(c.tglMasuk).toLocaleDateString()}
                  </span>,
                ]}
              />
            ))}
          </ul>
        </div>

        {/* Lembar kerja belum selesai */}
        <div className="bg-white rounded-md p-4 shadow-md">
          <h2 className="text-lg font-bold mb-4">Lembar Kerja Belum Selesai</h2>
          <HeaderRow labels={["Kepemilikan", "Kategori", "Status"]} />
          <ul className="space-y-2 mt-2">
            {lembarKerjaBelumSelesai.map((l, i) => (
              <ListRow
                key={i}
                cols={[
                  <span className="font-bold">{l.kepemilikan}</span>,
                  <span className="text-sm text-gray-500">{l.kategori}</span>,
                  <span className="text-sm text-gray-500">{l.status}</span>,
                ]}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

/* ---------- KOMponen kecil ---------- */
const StatCard = ({ title, value, bg = "bg-white" }) => (
  <div className={`${bg} rounded-md p-4 shadow-md`}>
    <h3 className="text-sm font-bold">{title}</h3>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const HeaderRow = ({ labels }) => (
  <div className="p-2 rounded-md shadow-sm flex justify-between items-center font-bold">
    {labels.map((l, i) => (
      <span key={i}>{l}</span>
    ))}
  </div>
);

const ListRow = ({ cols }) => (
  <li className="bg-gray-100 p-2 rounded-md shadow-sm flex justify-between items-center">
    {cols.map((c, i) => (
      <span key={i}>{c}</span>
    ))}
  </li>
);

export default Dashboard;
