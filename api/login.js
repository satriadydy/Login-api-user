export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const { storeId, nik, password } = req.body;

    if (!storeId || !nik || !password) {
      return res.status(400).json({
        success: false,
        message: "storeId, nik, password wajib diisi"
      });
    }

    // base64 password (WAJIB)
    const passwordBase64 = Buffer.from(password).toString("base64");

    // format tanggal DD/MM/YYYY
    const now = new Date();
    const storeDate =
      String(now.getDate()).padStart(2, "0") +
      "/" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "/" +
      now.getFullYear();

    const payload = {
      timeTx: now.toTimeString().slice(0, 8),
      userId: nik,
      storeId: storeId,
      password: passwordBase64,
      storeDate: storeDate
    };

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
          "Platform": "ANDROID",
          "User-Agent": "Dalvik/2.1.0"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // ❌ DITOLAK API PUSAT
    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: "Login ditolak API pusat",
        raw: data
      });
    }

    // ✅ BERHASIL
    return res.status(200).json({
      success: true,
      user: {
        nik: data.user.userId,
        name: data.user.name,
        level: data.user.secLevel
      },
      store: {
        storeId: data.store.storeId,
        storeName: data.store.storeName,
        dcId: data.store.dcId
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "SERVER ERROR (Function crash)",
      error: err.message
    });
  }
}
