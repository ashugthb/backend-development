//TODO: Use Telegraf library and create a telegram bot for admin
//Admin should to be able to create/update/delete product from telegram itself

import { Telegraf, Markup, session } from "telegraf";
import Product from "../../models/productModel.js";

// Initialize your bot with the bot token obtained from BotFather
const telegramBot = new Telegraf(
  "6905644803:AAFYGZOveCobyrub-v9xk9PLcYLcrBnXunI"
);

// telegramBot.use(session({ initial: () => ({ editing: {} }) }));

const categories = ["Namkeen", "Nuts", "Pickles", "Oils"];

telegramBot.start((ctx) => {
  ctx.reply(
    "Welcome to the E-commerce bot!",
    Markup.inlineKeyboard([
      Markup.button.callback("Select Product Category", "category"),
      Markup.button.callback("List All Products", "listall"),
    ])
  );
});

telegramBot.action("category", async (ctx) => {
  try {
    const categories = ["Namkeen", "Nuts", "Pickles", "Oils"];

    const categoryButtons = categories.map((category) =>
      Markup.button.callback(category, `category_${category}`)
    );

    ctx.reply(
      "Select a category:",
      Markup.inlineKeyboard(categoryButtons, { columns: 2 })
    );
  } catch (error) {
    ctx.reply("Error fetching categories.");
    console.error(error);
  }
});

// Handle callback queries for each category button
categories.forEach((category) => {
  telegramBot.action(`category_${category}`, async (ctx) => {
    ctx.reply(
      `Do you want to add or delete the product of Category ${category} `,
      Markup.inlineKeyboard([
        Markup.button.callback(`Add ${category}`, `add_${category}`),
        Markup.button.callback(`List All ${category}`, `list_${category}`),
      ])
    );
  });
});

// Handle button click for adding a product
categories.forEach((category) => {
  telegramBot.action(`add_${category}`, async (ctx) => {
    try {
      const selectedCategory = ctx.match[0].split("_")[1];

      ctx.reply(
        `You selected to add a product to category "${selectedCategory}".`
      );
      ctx.reply(
       
        "Enter product details separated by commas in the following format:  <b><i>name,  price,  description,  category,  quantity</i></b>:"
     
      );
    } catch (error) {
      ctx.reply("Error processing category selection.");
      console.error(error);
    }
  });
});

// Handle text input for adding a product
telegramBot.on("text", async (ctx) => {
  const text = ctx.message.text;

  const [name, price, description, category, quantity = "0"] = text.split(",");

  try {
    const product = new Product({
      name: name.trim(),
      price: parseFloat(price.trim()),
      description: description.trim(),
      category: category.trim(),
      quantity: parseFloat(quantity.trim()),
    });
    await product.save();

    ctx.reply(`Product "${product.name}" added successfully.`);
  } catch (error) {
    ctx.reply("Error adding product.");
    console.error(error);
  }
});

// Handle button click for editing a product
telegramBot.action(/^edit_(.*)/, async (ctx) => {
  const productId = ctx.match[1];
  const product = await Product.findById(productId);

  if (!product) {
    await ctx.reply("Product not found.");
    return;
  }

  // Display product details
  await ctx.replyWithHTML(
    `<b>Name:</b> ${product.name}\n` +
      `<b>Price:</b> ${product.price}\n` +
      `<b>Description:</b> ${product.description}\n` +
      `<b>Quantity:</b> ${product.quantity}\n\n` +
      "What detail do you want to edit?",
    Markup.inlineKeyboard([
      Markup.button.callback("Name", `name_${product._id}`),
      Markup.button.callback("Price", `price_${product._id}`),
      Markup.button.callback("Description", `description_${product._id}`),
      Markup.button.callback("Quantity", `quantity_${product._id}`),
    ])
  );
});

// Handle button click for editing the name of a product
telegramBot.action(/^name_(.*)/, async (ctx) => {
  try {
    const productId = ctx.match[1]; // Extract the product ID correctly
    const product = await Product.findById(productId);

    if (!product) {
      await ctx.reply("Product not found.");
      return;
    }

    await ctx.reply(`Enter the new name for "${product.name}":`);
    // ctx.session.editing = { productId, field: "name" };
  } catch (error) {
    ctx.reply("Error editing product name.");
    console.error(error);
  }
});

// Handle button click for editing the price of a product
telegramBot.action(/^price_(.*)/, async (ctx) => {
  try {
    const productId = ctx.match[1];
    const product = await Product.findById(productId);

    if (!product) {
      await ctx.reply("Product not found.");
      return;
    }

    await ctx.reply(`Enter the new price for "${product.name}":`);
    // ctx.session.editing = { productId, field: "price" };
  } catch (error) {
    ctx.reply("Error editing product price.");
    console.error(error);
  }
});

// Handle button click for editing the description of a product
telegramBot.action(/^description_(.*)/, async (ctx) => {
  try {
    const productId = ctx.match[1];
    const product = await Product.findById(productId);

    if (!product) {
      await ctx.reply("Product not found.");
      return;
    }

    await ctx.reply(`Enter the new description for "${product.name}":`);
    // ctx.session.editing = { productId, field: "description" };
  } catch (error) {
    ctx.reply("Error editing product description.");
    console.error(error);
  }
});

// Handle button click for editing the quantity of a product
telegramBot.action(/^quantity_(.*)/, async (ctx) => {
  console.log("Reached Quantity");
  const productId = ctx.match[1]; // Extract the product ID correctly
  const product = await Product.findById(productId);

  if (!product) {
    await ctx.reply("Product not found.");
    return;
  }

  await ctx.reply(`Enter the new quantity for "${product.name}":`);
  console.log(productId);
  // ctx.session.editing = { productId, field: "quantity" };
  // console.log(ctx.session.editing);
});

// Handle text input for updating product details
// telegramBot.on("text", async (ctx) => {
//   // const { editing } = ctx.session;
//   // if (!editing) return;

//   // const { productId, field } = editing;
//   const newValue = ctx.message.text;

//   try {
//     let product = await Product.findById(productId);

//     if (!product) {
//       await ctx.reply("Product not found.");
//       return;
//     }

//     // Update the specified field with the new value
//     product[field] = newValue.trim();
//     await product.save();

//     await ctx.reply(`Product ${field} updated successfully.`);
//     delete ctx.session.editing;
//   } catch (error) {
//     ctx.reply(`Error updating product ${field}.`);
//     console.error(error);
//   }
// });

// Handle button click for deleting a product
telegramBot.action(/^delete_(.*)/, async (ctx) => {
  const productId = ctx.match[1];

  try {
    const product = await Product.findById(productId);

    if (!product) {
      await ctx.reply("Product not found.");
      return;
    }

    const productName = product.name;

    await Product.findByIdAndDelete(productId);
    await ctx.reply(`Product "${productName}" deleted successfully.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    await ctx.reply("An error occurred while deleting the product.");
  }
});

//list products of specific category
categories.forEach((category) => {
  telegramBot.action(`list_${category}`, async (ctx) => {
    try {
      const products = await Product.find({ category });
      if (products.length === 0) {
        ctx.reply(`No products found in the category "${category}".`);
      } else {
        const productListButtons = products.map((product:{_id:"string",name:"string"}) => {
          const editButton = Markup.button.callback(
            "Edit",
            `edit_${product._id}`
          );
          const deleteButton = Markup.button.callback(
            "Delete",
            `delete_${product._id}`
          );
          return [
            Markup.button.callback(product.name, `product_${product._id}`),
            editButton,
            deleteButton,
          ];
        });

        const productListKeyboard = Markup.inlineKeyboard(productListButtons, {
          columns: 3,
        });

        ctx.reply("List of all products:", productListKeyboard);
      }
    } catch (error) {
      ctx.reply("Error fetching products.");
      console.error(error);
    }
  });
});

// Command to list all products
telegramBot.action("listall", async (ctx) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      ctx.reply("No products found.");
    } else {
      const productListButtons = products.map((product:{_id:"string",name:"string"}) => {
        const editButton = Markup.button.callback(
          "Edit",
          `edit_${product._id}`
        );
        const deleteButton = Markup.button.callback(
          "Delete",
          `delete_${product._id}`
        );
        return [
          Markup.button.callback(product.name, `product_${product._id}`),
          editButton,
          deleteButton,
        ];
      });

      const productListKeyboard = Markup.inlineKeyboard(productListButtons, {
        columns: 3,
      });

      ctx.reply("List of all products:", productListKeyboard);
    }
  } catch (error) {
    ctx.reply("Error fetching products.");
    console.error(error);
  }
});

export default telegramBot;
