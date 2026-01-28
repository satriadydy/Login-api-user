import stores from "../data/stores.json";
import users from "../data/users.json";

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

  // 🔍 CEK TOKO
  const store = stores.find(s => s.storeId === storeId);
  if (!store) {
    return res.status(404).json({
      success: false,
      message: "Kode toko tidak terdaftar"
    });
  }

  // 🔍 CEK USER
  const user = users.find(
    u =>
      u.nik === nik &&
      u.password === password &&
      u.storeId === storeId
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "NIK atau password salah"
    });
  }

  // ✅ LOGIN BERHASIL
  return res.status(200).json({
    success: true,
    user: {
      nik: user.nik,
      name: user.name
    },
    store: {
      storeId: store.storeId,
      storeName: store.storeName,
      address: store.address
    }
  });
}
