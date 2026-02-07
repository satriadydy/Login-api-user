import fetch from "node-fetch";

export default async function handler(req, res) {
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
      message: "storeId, nik, password wajib diisi"
    });
  }

  // encode password (REAL seperti API pusat)
  const passwordBase64 = Buffer.from(password).toString("base64");

  const body = {
    timeTx: new Date().toLocaleTimeString("id-ID", { hour12: false }),
    userId: nik,
    storeId: storeId,
    password: passwordBase64,
    storeDate: new Date().toLocaleDateString("id-ID")
  };

  try {
    const response = await fetch(
      "https://app.alfastore.co.id/prd/api/sis/login/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "App-Name": "PROIN-PDA",
          "Version-App": "2025.08.25",
          "Store-Id": storeId,
          "Branch-Id": "PZ01",
          "Api-Key": "iVOZX9MLmKrj1L8R23uF1aryMR1vGMXG",
          "Platform": "ANDROID"
        },
        body: JSON.stringify(body)
      }
    );

    const data = await response.json();

    // ❌ LOGIN DITOLAK PUSAT
    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: "Login ditolak API pusat",
        raw: data
      });
    }

    // ✅ LOGIN BERHASIL (REAL)
    return res.status(200).json({
      success: true,
      user: {
        nik: data.user.userId,
        name: data.user.name,
        roleLevel: data.user.secLevel
      },
      store: {
        storeId: data.store.storeId,
        storeName: data.store.storeName,
        address: data.store.header5,
        dcId: data.store.dcId
      },
      raw: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gagal konek ke API pusat",
      error: err.message
    });
  }
}
