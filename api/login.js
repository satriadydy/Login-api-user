export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { storeId, nik, password } = req.body;

  if (!storeId || !nik || !password) {
    return res.status(400).json({
      message: "storeId, nik, dan password wajib diisi"
    });
  }

  const passwordBase64 = Buffer.from(password).toString("base64");

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
          "Api-Key": "iVOZX9MLmKrj1L8R23uF1aryMR1vGMXG",
          "AndroidId": "0d1e7855159dfdc0",
          "Branch-Id": "PZ01",
          "Platform": "ANDROID",
          "User-Agent": "Dalvik/2.1.0"
        },
        body: JSON.stringify({
          timeTx: new Date().toLocaleTimeString("id-ID"),
          userId: nik,
          storeId: storeId,
          password: passwordBase64,
          storeDate: new Date().toLocaleDateString("id-ID")
        })
      }
    );

    if (!response.ok) {
      return res.status(401).json({
        success: false,
        message: "Login gagal (user / password salah)"
      });
    }

    const data = await response.json();

    return res.status(200).json({
      success: true,
      user: {
        nik: data.user.userId,
        name: data.user.name
      },
      store: {
        storeId: data.store.storeId,
        storeName: data.store.storeName,
        address: data.store.header5,
        dcId: data.store.dcId
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Gagal konek ke API pusat",
      error: err.message
    });
  }
}
