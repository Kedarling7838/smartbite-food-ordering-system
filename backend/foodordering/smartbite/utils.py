from foodordering.models import (
    PaymentDetail,
    FoodTracking,
    Review,
    Order
)


class NotificationService:

    @staticmethod
    def get_notifications():

        notifications = []

        failed_payments = PaymentDetail.objects.filter(
            payment_status="failed"
        ).count()

        pending_payments = PaymentDetail.objects.filter(
            payment_status="pending"
        ).count()

        cancelled_orders = FoodTracking.objects.filter(
            order_cancelled_by_user=True
        ).count()

        reviews = Review.objects.count()

        large_orders = Order.objects.filter(
            quantity__gte=5
        ).count()

        if failed_payments > 0:

            notifications.append(
                f"⚠ {failed_payments} failed payments detected"
            )

        if pending_payments > 0:

            notifications.append(
                f"🕒 {pending_payments} pending payments"
            )

        if cancelled_orders > 0:

            notifications.append(
                f"❌ {cancelled_orders} cancelled orders found"
            )

        if reviews > 0:

            notifications.append(
                f"⭐ {reviews} customer reviews submitted"
            )

        if large_orders > 0:

            notifications.append(
                f"🔥 {large_orders} bulk food orders detected"
            )

        return notifications


from foodordering.models import (
    User,
    Food,
    Order,
    Category
)


class SmartSearchService:

    @staticmethod
    def search(query):

        users = User.objects.filter(
            first_name__icontains=query
        )[:5]

        foods = Food.objects.filter(
            item_name__icontains=query
        )[:5]

        categories = Category.objects.filter(
            category_name__icontains=query
        )[:5]

        orders = Order.objects.filter(
            order_number__icontains=query
        )[:5]

        results = []

        for user in users:

            results.append({
                "type": "User",
                "name": f"{user.first_name} {user.last_name}"
            })

        for food in foods:

            results.append({
                "type": "Food",
                "name": food.item_name
            })

        for category in categories:

            results.append({
                "type": "Category",
                "name": category.category_name
            })

        for order in orders:

            results.append({
                "type": "Order",
                "name": order.order_number
            })

        return results