import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const result = await model.generateContent("Hello");
        console.log(result.response.text());
    } catch (err) {
        console.error(err);
    }
}

test();