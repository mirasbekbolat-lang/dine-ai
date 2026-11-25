import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { menu } from "./menu.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3001;
const money = (n) => new Intl.NumberFormat("kk-KZ").format(n) + " ₸";

function menuText() {
  return menu.map((item) =>
    `${item.name}: ${money(item.price)}, ${item.calories} kcal, ${item.vegetarian ? "vegetarian" : "contains meat"}. ${item.description}`
  ).join("\n");
}

async function askModel(messages, language = "en") {
  if (!process.env.OPENAI_API_KEY) return null;

  
const languageName =
  language === "kk" ? "Kazakh" :
  language === "ru" ? "Russian" :
  "English";

const system = `You are DINE AI, a helpful restaurant assistant for DINE AI in Almaty.

IMPORTANT LANGUAGE RULE:
You MUST always reply ONLY in ${languageName}.
Do not use Russian unless Russian is selected.
Do not mix languages.
Understand the user's question and answer naturally in the selected language.

Be friendly, polite and concise.
Only recommend dishes from this menu.
Never invent ingredients, prices, calories, or availability.
If information is missing, say that it is not listed and suggest asking restaurant staff.

Menu:
${menuText()}`;


  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.5
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI provider error (${response.status}): ${detail.slice(0, 300)}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

function localReply(message, lang = "en") {
  const q = message.toLowerCase();
  const isKk = lang === "kk";
  const isRu = lang === "ru";
  const tr = (kk, ru, en) => isKk ? kk : isRu ? ru : en;

  const budgetMatch = q.match(/(\d[\d\s.,]*)\s*(₸|тг|теңге|tenge|kzt)?/i);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/[^\d]/g, "")) : null;
  if (q.includes("vegetarian") || q.includes("етсіз") || q.includes("без мяс") || q.includes("вегет")) {
    const picks = menu.filter(x => x.vegetarian).slice(0, 3);
    return tr(
      "Етсіз нұсқалар: " + picks.map(x => `${x.name} — ${money(x.price)}`).join("; ") + ". Құрамын тапсырыс алдында нақтылап алыңыз.",
      "Варианты без мяса: " + picks.map(x => `${x.name} — ${money(x.price)}`).join("; ") + ". Состав лучше уточнить перед заказом.",
      "Vegetarian options: " + picks.map(x => `${x.name} — ${money(x.price)}`).join("; ") + ". Please confirm ingredients before ordering."
    );
  }
  if (budget && budget > 500) {
    const picks = menu.filter(x => x.price <= budget).sort((a,b) => a.price-b.price).slice(0, 3);
    if (picks.length) return tr(
      `Сіздің бюджетіңізге сай ұсыныстар: ${picks.map(x => `${x.name} — ${money(x.price)}`).join("; ")}.`,
      `В ваш бюджет подходят: ${picks.map(x => `${x.name} — ${money(x.price)}`).join("; ")}.`,
      `Within your budget: ${picks.map(x => `${x.name} — ${money(x.price)}`).join("; ")}.`
    );
  }
  if (q.includes("calorie") || q.includes("калори") || q.includes("ккал")) {
    const picks = [...menu].sort((a,b) => a.calories-b.calories).slice(0, 3);
    return tr(
      "Мәзірдегі калориясы төмен тағамдар: " + picks.map(x => `${x.name} — ${x.calories} ккал`).join("; ") + ".",
      "Самые низкокалорийные позиции в меню: " + picks.map(x => `${x.name} — ${x.calories} ккал`).join("; ") + ".",
      "Lower-calorie menu items: " + picks.map(x => `${x.name} — ${x.calories} kcal`).join("; ") + "."
    );
  }
  return tr(
    "Сәлем! Мен DINE AI көмекшісімін. Бюджетіңізді, тағам талғамыңызды немесе мәзір туралы сұрағыңызды жазыңыз. Қазір демо режимінде жұмыс істеп тұрмын.",
    "Здравствуйте! Я помощник DINE AI. Напишите ваш бюджет, предпочтения или вопрос о меню. Сейчас я работаю в демо-режиме.",
    "Hello! I'm the DINE AI assistant. Tell me your budget, food preferences, or ask about the menu. I'm currently running in demo mode."
  );
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, mode: process.env.OPENAI_API_KEY ? "ai" : "demo" });
});

app.get("/api/menu", (_req, res) => res.json(menu));

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [], language = "en" } = req.body || {};
    if (!message?.trim()) return res.status(400).json({ error: "Message is required." });
    const answer = await askModel(
      [...history.slice(-8), { role: "user", content: message.trim() }],
      language
    );
    res.json({
      answer: answer || localReply(message, language),
      mode: process.env.OPENAI_API_KEY ? "ai" : "demo"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "The assistant is temporarily unavailable. Check the server terminal." });
  }
});

app.post("/api/recommend", async (req, res) => {
  try {
    const { budget, preference = "", language = "en" } = req.body || {};
    const filtered = menu.filter(item => (!budget || item.price <= Number(budget)) &&
      (!preference.toLowerCase().includes("veget") && !preference.toLowerCase().includes("етсіз") && !preference.toLowerCase().includes("без мяс") || item.vegetarian));
    if (process.env.OPENAI_API_KEY) {
      const prompt = `Recommend up to 3 dishes from the menu for a guest with budget ${budget || "not specified"} KZT and preferences "${preference || "no special preference"}". Return ONLY valid JSON in this exact shape: {"names":["exact menu item name"],"explanation":"short explanation in ${language === "kk" ? "Kazakh" : language === "ru" ? "Russian" : "English"}"}. Never include dishes outside the menu and never exceed the budget.`;
      const raw = await askModel([{ role: "user", content: prompt }], language);
      try {
        const parsed = JSON.parse(raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1));
        const selected = (parsed.names || []).map(name => menu.find(item => item.name.toLowerCase() === String(name).toLowerCase())).filter(Boolean);
        return res.json({ suggestions: selected, explanation: parsed.explanation || "", mode: "ai" });
      } catch {
        // If the model response is not valid JSON, safely fall back to menu filtering below.
      }
    }
    const suggestions = filtered.sort((a,b) => a.price-b.price).slice(0, 4);
    if (!suggestions.length) return res.json({ suggestions: [], explanation: language === "kk" ? "Бұл шарттарға сай тағам табылмады." : language === "ru" ? "Не найдено блюд по этим условиям." : "No dishes match these preferences." });
    const explanation = language === "kk" ? "Мәзірдегі баға мен таңдауыңызға сүйеніп ұсынылды (демо алгоритм)." :
      language === "ru" ? "Подобрано по вашему бюджету и предпочтениям (демо-алгоритм)." :
      "Selected from the menu based on your budget and preferences (demo logic).";
    res.json({ suggestions, explanation, mode: "menu-logic" });
  } catch {
    res.status(500).json({ error: "Could not create recommendations." });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const { question = "", language = "en" } = req.body || {};
    const prompt = question.trim() || "Summarize the menu: compare prices and calories, and identify vegetarian choices.";
    const answer = await askModel([{ role: "user", content: prompt }], language);
    if (answer) return res.json({ answer, mode: "ai" });

    const cheapest = [...menu].sort((a,b) => a.price-b.price)[0];
    const lowest = [...menu].sort((a,b) => a.calories-b.calories)[0];
    const vegetarian = menu.filter(x => x.vegetarian);
    const text = language === "kk"
      ? `Мәзірде ${menu.length} тағам бар. Ең қолжетімдісі — ${cheapest.name} (${money(cheapest.price)}). Калориясы ең төмені — ${lowest.name} (${lowest.calories} ккал). Етсіз нұсқалар саны: ${vegetarian.length}.`
      : language === "ru"
      ? `В меню ${menu.length} позиций. Самое доступное блюдо — ${cheapest.name} (${money(cheapest.price)}). Наименьшая калорийность у ${lowest.name} (${lowest.calories} ккал). Вегетарианских позиций: ${vegetarian.length}.`
      : `The menu has ${menu.length} items. The most affordable is ${cheapest.name} (${money(cheapest.price)}). The lowest-calorie item is ${lowest.name} (${lowest.calories} kcal). Vegetarian options: ${vegetarian.length}.`;
    res.json({ answer: text, mode: "menu-analysis" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Menu analysis failed." });
  }
});

app.post("/api/bookings", (req, res) => {
  const { name, date, time, guests } = req.body || {};
  if (!name || !date || !time || !guests) return res.status(400).json({ error: "Please complete all booking fields." });
  res.json({ ok: true, booking: { name, date, time, guests }, message: "Demo booking received. Connect a database to save bookings permanently." });
});

app.listen(PORT, () => console.log(`DINE AI server running at http://localhost:${PORT}`));
