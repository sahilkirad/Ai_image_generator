document.addEventListener("DOMContentLoaded", function () {
    const themeToggleBtn = document.querySelector(".theme-toggle");
    const icon = themeToggleBtn.querySelector("i");

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        icon.classList.replace("fa-moon", "fa-sun");
    } else {
        document.body.classList.remove("dark");
        icon.classList.replace("fa-sun", "fa-moon");
    }

    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        icon.classList.toggle("fa-sun", isDark);
        icon.classList.toggle("fa-moon", !isDark);
    });
});

const examplePrompts = [
    "A magic forest with glowing plants and fairy homes among giant mushrooms",
    "An old steampunk airship floating through golden clouds at sunset",
    "A future Mars colony with glass domes and gardens against red mountains",
    "A dragon sleeping on gold coins in a crystal cave",
    "An underwater kingdom with merpeople and glowing coral buildings",
    "A floating island with waterfalls pouring into clouds below",
    "A witch's cottage in fall with magic herbs in the garden",
    "A robot painting in a sunny studio with art supplies around it",
    "A magical library with floating glowing books and spiral staircases",
    "A Japanese shrine during cherry blossom season with lanterns and misty mountains",
    "A cosmic beach with glowing sand and an aurora in the night sky",
    "A medieval marketplace with colorful tents and street performers",
    "A cyberpunk city with neon signs and flying cars at night",
    "A peaceful bamboo forest with a hidden ancient temple",
    "A giant turtle carrying a village on its back in the ocean",
];

const promptBtn = document.querySelector(".prompt-btn");
const promptInput = document.querySelector(".prompt-input");
const promptForm = document.querySelector(".prompt-form");
const modelSelect = document.getElementById("model-select");
const countSelect = document.getElementById("count-select");
const ratioSelect = document.getElementById("ratio-select");
const gridGallery = document.querySelector(".gallery-grid");

const API_KEY = "{your_api_key_}";

const validModels = [
    "stabilityai/stable-diffusion-2",
    "runwayml/stable-diffusion-v1-5",
    "prompthero/openjourney",
    "CompVis/stable-diffusion-v1-4"
];

promptBtn.addEventListener("click", () => {
    const prompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];
    promptInput.value = prompt;
    promptInput.focus();
});

// Helper to get width/height from ratio
const baseSize = 512;
const getImageDimensions = (aspectRatio) => {
    const [width, height] = aspectRatio.split("/").map(Number);
    const scaleFactor = baseSize / Math.sqrt(width * height);
    let calculatedWidth = Math.round(width * scaleFactor);
    let calculatedHeight = Math.round(height * scaleFactor);
    calculatedWidth = Math.floor(calculatedWidth / 16) * 16;
    calculatedHeight = Math.floor(calculatedHeight / 16) * 16;
    return { width: calculatedWidth, height: calculatedHeight };
};

const generateImages = async (selectedModel, imageCount, aspectRatio, promptText) => {
    if (!validModels.includes(selectedModel)) {
        alert(`🚫 Invalid model selected: ${selectedModel}\nPlease choose a valid one.`);
        return;
    }

    const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`;
    const { width, height } = getImageDimensions(aspectRatio);

    const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
        try {
            const response = await fetch(MODEL_URL, {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "x-use-cache": "false",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: promptText,
                    parameters: { width, height },
                    options: { wait_for_model: true, use_cache: false }
                }),
            });

            if (!response.ok) {
                const errJson = await response.json();
                throw new Error(errJson?.error || "Unknown error from model");
            }

            const result = await response.blob();
            const imgURL = URL.createObjectURL(result);

            const imgCard = gridGallery.children[i];
            imgCard.classList.remove("loading");
            imgCard.innerHTML = `
                <img src="${imgURL}" alt="Generated Image ${i + 1}" class="result-img"/>
                <div class="img-overlay">
                    <a href="${imgURL}" download="ai_image_${i + 1}.png" class="img-download-btn">
                        <i class="fa-solid fa-download"></i>
                    </a>
                </div>
            `;
        } catch (err) {
            console.error(err);
            const imgCard = gridGallery.children[i];
            imgCard.classList.remove("loading");
            imgCard.innerHTML = `
                <div class="status-container">
                    <p class="status-text error">❌ ${err.message}</p>
                </div>
            `;
        }
    });

    await Promise.allSettled(imagePromises);
};

const createImageCards = (selectedModel, imageCount, aspectRatio, promptText) => {
    gridGallery.innerHTML = "";

    for (let i = 0; i < imageCount; i++) {
        const loadingCard = document.createElement("div");
        loadingCard.className = "img-card loading";
        loadingCard.style.aspectRatio = aspectRatio;
        loadingCard.innerHTML = `
            <div class="status-container">
                <div class="spinner"></div>
                <p class="status-text">Generating...</p>
            </div>
        `;
        gridGallery.appendChild(loadingCard);
    }

    generateImages(selectedModel, imageCount, aspectRatio, promptText);
};

promptForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedModel = modelSelect.value;
    const imageCount = parseInt(countSelect.value);
    const aspectRatio = ratioSelect.value;
    const promptText = promptInput.value.trim();

    if (!selectedModel || !imageCount || !aspectRatio || !promptText) {
        alert("⚠️ Please fill in all fields!");
        return;
    }

    createImageCards(selectedModel, imageCount, aspectRatio, promptText);
});
