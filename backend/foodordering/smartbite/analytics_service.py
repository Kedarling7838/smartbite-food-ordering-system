from django.db.models import Count

from foodordering.models import (
    Order,
    Food,
    User,
    Category
)


class AnalyticsService:

    @staticmethod
    def get_analytics_data():

        total_orders = Order.objects.count()

        total_users = User.objects.count()

        total_foods = Food.objects.count()

        categories = Category.objects.all()

        category_performance = []

        for category in categories:

            total = Food.objects.filter(
                category=category
            ).count()

            category_performance.append({

                "name": category.category_name,
                "value": total

            })

        top_foods = (
            Order.objects
            .values("food__item_name")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]
        )

        top_food_chart = []

        for food in top_foods:

            top_food_chart.append({

                "name": food["food__item_name"],
                "orders": food["total"]

            })

        return {

            "total_orders": total_orders,

            "total_users": total_users,

            "total_foods": total_foods,

            "revenue": total_orders * 500,

            "category_performance": category_performance,

            "top_food_chart": top_food_chart

        }