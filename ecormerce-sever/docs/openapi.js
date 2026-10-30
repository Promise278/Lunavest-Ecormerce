const PORT = process.env.PORT || 5000;

const SERVER_URL =
  process.env.PUBLIC_API_URL || `https://lunavest-ecormerce.onrender.com`;

const bearerAuth = {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Paste the `token` returned by POST /auth/login (valid 8 hours).",
};

const errorResponse = {
  description: "Error",
  content: {
    "application/json": {
      schema: { $ref: "#/components/schemas/Error" },
    },
  },
};

function jsonOk(description, schemaRef) {
  return {
    description,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: description },
            data: schemaRef,
          },
          required: ["success"],
        },
      },
    },
  };
}

const spec = {
  openapi: "3.0.3",
  info: {
    title: "LunaVest API",
    version: "1.0.0",
    description: [
      "E-commerce API for the LunaVest storefront (Next.js frontend + Express/MySQL backend).",
      "",
      "**Response shape** — every endpoint answers with the same envelope:",
      "`{ success: boolean, message?: string, data?: any, ... }`. Check `response.ok`, then read `message`.",
      "",
      "**Auth** — most endpoints need `Authorization: Bearer <token>`. Tokens expire after 8 hours.",
      "",
      "**Money** — prices are in Nigerian naira (₦).",
      "",
      "Source guide: `ecormerce-sever/API.md`.",
    ].join("\n"),
    contact: { name: "LunaVest API" },
  },
  servers: [{ url: SERVER_URL, description: "API server" }],
  tags: [
    { name: "Auth", description: "Register, log in, current user" },
    { name: "Products", description: "Catalog, search, admin CRUD" },
    { name: "Likes", description: "Wishlist toggle and list" },
    { name: "Orders", description: "Checkout, my orders, admin order management" },
  ],
  security: [],

  paths: {
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Create an account",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", minLength: 4, example: "Amina Yusuf" },
                  email: { type: "string", format: "email", example: "amina@example.com" },
                  password: { type: "string", minLength: 5, example: "secret123" },
                },
              },
            },
          },
        },
        responses: {
          "201": jsonOk("User Registered successfully", {
            $ref: "#/components/schemas/User",
          }),
          "400": errorResponse,
          "500": errorResponse,
        },
      },
    },

    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in and get a token",
        description:
          "Register does not return a token — call this right after registering. Emails of admins are read from `ADMIN_EMAILS`.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@lunavest.com" },
                  password: { type: "string", example: "admin@lunavestecore" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiJ9..." },
                    user: { $ref: "#/components/schemas/AuthUser" },
                    message: { type: "string", example: "User Login successfully" },
                  },
                },
              },
            },
          },
          "400": errorResponse,
          "401": errorResponse,
          "500": errorResponse,
        },
      },
    },

    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Current logged-in user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": jsonOk("Current user", { $ref: "#/components/schemas/User" }),
          "401": errorResponse,
          "404": errorResponse,
        },
      },
    },

    "/products/seeAllproducts": {
      get: {
        tags: ["Products"],
        summary: "List products (search, filter, paginate)",
        security: [],
        parameters: [
          {
            name: "search",
            in: "query",
            description: "Matches product name or description (case-insensitive).",
            schema: { type: "string" },
            example: "denim",
          },
          {
            name: "category",
            in: "query",
            description: "Exact category match. `All Category` (or omitted) returns everything.",
            schema: { type: "string" },
            example: "Fashion",
          },
          {
            name: "page",
            in: "query",
            schema: { type: "integer", minimum: 1, default: 1 },
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer", minimum: 1, maximum: 48, default: 12 },
          },
        ],
        responses: {
          "200": {
            description: "Products retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    message: { type: "string", example: "Products retrieved successfully" },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                    pagination: { $ref: "#/components/schemas/Pagination" },
                  },
                },
              },
            },
          },
          "500": errorResponse,
        },
      },
    },

    "/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get one product",
        security: [],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": jsonOk("Product", { $ref: "#/components/schemas/Product" }),
          "404": errorResponse,
        },
      },
    },

    "/products/generate_products": {
      post: {
        tags: ["Products"],
        summary: "Add a product (admin)",
        description:
          "Send `multipart/form-data` — do **not** set `Content-Type` yourself, the browser adds the boundary.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["name", "description", "price", "stock", "image"],
                properties: {
                  name: { type: "string", example: "Classic Denim Jacket" },
                  description: { type: "string", example: "Vintage washed denim jacket." },
                  price: { type: "string", example: "42000" },
                  stock: { type: "string", example: "25" },
                  image: { type: "string", format: "binary", description: "Image file" },
                  status: {
                    type: "string",
                    enum: ["available", "inactive", "out-of-stock"],
                    default: "available",
                  },
                  category: { type: "string", default: "Other", example: "Fashion" },
                },
              },
            },
          },
        },
        responses: {
          "201": jsonOk("Product added successfully", { $ref: "#/components/schemas/Product" }),
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
          "500": errorResponse,
        },
      },
    },

    "/products/update/{id}": {
      put: {
        tags: ["Products"],
        summary: "Edit a product (admin)",
        description:
          "Send only the fields that change. Use JSON for text-only edits, or `multipart/form-data` when also replacing the image.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProductUpdate" },
            },
            "multipart/form-data": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/ProductUpdate" },
                  {
                    type: "object",
                    properties: { image: { type: "string", format: "binary" } },
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": jsonOk("Product updated successfully", { $ref: "#/components/schemas/Product" }),
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
          "404": errorResponse,
          "500": errorResponse,
        },
      },
    },

    "/products/deleteProducts/{id}": {
      delete: {
        tags: ["Products"],
        summary: "Delete a product (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": jsonOk("Product deleted successfully", {
            $ref: "#/components/schemas/Product",
          }),
          "401": errorResponse,
          "403": errorResponse,
          "404": errorResponse,
          "409": errorResponse,
        },
      },
    },

    "/products/like/{id}": {
      post: {
        tags: ["Likes"],
        summary: "Like / unlike a product (toggle)",
        description: "Call once to like, again to unlike. `liked` in the response shows the new state.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": {
            description: "Product unliked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LikeResponse" },
              },
            },
          },
          "201": {
            description: "Product liked",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LikeResponse" },
              },
            },
          },
          "401": errorResponse,
          "404": errorResponse,
        },
      },
    },

    "/products/liked": {
      get: {
        tags: ["Likes"],
        summary: "My wishlist",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Wishlist products",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                  },
                },
              },
            },
          },
          "401": errorResponse,
        },
      },
    },

    "/orders/checkout": {
      post: {
        tags: ["Orders"],
        summary: "Place an order",
        description:
          "Send product ids and quantities only — never prices. The server reads real prices from the database, validates stock, creates the order and reduces stock in one transaction.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items"],
                properties: {
                  items: {
                    type: "array",
                    minItems: 1,
                    items: {
                      type: "object",
                      required: ["id", "quantity"],
                      properties: {
                        id: { type: "string", format: "uuid", description: "Product id" },
                        quantity: { type: "integer", minimum: 1, example: 2 },
                      },
                    },
                  },
                },
              },
              example: {
                items: [
                  { id: "9e81f4a2-0000-4000-8000-000000000001", quantity: 2 },
                ],
              },
            },
          },
        },
        responses: {
          "201": jsonOk("Order placed successfully", { $ref: "#/components/schemas/Order" }),
          "400": errorResponse,
          "401": errorResponse,
          "404": errorResponse,
          "500": errorResponse,
        },
      },
    },

    "/orders/my-orders": {
      get: {
        tags: ["Orders"],
        summary: "My orders",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Orders for the logged-in user, newest first",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
          },
          "401": errorResponse,
        },
      },
    },

    "/orders/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get one order (owner or admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": jsonOk("Order", { $ref: "#/components/schemas/Order" }),
          "401": errorResponse,
          "403": errorResponse,
          "404": errorResponse,
        },
      },
    },

    "/orders/{id}/cancel": {
      patch: {
        tags: ["Orders"],
        summary: "Cancel an order and restock it",
        description:
          "Only `pending` or `paid` orders can be cancelled. The stock of every item is put back automatically.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        responses: {
          "200": jsonOk("Order cancelled successfully", { $ref: "#/components/schemas/Order" }),
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
          "404": errorResponse,
        },
      },
    },

    "/orders": {
      get: {
        tags: ["Orders"],
        summary: "All orders (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            },
          },
        ],
        responses: {
          "200": {
            description: "All orders, newest first",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean", example: true },
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Order" },
                    },
                  },
                },
              },
            },
          },
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
        },
      },
    },

    "/orders/{id}/status": {
      patch: {
        tags: ["Orders"],
        summary: "Change order status (admin)",
        description:
          "Setting `cancelled` also restocks the items. A delivered or cancelled order cannot change again.",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["status"],
                properties: {
                  status: {
                    type: "string",
                    enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
                    example: "shipped",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": jsonOk("Order status updated successfully", {
            $ref: "#/components/schemas/Order",
          }),
          "400": errorResponse,
          "401": errorResponse,
          "403": errorResponse,
          "404": errorResponse,
        },
      },
    },
  },

  components: {
    securitySchemes: { bearerAuth },

    schemas: {
      Error: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string", example: "Invalid email or password" },
          error: { type: "string", description: "Only present on 500 responses" },
        },
        required: ["success", "message"],
      },

      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Amina Yusuf" },
          email: { type: "string", format: "email", example: "amina@example.com" },
          role: { type: "string", enum: ["user", "admin"], example: "user" },
          createdAt: { type: "string", format: "date-time" },
        },
      },

      AuthUser: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["user", "admin"] },
          time: { type: "integer", description: "Issued-at timestamp (ms)" },
        },
      },

      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Classic Denim Jacket" },
          description: { type: "string" },
          price: { type: "number", format: "float", example: 42000 },
          stock: { type: "integer", example: 25 },
          status: {
            type: "string",
            enum: ["available", "inactive", "out-of-stock"],
          },
          category: { type: "string", example: "Fashion" },
          image: { type: "string", format: "uri", example: "https://res.cloudinary.com/..." },
          UserId: { type: "string", format: "uuid" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          User: {
            type: "object",
            nullable: true,
            description: "Populated on GET /products/{id} only",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
            },
          },
        },
      },

      ProductUpdate: {
        type: "object",
        description: "Send only the fields you want to change.",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          price: { type: "number", minimum: 0 },
          stock: { type: "integer", minimum: 0 },
          status: { type: "string", enum: ["available", "inactive", "out-of-stock"] },
          category: { type: "string" },
        },
      },

      LikeResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Product liked" },
          liked: { type: "boolean", example: true },
        },
      },

      Pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 12 },
          total: { type: "integer", example: 9 },
          totalPages: { type: "integer", example: 1 },
          hasMore: { type: "boolean", example: false },
        },
      },

      OrderItem: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          quantity: { type: "integer", example: 2 },
          price: { type: "number", format: "float", example: 42000 },
          ProductId: { type: "string", format: "uuid" },
          OrderId: { type: "string", format: "uuid" },
          Product: { $ref: "#/components/schemas/Product" },
        },
      },

      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          UserId: { type: "string", format: "uuid" },
          totalAmount: { type: "number", format: "float", example: 84000 },
          status: {
            type: "string",
            enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
            example: "pending",
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          OrderItems: {
            type: "array",
            items: { $ref: "#/components/schemas/OrderItem" },
          },
          User: {
            type: "object",
            nullable: true,
            description: "Populated on admin views only",
            properties: {
              id: { type: "string", format: "uuid" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
        },
      },
    },
  },
};

module.exports = spec;
