from foodordering.models import (
    Order,
    FoodTracking,
    PaymentDetail
)


class ConflictService:

    @staticmethod
    def get_conflict_data():

        total_orders = Order.objects.count()

        spam_orders = Order.objects.filter(
            quantity__gte=10
        ).count()

        pending_orders = PaymentDetail.objects.filter(
            payment_status="pending"
        ).count()

        failed_payments = PaymentDetail.objects.filter(
            payment_status="failed"
        ).count()

        cancellations = FoodTracking.objects.filter(
            order_cancelled_by_user=True
        ).count()

        cancellation_chart = [

            {
                "name": "Spam Orders",
                "cancellations": spam_orders
            },

            {
                "name": "Pending Payments",
                "cancellations": pending_orders
            },

            {
                "name": "Failed Payments",
                "cancellations": failed_payments
            },

            {
                "name": "Cancelled Orders",
                "cancellations": cancellations
            }

        ]

        issue_data = [

            {
                "name": "Spam Orders",
                "value": spam_orders
            },

            {
                "name": "Pending Payments",
                "value": pending_orders
            },

            {
                "name": "Failed Payments",
                "value": failed_payments
            },

            {
                "name": "Cancelled Orders",
                "value": cancellations
            }

        ]

        return {

            "detected_issues": (
                spam_orders +
                pending_orders +
                failed_payments +
                cancellations
            ),

            "spam_orders": spam_orders,

            "health_alerts": cancellations,

            "cancellation_chart": cancellation_chart,

            "issue_data": issue_data

        }