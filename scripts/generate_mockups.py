import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

MOCKUPS_DIR = r"c:\Users\Shreyam\Downloads\food website\mockups"
IMAGES_DIR = r"c:\Users\Shreyam\Downloads\food website\public\images"

os.makedirs(MOCKUPS_DIR, exist_ok=True)

# Colors
C_BG_DARK = (18, 14, 12)
C_SURFACE = (28, 22, 19)
C_SURFACE_LIGHT = (42, 34, 30)
C_PRIMARY = (255, 94, 0)
C_PRIMARY_LIGHT = (255, 133, 22)
C_ACCENT_GREEN = (22, 163, 74)
C_ACCENT_GOLD = (245, 158, 11)
C_WHITE = (255, 255, 255)
C_MUTED = (160, 150, 145)
C_BORDER = (55, 45, 40)
C_CREAM = (255, 253, 249)

# Fonts
def get_font(size, bold=False):
    font_name = "segoeuib.ttf" if bold else "segoeui.ttf"
    path = os.path.join(r"C:\Windows\Fonts", font_name)
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()

def draw_circle_avatar(img_path, size):
    avatar_src = Image.open(img_path).convert("RGBA")
    avatar_src = avatar_src.resize((size, size), Image.Resampling.LANCZOS)
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.ellipse((0, 0, size, size), fill=255)
    avatar = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    avatar.paste(avatar_src, (0, 0), mask)
    return avatar

def draw_rounded_image(img_path, width, height, radius):
    src = Image.open(img_path).convert("RGBA")
    src = src.resize((width, height), Image.Resampling.LANCZOS)
    mask = Image.new("L", (width, height), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, width, height), radius=radius, fill=255)
    result = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    result.paste(src, (0, 0), mask)
    return result

def add_drop_shadow(base_img, box_rect, radius=24, offset=(0, 20), blur=30, color=(0, 0, 0, 140)):
    shadow = Image.new("RGBA", base_img.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    x1, y1, x2, y2 = box_rect
    ox, oy = offset
    shadow_draw.rounded_rectangle((x1 + ox, y1 + oy, x2 + ox, y2 + oy), radius=radius, fill=color)
    shadow = shadow.filter(ImageFilter.GaussianBlur(blur))
    base_img.alpha_composite(shadow)

# =========================================================================
# MOCKUP 2: LIVE GPS TRACKING SCREEN (1200x1200)
# =========================================================================
def generate_mockup_2():
    print("Generating Mockup 2: Live GPS Tracking...")
    canvas = Image.new("RGBA", (1200, 1200), C_BG_DARK)
    
    # Ambient radial gradient in background
    glow = Image.new("RGBA", (1200, 1200), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((350, 250, 850, 750), fill=(255, 94, 0, 35))
    glow = glow.filter(ImageFilter.GaussianBlur(90))
    canvas.alpha_composite(glow)
    
    draw = ImageDraw.Draw(canvas)
    
    # Header Branding
    draw.text((600, 70), "CURRYCRAFT MOBILE APP", fill=C_PRIMARY, font=get_font(18, True), anchor="mm")
    draw.text((600, 115), "Live Real-Time GPS Delivery Tracking", fill=C_WHITE, font=get_font(34, True), anchor="mm")
    draw.text((600, 155), "Native Apple & Google Maps  *  SSE Telemetry  *  Sub-second Bearing Interpolation", fill=C_MUTED, font=get_font(16, False), anchor="mm")
    
    # Phone Chassis Specs
    pw, ph = 460, 910
    px, py = (1200 - pw) // 2, 215
    phone_rect = (px, py, px + pw, py + ph)
    
    # Phone Drop Shadow
    add_drop_shadow(canvas, phone_rect, radius=50, offset=(0, 30), blur=40, color=(0, 0, 0, 180))
    
    # Phone Outer Bezel
    draw.rounded_rectangle(phone_rect, radius=50, fill=(35, 30, 28), outline=(65, 55, 50), width=3)
    
    # Phone Screen Area
    sw, sh = pw - 24, ph - 24
    sx, sy = px + 12, py + 12
    screen = Image.new("RGBA", (sw, sh), (20, 24, 28))
    s_draw = ImageDraw.Draw(screen)
    
    # Styled Map Grid Background on Phone Screen
    for x in range(0, sw, 48):
        s_draw.line([(x, 0), (x, sh)], fill=(32, 38, 44), width=1)
    for y in range(0, sh, 48):
        s_draw.line([(0, y), (sw, y)], fill=(32, 38, 44), width=1)
        
    # Roads & Map Features
    roads = [
        [(40, 120), (120, 180), (180, 320), (220, 480), (360, 560)],
        [(80, 500), (200, 480), (320, 420), (400, 380)],
        [(150, 50), (260, 180), (280, 360), (380, 500)],
        [(40, 350), (180, 320), (350, 260), (410, 220)]
    ]
    for r in roads:
        s_draw.line(r, fill=(45, 55, 65), width=7)
    
    # Glowing Delivery Route Polyline
    route_points = [(100, 220), (180, 320), (220, 430), (340, 490)]
    s_draw.line(route_points, fill=(255, 94, 0, 80), width=12)
    s_draw.line(route_points, fill=C_PRIMARY, width=5)
    
    # Origin Restaurant Pin
    s_draw.ellipse((90, 210, 110, 230), fill=(26, 19, 17), outline=C_WHITE, width=2)
    s_draw.text((100, 220), "K", fill=C_WHITE, font=get_font(11, True), anchor="mm")
    
    # Destination Home Pin
    s_draw.ellipse((330, 480, 350, 500), fill=C_ACCENT_GREEN, outline=C_WHITE, width=2)
    s_draw.text((340, 490), "H", fill=C_WHITE, font=get_font(11, True), anchor="mm")
    
    # Courier Vehicle Marker with Bearing Aura
    s_draw.ellipse((200, 410, 240, 450), fill=(255, 94, 0, 70))
    s_draw.ellipse((208, 418, 232, 442), fill=C_PRIMARY, outline=C_WHITE, width=2)
    s_draw.polygon([(220, 422), (228, 436), (220, 432), (212, 436)], fill=C_WHITE)
    
    # Dynamic Island / Camera Notch
    s_draw.rounded_rectangle(((sw - 110) // 2, 10, (sw + 110) // 2, 34), radius=12, fill=(10, 8, 8))
    s_draw.ellipse(((sw + 65) // 2, 17, (sw + 85) // 2, 27), fill=(25, 25, 30))
    
    # Floating Top Header in Screen
    s_draw.rounded_rectangle((16, 50, sw - 16, 102), radius=18, fill=(255, 255, 255, 240))
    s_draw.ellipse((32, 70, 44, 82), fill=(220, 252, 231))
    s_draw.ellipse((35, 73, 41, 79), fill=C_ACCENT_GREEN)
    s_draw.text((54, 67), "Order #CC-54095", fill=(26, 19, 17), font=get_font(14, True))
    s_draw.text((54, 85), "Live Courier Telemetry (34 km/h)", fill=C_PRIMARY, font=get_font(11, True))
    
    # ETA Pill in Top Header
    s_draw.rounded_rectangle((sw - 105, 62, sw - 28, 90), radius=14, fill=C_PRIMARY)
    s_draw.text((sw - 66, 76), "18 MINS", fill=C_WHITE, font=get_font(12, True), anchor="mm")
    
    # Floating Bottom Status Sheet
    sheet_y = sh - 285
    s_draw.rounded_rectangle((12, sheet_y, sw - 12, sh - 14), radius=26, fill=(255, 255, 255, 250), outline=(230, 225, 220), width=1)
    
    # Sheet Handle Bar
    s_draw.rounded_rectangle(((sw - 40) // 2, sheet_y + 10, (sw + 40) // 2, sheet_y + 14), radius=2, fill=(200, 195, 190))
    
    # Status text
    s_draw.text((26, sheet_y + 30), "En Route to Your Doorstep", fill=(26, 19, 17), font=get_font(17, True))
    s_draw.text((26, sheet_y + 54), "Order prepared & tamper-sealed with clay handi foil", fill=(110, 100, 95), font=get_font(11, False))
    
    # Progress Bar
    s_draw.rounded_rectangle((26, sheet_y + 76, sw - 26, sheet_y + 82), radius=3, fill=(240, 235, 230))
    s_draw.rounded_rectangle((26, sheet_y + 76, 26 + int((sw - 52) * 0.72), sheet_y + 82), radius=3, fill=C_PRIMARY)
    
    # Rider Profile Card Inside Sheet
    rider_y = sheet_y + 96
    s_draw.rounded_rectangle((24, rider_y, sw - 24, rider_y + 76), radius=18, fill=(250, 247, 243), outline=(232, 228, 223), width=1)
    
    # Rider Photo Avatar
    rider_avatar_path = os.path.join(IMAGES_DIR, "delivery-rider.jpg")
    if os.path.exists(rider_avatar_path):
        r_avatar = draw_circle_avatar(rider_avatar_path, 48)
        screen.paste(r_avatar, (36, rider_y + 14), r_avatar)
    
    s_draw.text((94, rider_y + 22), "Vikram Sen", fill=(26, 19, 17), font=get_font(14, True))
    s_draw.text((94, rider_y + 42), "KA-01-EQ-4021  *  4.95 ★", fill=C_PRIMARY, font=get_font(11, True))
    
    # Call Button
    s_draw.rounded_rectangle((sw - 95, rider_y + 20, sw - 36, rider_y + 56), radius=18, fill=C_PRIMARY)
    s_draw.text((sw - 65, rider_y + 38), "CALL", fill=C_WHITE, font=get_font(12, True), anchor="mm")
    
    # Tamper Seal Badge
    s_draw.rounded_rectangle((24, sheet_y + 185, sw - 24, sheet_y + 225), radius=12, fill=(240, 253, 244))
    s_draw.text((sw // 2, sheet_y + 205), "🔒 100% Clay Handi Tamper-Proof Sealed", fill=(21, 128, 61), font=get_font(11, True), anchor="mm")
    
    # Paste Screen onto Phone
    canvas.paste(screen, (sx, sy))
    
    # Feature Badges flanking the phone
    badge_left = Image.new("RGBA", (280, 110), (28, 22, 19, 230))
    b_draw = ImageDraw.Draw(badge_left)
    b_draw.rounded_rectangle((0, 0, 280, 110), radius=20, fill=(28, 22, 19, 230), outline=C_BORDER, width=2)
    b_draw.text((20, 20), "⚡ 60fps Worklets", fill=C_PRIMARY, font=get_font(16, True))
    b_draw.text((20, 48), "Reanimated Gesture Handlers", fill=C_WHITE, font=get_font(14, True))
    b_draw.text((20, 72), "Runs on UI thread seamlessly", fill=C_MUTED, font=get_font(12, False))
    add_drop_shadow(canvas, (60, 420, 340, 530), radius=20, offset=(0, 15), blur=25)
    canvas.paste(badge_left, (60, 420), badge_left)
    
    badge_right = Image.new("RGBA", (280, 110), (28, 22, 19, 230))
    b_draw2 = ImageDraw.Draw(badge_right)
    b_draw2.rounded_rectangle((0, 0, 280, 110), radius=20, fill=(28, 22, 19, 230), outline=C_BORDER, width=2)
    b_draw2.text((20, 20), "🛰️ Real-Time Telemetry", fill=C_ACCENT_GREEN, font=get_font(16, True))
    b_draw2.text((20, 48), "Live SSE Stream", fill=C_WHITE, font=get_font(14, True))
    b_draw2.text((20, 72), "Bearing rotation & auto-reconnect", fill=C_MUTED, font=get_font(12, False))
    add_drop_shadow(canvas, (860, 420, 1140, 530), radius=20, offset=(0, 15), blur=25)
    canvas.paste(badge_right, (860, 420), badge_right)
    
    # Footer Branding
    draw.text((600, 1160), "CurryCraft Ecosystem  •  React Native  •  Expo SDK 52+  •  Zustand  •  NativeWind", fill=(110, 95, 88), font=get_font(13, True), anchor="mm")
    
    out_path = os.path.join(MOCKUPS_DIR, "mockup_2_live_gps_tracking.png")
    canvas.save(out_path, "PNG")
    print(f"Saved: {out_path}")

# =========================================================================
# MOCKUP 3: NEXT.JS WEB STOREFRONT & CUSTOMER PORTAL (1200x1200)
# =========================================================================
def generate_mockup_3():
    print("Generating Mockup 3: Next.js Web Storefront...")
    canvas = Image.new("RGBA", (1200, 1200), C_BG_DARK)
    
    # Ambient warm glow
    glow = Image.new("RGBA", (1200, 1200), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((300, 200, 900, 700), fill=(255, 94, 0, 40))
    glow = glow.filter(ImageFilter.GaussianBlur(100))
    canvas.alpha_composite(glow)
    
    draw = ImageDraw.Draw(canvas)
    
    # Header Branding
    draw.text((600, 70), "NEXT.JS 15 APP ROUTER STOREFRONT", fill=C_PRIMARY, font=get_font(18, True), anchor="mm")
    draw.text((600, 115), "CurryCraft Web Experience & Portal", fill=C_WHITE, font=get_font(34, True), anchor="mm")
    draw.text((600, 155), "SSR & Turbopack  *  GSAP Drag-and-Drop  *  Leaflet Radar  *  Tailwind CSS", fill=C_MUTED, font=get_font(16, False), anchor="mm")
    
    # Laptop Display Specs
    lw, lh = 940, 590
    lx, ly = (1200 - lw) // 2, 230
    laptop_rect = (lx, ly, lx + lw, ly + lh)
    
    # Laptop Drop Shadow
    add_drop_shadow(canvas, laptop_rect, radius=24, offset=(0, 30), blur=45, color=(0, 0, 0, 190))
    
    # Laptop Outer Screen Bezel
    draw.rounded_rectangle(laptop_rect, radius=24, fill=(28, 22, 20), outline=(65, 55, 50), width=3)
    
    # Laptop Screen Area
    sw, sh = lw - 24, lh - 24
    sx, sy = lx + 12, ly + 12
    screen = Image.new("RGBA", (sw, sh), C_CREAM)
    s_draw = ImageDraw.Draw(screen)
    
    # Browser Tab & Address Bar
    s_draw.rectangle((0, 0, sw, 38), fill=(242, 238, 232))
    s_draw.line([(0, 38), (sw, 38)], fill=(225, 220, 212), width=1)
    # Window dots
    s_draw.ellipse((14, 13, 24, 23), fill=(239, 68, 68))
    s_draw.ellipse((32, 13, 42, 23), fill=(245, 158, 11))
    s_draw.ellipse((50, 13, 60, 23), fill=(34, 197, 94))
    # URL pill
    s_draw.rounded_rectangle((100, 7, sw - 120, 31), radius=8, fill=C_WHITE, outline=(220, 215, 208))
    s_draw.text((120, 19), "🔒 https://currycraft.in — Royal Indian Cuisine & Dum Biryani", fill=(100, 90, 85), font=get_font(11, False), anchor="lm")
    
    # Web App Navbar
    s_draw.rectangle((0, 38, sw, 88), fill=C_WHITE)
    s_draw.line([(0, 88), (sw, 88)], fill=(232, 229, 224), width=1)
    s_draw.text((36, 63), "🍛 CurryCraft", fill=C_PRIMARY, font=get_font(18, True), anchor="lm")
    
    # Nav links
    nav_links = ["Home", "Shop & Menu", "Special Offers", "Customer Portal", "Admin Dashboard"]
    nx = 210
    for idx, nl in enumerate(nav_links):
        color = C_PRIMARY if idx == 0 else (70, 60, 55)
        s_draw.text((nx, 63), nl, fill=color, font=get_font(12, idx == 0), anchor="lm")
        nx += 125
        
    # Cart Bag Button in Navbar
    s_draw.rounded_rectangle((sw - 110, 48, sw - 36, 78), radius=10, fill=(255, 243, 235), outline=C_PRIMARY, width=1)
    s_draw.text((sw - 73, 63), "Bag (3)", fill=C_PRIMARY, font=get_font(12, True), anchor="mm")
    
    # Hero Section in Screen
    # Left Hero Text
    s_draw.text((46, 128), "🔥 50% OFF WITH PROMO: ROYAL50", fill=C_PRIMARY, font=get_font(11, True))
    s_draw.text((46, 158), "Dum Biryani &\nRoyal Curries", fill=(26, 19, 17), font=get_font(28, True))
    s_draw.text((46, 235), "Slow-simmered handis, melt-in-mouth aloo, and tender chicken\nlayered with fragrant saffron basmati rice.", fill=(110, 100, 95), font=get_font(12, False))
    
    # Hero CTAs
    s_draw.rounded_rectangle((46, 280, 170, 318), radius=12, fill=C_PRIMARY)
    s_draw.text((108, 299), "Order Online", fill=C_WHITE, font=get_font(13, True), anchor="mm")
    
    s_draw.rounded_rectangle((185, 280, 295, 318), radius=12, fill=C_WHITE, outline=(220, 215, 208))
    s_draw.text((240, 299), "Explore Menu", fill=(26, 19, 17), font=get_font(13, True), anchor="mm")
    
    # Right Hero Image (Authentic Royal Feast)
    feast_path = os.path.join(IMAGES_DIR, "hero-indian-feast.jpg")
    if os.path.exists(feast_path):
        feast_img = draw_rounded_image(feast_path, 390, 230, radius=20)
        screen.paste(feast_img, (sw - 425, 108), feast_img)
        # Rating badge over image
        s_draw.rounded_rectangle((sw - 410, 120, sw - 280, 156), radius=10, fill=(255, 255, 255, 230))
        s_draw.text((sw - 345, 138), "⭐ 4.9 (5k+ Reviews)", fill=(26, 19, 17), font=get_font(11, True), anchor="mm")
    
    # Horizontal Dish Cards Row
    s_draw.line([(30, 345), (sw - 30, 345)], fill=(235, 230, 222), width=1)
    s_draw.text((36, 362), "Signature Indian Delicacies", fill=(26, 19, 17), font=get_font(15, True))
    
    cards_data = [
        ("kolkata-biryani.jpg", "Kolkata Chicken Biryani", "Biryani * 25 mins", "Rs. 380"),
        ("classic-dal-sambar.jpg", "Classic Dal Sambar", "Curries * 15 mins", "Rs. 190"),
        ("paneer-butter-masala.jpg", "Paneer Butter Masala", "Curries * 20 mins", "Rs. 320"),
        ("butter-garlic-naan.jpg", "Butter Garlic Naan", "Breads * 10 mins", "Rs. 120")
    ]
    
    card_w = (sw - 72 - 36) // 4
    for i, (c_img, c_name, c_sub, c_price) in enumerate(cards_data):
        cx = 36 + i * (card_w + 12)
        cy = 388
        s_draw.rounded_rectangle((cx, cy, cx + card_w, cy + 160), radius=14, fill=C_WHITE, outline=(230, 225, 218))
        c_path = os.path.join(IMAGES_DIR, c_img)
        if os.path.exists(c_path):
            thumb = draw_rounded_image(c_path, card_w - 16, 80, radius=10)
            screen.paste(thumb, (cx + 8, cy + 8), thumb)
        s_draw.text((cx + 10, cy + 98), c_name, fill=(26, 19, 17), font=get_font(11, True))
        s_draw.text((cx + 10, cy + 116), c_sub, fill=(130, 120, 115), font=get_font(9, False))
        s_draw.text((cx + 10, cy + 138), c_price, fill=C_PRIMARY, font=get_font(12, True))
        # Add button
        s_draw.rounded_rectangle((cx + card_w - 40, cy + 128, cx + card_w - 10, cy + 150), radius=6, fill=C_PRIMARY)
        s_draw.text((cx + card_w - 25, cy + 139), "+ Add", fill=C_WHITE, font=get_font(9, True), anchor="mm")
    
    # Paste Screen onto Laptop
    canvas.paste(screen, (sx, sy))
    
    # Laptop Base Specs
    bx1, by1 = lx - 40, ly + lh
    bx2, by2 = lx + lw + 40, ly + lh + 24
    draw.rounded_rectangle((bx1, by1, bx2, by2), radius=12, fill=(45, 38, 35), outline=(75, 65, 60), width=2)
    # Trackpad notch
    draw.rounded_rectangle(((1200 - 130) // 2, by1, (1200 + 130) // 2, by1 + 6), radius=3, fill=(75, 65, 60))
    
    # Bottom Feature Highlights
    draw.text((600, 920), "Key Architectural Highlights", fill=C_PRIMARY, font=get_font(18, True), anchor="mm")
    
    pills = [
        "🚀 Turbopack 1.2s Build",
        "🎯 GSAP 60fps Drag-to-Cart",
        "🗺️ Leaflet Live Tracking",
        "🛡️ Strict Zod Validation",
        "👥 Admin Kitchen Portal"
    ]
    total_pill_w = len(pills) * 190
    px_start = (1200 - total_pill_w) // 2
    for idx, p in enumerate(pills):
        px = px_start + idx * 190
        draw.rounded_rectangle((px, 955, px + 175, 995), radius=14, fill=C_SURFACE, outline=C_BORDER, width=1)
        draw.text((px + 87, 975), p, fill=C_WHITE, font=get_font(11, True), anchor="mm")
        
    draw.text((600, 1160), "CurryCraft Modern Web Ecosystem  •  Next.js 15  •  React 19  •  Zustand  •  Tailwind CSS", fill=(110, 95, 88), font=get_font(13, True), anchor="mm")
    
    out_path = os.path.join(MOCKUPS_DIR, "mockup_3_web_storefront.png")
    canvas.save(out_path, "PNG")
    print(f"Saved: {out_path}")

# =========================================================================
# MOCKUP 4: CROSS-PLATFORM ECOSYSTEM & ARCHITECTURE (1200x1200)
# =========================================================================
def generate_mockup_4():
    print("Generating Mockup 4: Cross-Platform Ecosystem...")
    canvas = Image.new("RGBA", (1200, 1200), C_BG_DARK)
    
    # Ambient dual glow
    glow = Image.new("RGBA", (1200, 1200), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse((200, 300, 650, 750), fill=(255, 94, 0, 45))
    g_draw.ellipse((600, 300, 1050, 750), fill=(22, 163, 74, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(110))
    canvas.alpha_composite(glow)
    
    draw = ImageDraw.Draw(canvas)
    
    # Main Headline
    draw.text((600, 65), "FULL-STACK CROSS-PLATFORM ECOSYSTEM", fill=C_PRIMARY, font=get_font(18, True), anchor="mm")
    draw.text((600, 110), "Next.js 15 Web & Expo Mobile", fill=C_WHITE, font=get_font(36, True), anchor="mm")
    draw.text((600, 150), "Shared Domain Types  *  Zustand Global State  *  Real-Time SSE GPS Telemetry", fill=C_MUTED, font=get_font(16, False), anchor="mm")
    
    # Left: Web App Laptop Mockup (Scale down to fit side-by-side)
    lw, lh = 620, 390
    lx, ly = 70, 230
    add_drop_shadow(canvas, (lx, ly, lx + lw, ly + lh), radius=20, offset=(0, 25), blur=35)
    draw.rounded_rectangle((lx, ly, lx + lw, ly + lh), radius=20, fill=(28, 22, 20), outline=(65, 55, 50), width=2)
    
    # Laptop Screen
    l_screen = Image.new("RGBA", (lw - 20, lh - 20), C_CREAM)
    ls_draw = ImageDraw.Draw(l_screen)
    ls_draw.rectangle((0, 0, lw - 20, 30), fill=(240, 235, 230))
    ls_draw.ellipse((10, 10, 18, 18), fill=(239, 68, 68))
    ls_draw.ellipse((24, 10, 32, 18), fill=(245, 158, 11))
    ls_draw.ellipse((38, 10, 46, 18), fill=(34, 197, 94))
    ls_draw.text((lw // 2 - 10, 15), "currycraft.in/portal — Web Storefront", fill=(100, 90, 85), font=get_font(10, True), anchor="mm")
    
    # Web Screen Content
    feast_path = os.path.join(IMAGES_DIR, "hero-indian-feast.jpg")
    if os.path.exists(feast_path):
        f_thumb = draw_rounded_image(feast_path, lw - 40, 180, radius=12)
        l_screen.paste(f_thumb, (10, 40), f_thumb)
        
    ls_draw.text((20, 235), "CurryCraft Web Storefront", fill=(26, 19, 17), font=get_font(16, True))
    ls_draw.text((20, 260), "Interactive GSAP drag-to-cart, Live Leaflet radar,", fill=(110, 100, 95), font=get_font(11, False))
    ls_draw.text((20, 278), "and complete customer/admin portal dashboards.", fill=(110, 100, 95), font=get_font(11, False))
    
    # Laptop Base
    canvas.paste(l_screen, (lx + 10, ly + 10))
    draw.rounded_rectangle((lx - 25, ly + lh, lx + lw + 25, ly + lh + 16), radius=8, fill=(45, 38, 35))
    
    # Right: Mobile App Smartphone Mockup
    pw, ph = 360, 710
    px, py = 760, 200
    add_drop_shadow(canvas, (px, py, px + pw, py + ph), radius=45, offset=(0, 25), blur=40)
    draw.rounded_rectangle((px, py, px + pw, py + ph), radius=45, fill=(35, 30, 28), outline=(65, 55, 50), width=3)
    
    # Mobile Screen
    m_screen = Image.new("RGBA", (pw - 20, ph - 20), (25, 20, 18))
    ms_draw = ImageDraw.Draw(m_screen)
    
    # Mobile Notch
    ms_draw.rounded_rectangle(((pw - 100) // 2, 8, (pw + 100) // 2, 28), radius=10, fill=(10, 8, 8))
    
    # Mobile Content
    ms_draw.text((20, 44), "CurryCraft Mobile", fill=C_PRIMARY, font=get_font(16, True))
    ms_draw.text((20, 68), "Kolkata Dum Biryani", fill=C_WHITE, font=get_font(20, True))
    
    b_path = os.path.join(IMAGES_DIR, "kolkata-biryani.jpg")
    if os.path.exists(b_path):
        b_thumb = draw_rounded_image(b_path, pw - 60, 220, radius=20)
        m_screen.paste(b_thumb, (20, 102), b_thumb)
        
    ms_draw.text((20, 340), "Fragrant aged basmati rice slow-cooked", fill=C_MUTED, font=get_font(11, False))
    ms_draw.text((20, 360), "with chicken, golden potato & farm egg.", fill=C_MUTED, font=get_font(11, False))
    ms_draw.text((20, 395), "₹380", fill=C_PRIMARY, font=get_font(22, True))
    
    # Drag to bag dock
    ms_draw.rounded_rectangle((20, 440, pw - 40, 505), radius=16, fill=(255, 94, 0, 30), outline=C_PRIMARY, width=1)
    ms_draw.text((pw // 2 - 10, 462), "👇 Drag Card to Add to Bag", fill=C_PRIMARY, font=get_font(12, True), anchor="mm")
    ms_draw.text((pw // 2 - 10, 485), "60fps Reanimated UI Worklet", fill=C_WHITE, font=get_font(10, False), anchor="mm")
    
    # Bottom Cart Zone
    ms_draw.rounded_rectangle((16, ph - 90, pw - 36, ph - 34), radius=18, fill=C_PRIMARY)
    ms_draw.text((pw // 2 - 10, ph - 62), "🛍️ View Food Bag (2 items)", fill=C_WHITE, font=get_font(14, True), anchor="mm")
    
    canvas.paste(m_screen, (px + 10, py + 10))
    
    # 4 Pillar Engineering Architecture Cards at Bottom
    arch_cards = [
        ("📱 React Native & Expo", "SDK 52+ / 57 File-Based Router, Strict TypeScript, NativeWind"),
        ("⚡ 60fps Native Gestures", "Reanimated Worklets, Zero vertical scroll locking, Drag-to-Cart"),
        ("🗺️ Live GPS Telemetry", "react-native-maps, SSE stream, Interpolated Bearing Rotation"),
        ("🛡️ Enterprise Next.js 15", "Turbopack 1.2s build, Zod Schemas, SecureStore, Role-Based Access")
    ]
    
    cx_start = 70
    cw = (1200 - 140 - 36) // 4
    for i, (title, desc) in enumerate(arch_cards):
        card_x = cx_start + i * (cw + 12)
        card_y = 960
        draw.rounded_rectangle((card_x, card_y, card_x + cw, card_y + 140), radius=16, fill=C_SURFACE, outline=C_BORDER, width=1)
        draw.text((card_x + 14, card_y + 20), title, fill=C_PRIMARY, font=get_font(12, True))
        
        # Word wrap description
        words = desc.split(" ")
        lines = []
        curr = ""
        for w in words:
            if len(curr + " " + w) > 24:
                lines.append(curr)
                curr = w
            else:
                curr = curr + " " + w if curr else w
        if curr:
            lines.append(curr)
            
        ly_offset = card_y + 48
        for l in lines[:4]:
            draw.text((card_x + 14, ly_offset), l, fill=C_MUTED, font=get_font(11, False))
            ly_offset += 18
            
    draw.text((600, 1160), "CurryCraft Ecosystem  •  Unified Web & Mobile Architecture  •  Production-Ready", fill=(110, 95, 88), font=get_font(13, True), anchor="mm")
    
    out_path = os.path.join(MOCKUPS_DIR, "mockup_4_cross_platform_ecosystem.png")
    canvas.save(out_path, "PNG")
    print(f"Saved: {out_path}")

if __name__ == "__main__":
    generate_mockup_2()
    generate_mockup_3()
    generate_mockup_4()
    print("All LinkedIn mockups generated successfully in:", MOCKUPS_DIR)
