# LunaVest API — A React Beginner's Guide

This guide is for the **React (Next.js) frontend**. You will write `fetch()` calls inside your components, and the backend answers with JSON.

You do **not** need Postman to follow along — every example below is code you can paste into a page.

---

## 0. Interactive docs (Swagger UI)

The API also ships with generated Swagger docs:

| What | URL |
|---|---|
| Interactive UI | `https://lunavest-ecormerce.onrender.com/api-docs` |
| Raw OpenAPI spec (JSON) | `https://lunavest-ecormerce.onrender.com/api-docs.json` |

When the backend is deployed, swap `localhost:5000` for the deployed host — for example
`https://lunavest-ecormerce.onrender.com/api-docs`. Send that link to anyone who wants to
explore the API; they can click **Authorize**, paste a JWT from `/auth/login` and use **Try it out**
on every endpoint.

The spec lives in `docs/openapi.js`. If you add or change an endpoint, update that file so the
docs stay accurate.

---

## 1. The big picture

```
Your React component
        │  fetch("http://localhost:5000/products/seeAllproducts")
        ▼
Express API (this folder)  ──►  MySQL database
        │
        ▼
JSON response: { success, message, data }
```

Two separate apps, two separate terminals:

| App | Folder | URL | Command |
|---|---|---|---|
| Backend (API) | `ecormerce-sever` | `http://localhost:5000` | `npm run dev` |
| Frontend (React) | `ecormerce-frontend` | `http://localhost:3000` | `npm run dev` |

If the backend is not running, every request fails with `Failed to fetch`.

---

## 2. Where the API URL comes from

Never type `http://localhost:5000` into every file. Put it in one place.

`ecormerce-frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Then in your components:

```tsx
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
```

Any variable starting with `NEXT_PUBLIC_` is visible in the browser, which is fine for a URL (never put passwords there).

---

## 3. Every response has the same shape

**Success:**

```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": []
}
```

**Failure:**

```json
{
  "success": false,
  "message": "Only 10 left of Classic Denim Jacket"
}
```

So in React you always check `response.ok`, then read `data.message` for a friendly error.

> Prices are in **Nigerian naira (₦)**. Show them like this: `₦{product.price.toLocaleString()}` → `₦42,000`.

---

## 4. Your first request: list products

This is a complete component. Copy it into `app/products-demo/page.tsx` and open `http://localhost:3000/products-demo`.

```tsx
"use client";

import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export default function ProductsDemo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products/seeAllproducts`);
        const result = await response.json(); // read the body ONCE

        if (!response.ok) throw new Error(result.message);

        setProducts(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} — ₦{product.price.toLocaleString()} ({product.stock} left)
        </li>
      ))}
    </ul>
  );
}
```

**The four things every request needs:**

1. `await fetch(url)`
2. `await response.json()`
3. `if (!response.ok) throw new Error(result.message)`
4. `setState(...)` so React re-renders

---

## 5. Register and log in (and keep the token)

Register does **not** return a token — log in right after.

```tsx
"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SignupDemo() {
  const [message, setMessage] = useState("");

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    });

    const result = await response.json();
    setMessage(result.success ? "Account created! Now log in." : result.message);
  };

  return (
    <form onSubmit={handleSignup}>
      <input name="name" placeholder="Full name" />
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      <button type="submit">Sign up</button>
      <p>{message}</p>
    </form>
  );
}
```

Login returns a **token**. Save it — you will send it with every protected request.

```tsx
const response = await fetch(`${API_URL}/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

const result = await response.json();

if (!response.ok) {
  alert(result.message); // "Invalid email or password"
  return;
}

localStorage.setItem("token", result.token);
localStorage.setItem("user", JSON.stringify(result.user));
// result.user = { id, name, email, role }
```

> This project already does this in `context/AuthContext.tsx` (`login(user, token)`), so you normally call `login(data.user, data.token)` instead of touching `localStorage` yourself.

---

## 6. Sending the token on protected routes

Protected endpoints need this header:

```
Authorization: Bearer eyJhbGciOi...
```

The word **Bearer** and one space are required. Missing or expired token → `401`.

This project already has a helper — `lib/api.ts` — and you should reuse it:

```ts
import { apiFetch, apiPost } from "@/lib/api";

const myOrders = await apiFetch<{ success: boolean; data: Order[] }>("/orders/my-orders");
await apiFetch(`/orders/${orderId}/cancel`, { method: "PATCH" });
```

If you want to see how it works (or write your own):

```tsx
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Request failed");
  return result as T;
}
```

Usage:

```tsx
try {
  await apiFetch("/products/like/" + productId, { method: "POST" });
} catch (error) {
  alert(error instanceof Error ? error.message : "Please login first");
}
```

---

## 7. Wishlist (like / unlike)

`POST /products/like/:id` is a **toggle**. Call it once to like, again to unlike.

```tsx
const handleLike = async (productId: string) => {
  const response = await fetch(`${API_URL}/products/like/${productId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const result = await response.json();
  if (!response.ok) return alert(result.message);

  // result.liked === true  -> now liked
  // result.liked === false -> now unliked
  setLiked(result.liked);
};
```

Read the wishlist:

```tsx
const response = await apiFetch<{ success: boolean; data: Product[] }>("/products/liked");
setProducts(response.data);
```

---

## 8. Checkout (place an order)

Send only the product id and quantity. **Do not send the price or total** — the server reads the real price from the database and calculates the total itself.

```tsx
const handleCheckout = async () => {
  try {
    await apiFetch("/orders/checkout", {
      method: "POST",
      body: JSON.stringify({
        items: cart.map((item) => ({
          id: item.id,
          quantity: item.quantity ?? 1,
        })),
      }),
    });

    clearCart(); // from CartContext
    router.push("/orders"); // show the order in "My Orders"
  } catch (error) {
    alert(error instanceof Error ? error.message : "Checkout failed");
  }
};
```

What the server checks for you:

- product still exists
- product is not `inactive`
- enough stock for the quantity
- then it creates the order **and** reduces stock, all or nothing

If stock is short you get `400` with a message like `Only 10 left of Classic Denim Jacket`.

---

## 9. My orders and cancelling

```tsx
const response = await apiFetch<{ success: boolean; data: Order[] }>("/orders/my-orders");
setOrders(response.data);
```

Each order looks like this:

```json
{
  "id": "bb5f8cab-...",
  "totalAmount": 520,
  "status": "pending",
  "createdAt": "2026-10-30T11:26:41.000Z",
  "OrderItems": [
    {
      "id": "a1b2...",
      "quantity": 2,
      "price": 260,
      "Product": { "id": "9e81...", "name": "Smoke Test Product", "image": "https://..." }
    }
  ]
}
```

Status can be `pending`, `paid`, `shipped`, `delivered`, `cancelled`.

Cancel (only `pending` or `paid`):

```tsx
await apiFetch(`/orders/${order.id}/cancel`, { method: "PATCH" });
```

Cancelling puts the stock back automatically. Show the button only when
`order.status === "pending" || order.status === "paid"`.

---

## 10. Admin-only requests

Only an admin token works. A normal user gets `403`, no token gets `401`.

### Add a product (with an image)

File uploads use `FormData`, **not** JSON — and you must **not** set `Content-Type` yourself. The browser adds the correct boundary.

```tsx
const handleAddProduct = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const form = new FormData(event.currentTarget);
  // inputs must have name="name", name="price", name="stock", etc.

  const response = await fetch(`${API_URL}/products/generate_products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // no Content-Type!
    },
    body: form,
  });

  const result = await response.json();
  if (!response.ok) return alert(result.message);

  alert("Product added successfully");
};
```

Required form fields: `name`, `description`, `price`, `stock`, `image` (a `<input type="file" name="image" />`).
Optional: `status` (`available` | `inactive` | `out-of-stock`, default `available`) and `category` (default `Other`).

This project already does it in `app/stock/page.tsx` using `apiFormData`.

### Edit or delete a product

```tsx
// Edit: send only the fields that change (FormData if you also change the image)
await apiFetch(`/products/update/${productId}`, {
  method: "PUT",
  body: JSON.stringify({ price: 39000, stock: 45 }),
});

// Delete
await apiFetch(`/products/deleteProducts/${productId}`, { method: "DELETE" });
```

If the product is already part of an order, delete returns `409`.

### See every order, then move it forward

```tsx
// all orders (optional ?status=pending)
const response = await apiFetch<{ success: boolean; data: Order[] }>("/orders");
setOrders(response.data);

// change status
await apiFetch(`/orders/${orderId}/status`, {
  method: "PATCH",
  body: JSON.stringify({ status: "shipped" }),
});
```

Setting `cancelled` here also restores stock. A delivered or cancelled order cannot be changed again.

---

## 11. Search, category and pagination

Put the values in the URL, then read them in your request:

```tsx
const params = new URLSearchParams();
params.set("search", searchText);
params.set("category", "Fashion");
params.set("page", "1");
params.set("limit", "8");

const response = await apiFetch(`/products/seeAllproducts?${params.toString()}`);
```

The reply includes pagination:

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": { "page": 1, "limit": 8, "total": 9, "totalPages": 2, "hasMore": true }
}
```

Show "Load more" while `pagination.hasMore` is `true`, and request `page + 1`.
In this project, `components/ProductCard.tsx` already does exactly this — and reads `?search=` and `?category=` from the URL that the navbar builds.

---

## 12. Common mistakes (check these first)

| Symptom | Likely cause | Fix |
|---|---|---|
| `Failed to fetch` | Backend not running, or wrong URL | Start `npm run dev` in `ecormerce-sever`; check `NEXT_PUBLIC_API_URL` |
| `401` | No token, or token expired (8 hours) | Log in again, check `Bearer ` prefix |
| `403` | You are logged in but not an admin | Use the admin account |
| `400` | Missing field / bad value / not enough stock | Show `result.message` to the user |
| `Unexpected token '<'` | The response is HTML (404 page), not JSON | Check the URL path spelling |
| `Body is unusable` / `already read` | Called `response.json()` twice | Store it once: `const result = await response.json()` |
| Image upload fails | You set `Content-Type: application/json` on `FormData` | Delete that header |
| `Application error: a client-side exception` | Using `localStorage` during server render | Do it inside `useEffect` or a `"use client"` event handler |
| List does not update | You changed the array instead of setting state | `setProducts([...products, newItem])` |
| CORS error in console | Wrong backend URL / backend not running | It is enabled with `*`; verify the URL |

React state reminder: always give list items a stable `key={product.id}` and never mutate `products.push(...)` directly.

---

## 13. Endpoint cheat sheet

`🔓` = anyone, `🔑` = logged in, `👑` = admin

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | 🔓 | Create an account |
| POST | `/auth/login` | 🔓 | Get a token |
| GET | `/auth/me` | 🔑 | Current user |
| GET | `/products/seeAllproducts` | 🔓 | List + `?search= &category= &page= &limit=` |
| GET | `/products/:id` | 🔓 | One product |
| POST | `/products/generate_products` | 👑 | Add a product (FormData + image) |
| PUT | `/products/update/:id` | 👑 | Edit a product |
| DELETE | `/products/deleteProducts/:id` | 👑 | Delete a product |
| POST | `/products/like/:id` | 🔑 | Like / unlike (toggle) |
| GET | `/products/liked` | 🔑 | My wishlist |
| POST | `/orders/checkout` | 🔑 | Place an order |
| GET | `/orders/my-orders` | 🔑 | My orders |
| GET | `/orders/:id` | 🔑 owner or 👑 | One order |
| PATCH | `/orders/:id/cancel` | 🔑 owner or 👑 | Cancel + restock |
| GET | `/orders` | 👑 | All orders, `?status=` |
| PATCH | `/orders/:id/status` | 👑 | Change order status |

Status codes: `200` OK · `201` created · `400` bad input · `401` not logged in · `403` not allowed · `404` not found · `409` conflict · `500` server error.

---

## 14. Admin test account

After `npm run seed` in `ecormerce-sever`:

- **Email:** `admin@lunavest.com`
- **Password:** `admin@lunavestecore`

Log in at `/pages/signin`. The navbar then shows the admin shield (dashboard at `/admin`), product stock (`/stock`) and order management (`/admin/orders`).

Prefer your own email? Change `ADMIN_EMAILS` and `SEED_ADMIN_PASSWORD` in `ecormerce-sever/.env`, then run `npm run seed` again.
