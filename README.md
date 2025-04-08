# 🎨 AI Image Generator Web App

This is a sleek, responsive web application that allows users to generate AI-powered images using various **Stable Diffusion models** from Hugging Face. Just type a prompt, choose your model, number of images, and aspect ratio.

![Screenshot (72)](https://github.com/user-attachments/assets/f2faf29d-affb-4f88-ab35-24e42f37ab29)

## 🚀 Features

- ✅ Generate stunning images from text prompts
- 🎯 Choose from multiple Stable Diffusion models
- 🖼️ Select number of images to generate
- 🔳 Pick aspect ratios (1:1, 16:9, 9:16)
- 🌗 Dark mode friendly & fully responsive UI
- 💾 Download each generated image with a click

---

## 💡 How It Works

The app uses Hugging Face’s 🤗 Inference API to interact with AI models that generate images based on user input.

Available models include:
- `stabilityai/stable-diffusion-2`
- `runwayml/stable-diffusion-v1-5`
- `prompthero/openjourney`
- `CompVis/stable-diffusion-v1-4`

---

## 🔐 Hugging Face API Key

To use the app, you need a Hugging Face API key:

1. Go to: https://huggingface.co/settings/tokens
2. Click **"New Token"** and copy your token.
3. In `Ai_image_gen.js`, replace the placeholder:

```js
const API_KEY = "your_api_key_here";
