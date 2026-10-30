// Seeds an admin account and a handful of sample products.
// Prices are in Nigerian naira (NGN).
// Safe to run more than once: existing users/products are left alone.
require("dotenv").config();

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Users, Products, sequelize } = require("./models");

const ADMIN_EMAIL = (process.env.ADMIN_EMAILS || "admin@lunavest.com")
  .split(",")[0]
  .trim()
  .toLowerCase();
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin@lunavestecore";

const sampleProducts = [
  {
    name: "Wireless Noise-Cancelling Headphones",
    description:
      "Over-ear wireless headphones with active noise cancellation, 30 hour battery life and a foldable travel case.",
    price: 185000,
    stock: 25,
    category: "Electronics",
  },
  {
    name: "Smart Watch Series 5",
    description:
      "Fitness tracking, heart-rate monitoring and notifications on a bright always-on display. 7 day battery.",
    price: 95000,
    stock: 40,
    category: "Electronics",
  },
  {
    name: "Classic Denim Jacket",
    description:
      "Mid-weight washed denim jacket with a relaxed fit, button front and two chest pockets.",
    price: 42000,
    stock: 30,
    category: "Fashion",
  },
  {
    name: "Oversized Cotton T-Shirt",
    description:
      "Heavyweight combed cotton tee with a dropped shoulder and a clean, boxy silhouette.",
    price: 12500,
    stock: 120,
    category: "Fashion",
  },
  {
    name: "Slim Fit Chino Jeans",
    description:
      "Stretch cotton chinos cut slim through the leg with a comfortable mid rise waist.",
    price: 28000,
    stock: 60,
    category: "Fashion",
  },
  {
    name: "Canvas Weekender Bag",
    description:
      "Waxed canvas duffel with leather handles, a padded laptop sleeve and a detachable shoulder strap.",
    price: 35000,
    stock: 18,
    category: "Fashion",
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    description:
      "Hand-glazed ceramic dripper and carafe set for a clean, balanced cup of filter coffee.",
    price: 24000,
    stock: 22,
    category: "Home",
  },
  {
    name: "Minimalist Desk Lamp",
    description:
      "Adjustable LED desk lamp with three colour temperatures and a USB charging port in the base.",
    price: 18500,
    stock: 15,
    category: "Home",
  },
  {
    name: "Everyday Cotton Cap",
    description:
      "Six-panel cotton cap with a curved brim and an adjustable metal buckle strap.",
    price: 7500,
    stock: 80,
    category: "Fashion",
  },
];

function imageFor(name) {
  const seed = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `https://picsum.photos/seed/${seed}/800/800`;
}

async function seed() {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error(`Could not connect to the database: ${error.message}`);
    process.exit(1);
  }

  try {
    let admin = await Users.findOne({ where: { email: ADMIN_EMAIL } });

    if (!admin) {
      admin = await Users.create({
        id: crypto.randomUUID(),
        name: "LunaVest Admin",
        email: ADMIN_EMAIL,
        password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        role: "admin",
      });
      console.log(`Created admin ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`);
    } else if (admin.role !== "admin") {
      await admin.update({ role: "admin" });
      console.log(`Promoted existing user ${ADMIN_EMAIL} to admin (password unchanged)`);
    } else {
      console.log(`Admin ${ADMIN_EMAIL} already exists (password unchanged)`);
    }

    let created = 0;
    let skipped = 0;

    for (const sample of sampleProducts) {
      const existing = await Products.findOne({ where: { name: sample.name } });
      if (existing) {
        skipped += 1;
        continue;
      }

      await Products.create({
        ...sample,
        status: "available",
        image: imageFor(sample.name),
        UserId: admin.id,
      });
      created += 1;
    }

    console.log(`Products: ${created} created, ${skipped} already existed`);
    console.log(
      `Done. Log in as ${ADMIN_EMAIL} to add products from /stock and manage orders at /admin/orders.`
    );
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seed();
