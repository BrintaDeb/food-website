# 🍔 Burgers That Love the Earth — Food Website

A modern, responsive, and appetizing food restaurant landing page built with pure HTML5, CSS3, and modern Vanilla JavaScript.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/BrintaDeb/food-website)

---

## ✨ Features

- **Dynamic Hero Section**: Vibrant organic fluid curve backdrop, floating rating card (4.5★ from 5k reviews), and double burger platter presentation.
- **Hot Items Interactive Carousel**:
  - Smooth slider navigation with previous/next buttons and active pagination dots.
  - Interactive item cards: Veg Crispy, Hot Crispy, Veg Vegy, and Classic burgers.
  - Instant **Add to Bag** actions with animated counter badges and toast notifications.
- **Promotional Banner**: High-impact "Up to 50% Off On Your Two Orders" combo meal showcase.
- **Who We Are**: Community-focused brand pillars with 3D chef character graphics.
- **How It Works**: 3-step intuitive visual ordering flow (Choose Meals ➔ Track Order ➔ Collect Order).
- **Interactive Testimonials**: Customer review slider with dynamic content switching.
- **Interactive Modals & Drawer**:
  - **Slide-out Cart Drawer**: Live subtotal calculation, quantity indicators, and checkout simulation.
  - **Live Search Modal**: Real-time filtering across menu items with quick add-to-cart.
  - **Video Demo Modal**: Modal player for culinary showcase.
  - **Toast Alerts**: Micro-interaction feedback for user actions.
- **Zero-Dependency**: Fast loading times and no heavy JS frameworks needed.

---

## 🚀 Live Deployment on Render

This project includes [`render.yaml`](./render.yaml) for instant 1-click deployment on [Render Static Sites](https://render.com):

1. Click the **Deploy to Render** button above or visit:
   `https://render.com/deploy?repo=https://github.com/BrintaDeb/food-website`
2. Connect your GitHub account and select your repository.
3. Render automatically provisions the global CDN with free SSL encryption.

---

## 💻 Local Development

Run the website locally using any simple HTTP server:

```bash
# Using Python 3
python -m http.server 3000

# Or using npx serve
npx serve .
```

Then open `http://localhost:3000` in your web browser.

---

## 📁 Project Structure

```
food website/
├── .gitignore               # Ignored files (OS files, raw mockups)
├── render.yaml              # Render Static Site Blueprint configuration
├── README.md                # Project documentation & deployment guide
├── index.html               # Main semantic HTML structure
├── css/
│   └── style.css            # Responsive styles, design system & animations
├── js/
│   └── app.js               # Cart state, carousels, search & modal handlers
└── images/                  # Production web assets and burger cutouts
```

---

## 📄 License

MIT © [BrintaDeb](https://github.com/BrintaDeb)
