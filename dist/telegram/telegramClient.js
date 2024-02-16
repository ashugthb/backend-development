"use strict";
//TODO: Use Telegraf library and create a telegram bot for admin
//Admin should to be able to create/update/delete product from telegram itself
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const productModel_js_1 = __importDefault(require("../../models/productModel.js"));
// Initialize your bot with the bot token obtained from BotFather
const telegramBot = new telegraf_1.Telegraf("6905644803:AAFYGZOveCobyrub-v9xk9PLcYLcrBnXunI");
// telegramBot.use(session({ initial: () => ({ editing: {} }) }));
const categories = ["Namkeen", "Nuts", "Pickles", "Oils"];
telegramBot.start((ctx) => {
    ctx.reply("Welcome to the E-commerce bot!", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Select Product Category", "category"),
        telegraf_1.Markup.button.callback("List All Products", "listall"),
    ]));
});
telegramBot.action("category", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = ["Namkeen", "Nuts", "Pickles", "Oils"];
        const categoryButtons = categories.map((category) => telegraf_1.Markup.button.callback(category, `category_${category}`));
        ctx.reply("Select a category:", telegraf_1.Markup.inlineKeyboard(categoryButtons, { columns: 2 }));
    }
    catch (error) {
        ctx.reply("Error fetching categories.");
        console.error(error);
    }
}));
// Handle callback queries for each category button
categories.forEach((category) => {
    telegramBot.action(`category_${category}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        ctx.reply(`Do you want to add or delete the product of Category ${category} `, telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback(`Add ${category}`, `add_${category}`),
            telegraf_1.Markup.button.callback(`List All ${category}`, `list_${category}`),
        ]));
    }));
});
// Handle button click for adding a product
categories.forEach((category) => {
    telegramBot.action(`add_${category}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const selectedCategory = ctx.match[0].split("_")[1];
            ctx.reply(`You selected to add a product to category "${selectedCategory}".`);
            ctx.reply("Enter product details separated by commas in the following format:  <b><i>name,  price,  description,  category,  quantity</i></b>:");
        }
        catch (error) {
            ctx.reply("Error processing category selection.");
            console.error(error);
        }
    }));
});
// Handle text input for adding a product
telegramBot.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const text = ctx.message.text;
    const [name, price, description, category, quantity = "0"] = text.split(",");
    try {
        const product = new productModel_js_1.default({
            name: name.trim(),
            price: parseFloat(price.trim()),
            description: description.trim(),
            category: category.trim(),
            quantity: parseFloat(quantity.trim()),
        });
        yield product.save();
        ctx.reply(`Product "${product.name}" added successfully.`);
    }
    catch (error) {
        ctx.reply("Error adding product.");
        console.error(error);
    }
}));
// Handle button click for editing a product
telegramBot.action(/^edit_(.*)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = ctx.match[1];
    const product = yield productModel_js_1.default.findById(productId);
    if (!product) {
        yield ctx.reply("Product not found.");
        return;
    }
    // Display product details
    yield ctx.replyWithHTML(`<b>Name:</b> ${product.name}\n` +
        `<b>Price:</b> ${product.price}\n` +
        `<b>Description:</b> ${product.description}\n` +
        `<b>Quantity:</b> ${product.quantity}\n\n` +
        "What detail do you want to edit?", telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.callback("Name", `name_${product._id}`),
        telegraf_1.Markup.button.callback("Price", `price_${product._id}`),
        telegraf_1.Markup.button.callback("Description", `description_${product._id}`),
        telegraf_1.Markup.button.callback("Quantity", `quantity_${product._id}`),
    ]));
}));
// Handle button click for editing the name of a product
telegramBot.action(/^name_(.*)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = ctx.match[1]; // Extract the product ID correctly
        const product = yield productModel_js_1.default.findById(productId);
        if (!product) {
            yield ctx.reply("Product not found.");
            return;
        }
        yield ctx.reply(`Enter the new name for "${product.name}":`);
        // ctx.session.editing = { productId, field: "name" };
    }
    catch (error) {
        ctx.reply("Error editing product name.");
        console.error(error);
    }
}));
// Handle button click for editing the price of a product
telegramBot.action(/^price_(.*)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = ctx.match[1];
        const product = yield productModel_js_1.default.findById(productId);
        if (!product) {
            yield ctx.reply("Product not found.");
            return;
        }
        yield ctx.reply(`Enter the new price for "${product.name}":`);
        // ctx.session.editing = { productId, field: "price" };
    }
    catch (error) {
        ctx.reply("Error editing product price.");
        console.error(error);
    }
}));
// Handle button click for editing the description of a product
telegramBot.action(/^description_(.*)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = ctx.match[1];
        const product = yield productModel_js_1.default.findById(productId);
        if (!product) {
            yield ctx.reply("Product not found.");
            return;
        }
        yield ctx.reply(`Enter the new description for "${product.name}":`);
        // ctx.session.editing = { productId, field: "description" };
    }
    catch (error) {
        ctx.reply("Error editing product description.");
        console.error(error);
    }
}));
// Handle button click for editing the quantity of a product
telegramBot.action(/^quantity_(.*)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Reached Quantity");
    const productId = ctx.match[1]; // Extract the product ID correctly
    const product = yield productModel_js_1.default.findById(productId);
    if (!product) {
        yield ctx.reply("Product not found.");
        return;
    }
    yield ctx.reply(`Enter the new quantity for "${product.name}":`);
    console.log(productId);
    // ctx.session.editing = { productId, field: "quantity" };
    // console.log(ctx.session.editing);
}));
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
telegramBot.action(/^delete_(.*)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = ctx.match[1];
    try {
        const product = yield productModel_js_1.default.findById(productId);
        if (!product) {
            yield ctx.reply("Product not found.");
            return;
        }
        const productName = product.name;
        yield productModel_js_1.default.findByIdAndDelete(productId);
        yield ctx.reply(`Product "${productName}" deleted successfully.`);
    }
    catch (error) {
        console.error("Error deleting product:", error);
        yield ctx.reply("An error occurred while deleting the product.");
    }
}));
//list products of specific category
categories.forEach((category) => {
    telegramBot.action(`list_${category}`, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const products = yield productModel_js_1.default.find({ category });
            if (products.length === 0) {
                ctx.reply(`No products found in the category "${category}".`);
            }
            else {
                const productListButtons = products.map((product) => {
                    const editButton = telegraf_1.Markup.button.callback("Edit", `edit_${product._id}`);
                    const deleteButton = telegraf_1.Markup.button.callback("Delete", `delete_${product._id}`);
                    return [
                        telegraf_1.Markup.button.callback(product.name, `product_${product._id}`),
                        editButton,
                        deleteButton,
                    ];
                });
                const productListKeyboard = telegraf_1.Markup.inlineKeyboard(productListButtons, {
                    columns: 3,
                });
                ctx.reply("List of all products:", productListKeyboard);
            }
        }
        catch (error) {
            ctx.reply("Error fetching products.");
            console.error(error);
        }
    }));
});
// Command to list all products
telegramBot.action("listall", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productModel_js_1.default.find();
        if (products.length === 0) {
            ctx.reply("No products found.");
        }
        else {
            const productListButtons = products.map((product) => {
                const editButton = telegraf_1.Markup.button.callback("Edit", `edit_${product._id}`);
                const deleteButton = telegraf_1.Markup.button.callback("Delete", `delete_${product._id}`);
                return [
                    telegraf_1.Markup.button.callback(product.name, `product_${product._id}`),
                    editButton,
                    deleteButton,
                ];
            });
            const productListKeyboard = telegraf_1.Markup.inlineKeyboard(productListButtons, {
                columns: 3,
            });
            ctx.reply("List of all products:", productListKeyboard);
        }
    }
    catch (error) {
        ctx.reply("Error fetching products.");
        console.error(error);
    }
}));
exports.default = telegramBot;
