const midtransClient = require('midtrans-client');

let snap = new midtransClient.Snap({
  isProduction: false, // gunakan true jika sudah production
  serverKey: 'SB-Mid-server-50-ZZDIVRWf27e28Xa0gQSFh'
});

const checkout = async (req, res) => {
  try {
    const { items, nama, email, phone, alamat } = req.body;

    // Total dari frontend
    const totalHarga = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const parameter = {
      transaction_details: {
        order_id: 'ORDER-' + Date.now(),
        gross_amount: totalHarga
      },
      customer_details: {
        first_name: nama,
        email: email,
        phone: phone,
        address: alamat
      },
      item_details: items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.nama
      }))
    };

    const transaction = await snap.createTransaction(parameter);
    res.json({ token: transaction.token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Checkout gagal' });
  }
};

module.exports = checkout;
