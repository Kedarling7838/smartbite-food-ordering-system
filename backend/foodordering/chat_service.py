
import re
import random
import datetime
from difflib import get_close_matches
from .models import Food

ROUTES = {
    "home": "/",
    "menu": "/food-menu",
    "cart": "/cart",
    "login": "/login",
    "register": "/register",
    "admin": "/admin-login",
    "wishlist": "/wishlist",
    "track": "/track-order"
}

greetings = [
    "Hi! I'm SmartBite Assistant 👋 How can I help you today?",
    "Welcome to SmartBite 🍕 What would you like today?",
    "Hey there 😄 Ready to order delicious food?",
    "Hello 👋 SmartBite is ready to serve you.",
    "Hi 😊 Looking for something tasty today?"
]

farewell_messages = [
    "👋 Thanks for visiting SmartBite.",
    "😊 Have a delicious day.",
    "🍔 Hope to see you again soon.",
    "✨ SmartBite wishes you a great meal.",
    "💖 Goodbye and enjoy your food."
]

offer_messages = [
    "🔥 Today's combo deals are live.",
    "🎉 Burger combos have discounts today.",
    "💥 Pizza offers are available now.",
    "🍕 Buy 1 Get 1 available on selected foods.",
    "😋 Combo meals are trending right now."
]

healthy_responses = [
    "🥗 Veg Sandwich is a healthy option.",
    "🌱 Idli and Dosa are light meals.",
    "💪 Healthy veg meals are available.",
    "🥙 Fresh foods are recommended today.",
    "🍲 Balanced meals are available in menu."
]

rainy_responses = [
    "☔ Hot noodles are perfect for rainy weather.",
    "🌧️ Tea and Masala Dosa make a great combo.",
    "🍜 Soup and Manchurian are trending today.",
    "🔥 Fried Rice tastes amazing during rain.",
    "😋 Hot snacks are popular right now."
]

spicy_keywords = [
    "spicy", "hot", "masala", "manchurian", "fried"
]

veg_keywords = [
    "veg", "vegetarian", "healthy", "green"
]

payment_keywords = [
    "upi", "payment", "card", "cod", "cash"
]

support_keywords = [
    "help", "support", "contact", "issue", "problem"
]

track_keywords = [
    "track", "order status", "where is my order"
]

login_keywords = [
    "login", "signin", "sign in"
]

register_keywords = [
    "register", "signup", "create account"
]

cart_keywords = [
    "cart", "basket", "bag"
]

wishlist_keywords = [
    "wishlist", "favorite", "liked"
]

menu_keywords = [
    "menu", "foods", "food items", "show menu"
]

home_keywords = [
    "home", "homepage"
]

admin_keywords = [
    "admin", "dashboard"
]

recommend_keywords = [
    "hungry", "recommend", "suggest", "eat"
]

cheap_keywords = [
    "cheap", "budget", "under 100", "low price"
]

premium_keywords = [
    "premium", "expensive", "costly", "luxury"
]

thanks_keywords = [
    "thanks", "thank you"
]

bye_keywords = [
    "bye", "goodbye", "see you"
]

def format_foods(foods):
    result = []

    for food in foods:
        result.append(
            f"{food.item_name} - ₹{food.item_price}"
        )

    return result


def random_foods(limit=5):
    return Food.objects.order_by('?')[:limit]


def get_budget_foods():
    return Food.objects.filter(item_price__lte=100)[:6]


def get_premium_foods():
    return Food.objects.order_by('-item_price')[:6]


def get_veg_foods():
    return Food.objects.filter(item_name__icontains='veg')[:6]


def get_spicy_foods():
    return Food.objects.filter(
        item_name__iregex=r'noodles|fried|biryani|manchurian'
    )[:6]


def greeting_response():
    return {
        "reply": random.choice(greetings)
    }


def goodbye_response():
    return {
        "reply": random.choice(farewell_messages)
    }


def offers_response():
    return {
        "reply": random.choice(offer_messages)
    }


def menu_response():
    foods = Food.objects.all()[:8]

    return {
        "reply": "📋 Here are some menu items.",
        "items": format_foods(foods),
        "route": ROUTES['menu']
    }


def cart_response():
    return {
        "reply": "🛒 Opening your cart.",
        "route": ROUTES['cart']
    }


def login_response():
    return {
        "reply": "🔐 Redirecting to login.",
        "route": ROUTES['login']
    }


def register_response():
    return {
        "reply": "📝 Opening registration page.",
        "route": ROUTES['register']
    }


def wishlist_response():
    return {
        "reply": "❤️ Opening your wishlist.",
        "route": ROUTES['wishlist']
    }


def admin_response():
    return {
        "reply": "⚙️ Opening admin login.",
        "route": ROUTES['admin']
    }


def home_response():
    return {
        "reply": "🏠 Redirecting to home page.",
        "route": ROUTES['home']
    }


def support_response():
    return {
        "reply": "☎️ SmartBite support is available for your help."
    }


def payment_response():
    return {
        "reply": "💳 We support UPI, Debit Card, Credit Card and Cash on Delivery."
    }


def delivery_response():
    return {
        "reply": "🚚 Delivery usually takes 30 to 45 minutes."
    }


def healthy_response():
    return {
        "reply": random.choice(healthy_responses)
    }


def rainy_response():
    return {
        "reply": random.choice(rainy_responses)
    }


def recommendation_response():
    foods = random_foods()

    return {
        "reply": "😋 Here are some tasty recommendations for you.",
        "items": format_foods(foods)
    }


def cheap_food_response():
    foods = get_budget_foods()

    return {
        "reply": "💰 Budget-friendly foods available.",
        "items": format_foods(foods)
    }


def premium_food_response():
    foods = get_premium_foods()

    return {
        "reply": "👑 Premium foods available.",
        "items": format_foods(foods)
    }


def spicy_food_response():
    foods = get_spicy_foods()

    return {
        "reply": "🔥 Spicy foods trending now.",
        "items": format_foods(foods)
    }


def veg_food_response():
    foods = get_veg_foods()

    return {
        "reply": "🥗 Veg foods available.",
        "items": format_foods(foods)
    }


def app_info_response():
    return {
        "reply": "📱 SmartBite is a food ordering application where users can browse menu items, place orders, track deliveries and manage wishlists."
    }


def search_food(message):
    foods = Food.objects.all()

    names = []

    for food in foods:
        names.append(food.item_name.lower())

    matches = get_close_matches(message.lower(), names, n=5, cutoff=0.3)

    matched_foods = []

    for food in foods:
        if food.item_name.lower() in matches:
            matched_foods.append(food)

    return matched_foods


def search_food_response(message):
    foods = search_food(message)

    if foods:
        return {
            "reply": "🍽️ Matching foods found.",
            "items": format_foods(foods)
        }

    return None


def track_order_response(message):
    order_match = re.search(r'\bORD\d+\b', message.upper())

    if order_match:
        order_number = order_match.group()

        return {
            "reply": f"📦 Tracking order {order_number}",
            "route": f"/track-order/{order_number}"
        }

    return {
        "reply": "Please provide order number like ORD12345."
    }


def thank_you_response():
    return {
        "reply": "😊 You're welcome. Enjoy your meal with SmartBite."
    }


def fallback_response():
    foods = random_foods(4)

    return {
        "reply": "🤖 I can help you with menu, orders, food recommendations, payments and delivery.",
        "items": format_foods(foods)
    }


def contains_keywords(message, keywords):
    for keyword in keywords:
        if keyword in message:
            return True

    return False


def chatbot_logic(message, session):
    msg = message.lower().strip()

    if contains_keywords(msg, ['hi', 'hello', 'hey']):
        return greeting_response()

    if contains_keywords(msg, menu_keywords):
        return menu_response()

    if contains_keywords(msg, cart_keywords):
        return cart_response()

    if contains_keywords(msg, login_keywords):
        return login_response()

    if contains_keywords(msg, register_keywords):
        return register_response()

    if contains_keywords(msg, wishlist_keywords):
        return wishlist_response()

    if contains_keywords(msg, admin_keywords):
        return admin_response()

    if contains_keywords(msg, home_keywords):
        return home_response()

    if contains_keywords(msg, support_keywords):
        return support_response()

    if contains_keywords(msg, payment_keywords):
        return payment_response()

    if contains_keywords(msg, track_keywords):
        return track_order_response(msg)

    if contains_keywords(msg, ['delivery', 'time', 'late']):
        return delivery_response()

    if contains_keywords(msg, ['healthy', 'diet', 'light']):
        return healthy_response()

    if contains_keywords(msg, ['rain', 'weather', 'cold']):
        return rainy_response()

    if contains_keywords(msg, ['offer', 'discount', 'coupon', 'deal']):
        return offers_response()

    if contains_keywords(msg, recommend_keywords):
        return recommendation_response()

    if contains_keywords(msg, cheap_keywords):
        return cheap_food_response()

    if contains_keywords(msg, premium_keywords):
        return premium_food_response()

    if contains_keywords(msg, spicy_keywords):
        return spicy_food_response()

    if contains_keywords(msg, veg_keywords):
        return veg_food_response()

    if contains_keywords(msg, ['app', 'application', 'smartbite']):
        return app_info_response()

    if contains_keywords(msg, thanks_keywords):
        return thank_you_response()

    if contains_keywords(msg, bye_keywords):
        return goodbye_response()

    food_response = search_food_response(msg)

    if food_response:
        return food_response

    return fallback_response()

# Advanced AI-like Features

# User mood analysis
mood_keywords = {
    'happy': ['happy', 'excited', 'great'],
    'sad': ['sad', 'upset', 'bad mood'],
    'angry': ['angry', 'annoyed', 'frustrated']
}

# Time based recommendations
breakfast_items = ['Idli', 'Dosa', 'Sandwich']
lunch_items = ['Veg Biryani', 'Fried Rice', 'Paneer Butter Masala']
dinner_items = ['Pizza', 'Burger', 'Noodles']

# Smart context memory simulation
user_context = {
    'last_category': None,
    'last_food': None,
    'last_action': None
}

# Personalized replies
personalized_replies = {
    'pizza': '🍕 Pizza lovers usually enjoy our combo meals too.',
    'burger': '🍔 Burgers are trending today with fries combos.',
    'dosa': '🥞 Dosa is one of the healthiest and most popular items.'
}

# Dynamic chatbot personality
bot_personality = [
    'friendly',
    'smart',
    'helpful',
    'fast',
    'interactive'
]

# Emotion-based responses
emotion_responses = {
    'happy': '😊 Glad to hear that. Let’s find something delicious for you.',
    'sad': '🍫 Comfort food might help. Want dessert recommendations?',
    'angry': '🙏 Sorry for the inconvenience. I’ll try to help quickly.'
}

# Advanced AI-like recommendation engine

def advanced_recommendation_engine(message):
    msg = message.lower()

    if 'pizza' in msg:
        foods = Food.objects.filter(item_name__icontains='pizza')[:5]
        return {
            'reply': personalized_replies['pizza'],
            'items': format_foods(foods)
        }

    if 'burger' in msg:
        foods = Food.objects.filter(item_name__icontains='burger')[:5]
        return {
            'reply': personalized_replies['burger'],
            'items': format_foods(foods)
        }

    if 'dosa' in msg:
        foods = Food.objects.filter(item_name__icontains='dosa')[:5]
        return {
            'reply': personalized_replies['dosa'],
            'items': format_foods(foods)
        }

    return None

# Smart time-based suggestion system

def time_based_recommendations():
    current_hour = datetime.datetime.now().hour

    if current_hour < 11:
        return {
            'reply': '☀️ Breakfast specials available now.',
            'items': breakfast_items
        }

    if current_hour < 17:
        return {
            'reply': '🍛 Lunch recommendations for you.',
            'items': lunch_items
        }

    return {
        'reply': '🌙 Dinner specials trending now.',
        'items': dinner_items
    }

# Smart FAQ system
faq_answers = {
    'delivery charges': '🚚 Delivery charges depend on distance and offers.',
    'minimum order': '🛒 Minimum order may vary based on location.',
    'refund': '💰 Refunds are processed within a few business days.',
    'cancel order': '❌ Orders can be cancelled before preparation starts.',
    'working hours': '⏰ SmartBite operates throughout the day.',
    'payment methods': '💳 UPI, Cards and COD are supported.',
    'offers': '🔥 Combo and seasonal offers are available regularly.'
}

# AI-like fallback intelligence

def intelligent_fallback(message):
    msg = message.lower()

    for key, value in faq_answers.items():
        if key in msg:
            return {
                'reply': value
            }

    return {
        'reply': '🤖 SmartBite Assistant is learning from your request. Try asking about menu, orders, offers, payments or recommendations.'
    }

# Auto context understanding

def context_understanding(message):
    msg = message.lower()

    if 'same' in msg or 'again' in msg:
        if user_context['last_food']:
            return {
                'reply': f"🔁 Showing similar foods like {user_context['last_food']}."
            }

    return None

# Advanced chatbot analytics simulation
chatbot_stats = {
    'total_messages': 0,
    'food_queries': 0,
    'order_queries': 0,
    'recommendations_given': 0
}

# Enhanced smart processing layer

def process_advanced_ai(message):
    chatbot_stats['total_messages'] += 1

    recommendation = advanced_recommendation_engine(message)

    if recommendation:
        chatbot_stats['recommendations_given'] += 1
        return recommendation

    context_response = context_understanding(message)

    if context_response:
        return context_response

    return intelligent_fallback(message)

