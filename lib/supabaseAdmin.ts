const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

function config() {
  if (!url || !secretKey) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY in Vercel.");
  }
  return { url: url.replace(/\/$/, ""), secretKey };
}

export async function supabaseInsertOrder(row: Record<string, unknown>) {
  const { url, secretKey } = config();
  const response = await fetch(`${url}/rest/v1/orders`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase insert failed (${response.status}): ${text.slice(0, 500)}`);
  }
  const data = await response.json().catch(() => []);
  return Array.isArray(data) ? data[0] : data;
}


export async function supabaseUpsertOrder(row: Record<string, unknown>) {
  const { url, secretKey } = config();
  const response = await fetch(`${url}/rest/v1/orders?on_conflict=razorpay_order_id`, {
    method: "POST",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase upsert failed (${response.status}): ${text.slice(0, 500)}`);
  }
  const data = await response.json().catch(() => []);
  return Array.isArray(data) ? data[0] : data;
}

export async function supabaseUpdateOrderByRazorpayOrderId(razorpayOrderId: string, patch: Record<string, unknown>) {
  const { url, secretKey } = config();
  const response = await fetch(`${url}/rest/v1/orders?razorpay_order_id=eq.${encodeURIComponent(razorpayOrderId)}`, {
    method: "PATCH",
    headers: {
      apikey: secretKey,
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase update failed (${response.status}): ${text.slice(0, 500)}`);
  }
  const data = await response.json().catch(() => []);
  return Array.isArray(data) ? data[0] : data;
}

export async function supabaseGetOrders(limit = 100) {
  const { url, secretKey } = config();
  const response = await fetch(`${url}/rest/v1/orders?select=*&order=created_at.desc&limit=${Math.min(Math.max(limit, 1), 100)}`, {
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` },
    cache: "no-store",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase read failed (${response.status}): ${text.slice(0, 500)}`);
  }
  return response.json();
}
