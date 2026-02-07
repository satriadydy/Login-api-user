export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });
  }

  const { storeId, nik, password } = req.body;

  if (!storeId || !nik || !password) {
    return res.status(400).json({
      success: false,
      message: "storeId, nik, dan password wajib diisi"
    });
  }

  // ===============================
  // DATABASE TOKO + DC
  // ===============================
  const stores = [
    {
      storeId: "PB48",
      storeName: "TALANG RIMBO LAMA [TIRO]",
      address: "JL. SUPRAPTO RT.001 RW.003 CURUP TENG",
      dcId: "PZ01"
    },
    {
      storeId: "PB49",
      storeName: "CURUP TENGAH",
      address: "JL. MERDEKA CURUP",
      dcId: "PZ01"
    }
  ];

  // ===============================
  // DATABASE USER
  // ===============================
  const users = [
    {
      nik: "22088181",
      password: "123456",
      name: "SATRIA DWI YANSAH",
      storeId: "PB48"
    }
  ];

  // cek toko
  const store = stores.find(s => s.storeId === storeId);
  if (!store) {
    return res.status(404).json({
      success: false,
      message: "Toko tidak ditemukan"
    });
  }

  // cek user
  const user = users.find(
    u => u.nik === nik && u.password === password && u.storeId === storeId
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "NIK atau password salah"
    });
  }

  // ===============================
  // RESPONSE FINAL
  // ===============================
  return res.status(200).json({
    success: true,
    user: {
      nik: user.nik,
      name: user.name
    },
    store: {
      storeId: store.storeId,
      storeName: store.storeName,
      address: store.address,
      dcId: store.dcId
    }
  });
}
