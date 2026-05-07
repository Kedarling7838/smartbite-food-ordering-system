from django.db.models import Count

from foodordering.models import (
    Order,
    User,
    PaymentDetail
)


class DashboardService:

    @staticmethod
    def get_dashboard_data():

        total_orders = Order.objects.count()

        total_users = User.objects.count()

        completed_orders = PaymentDetail.objects.filter(
            payment_status="success"
        ).count()

        pending_orders = PaymentDetail.objects.filter(
            payment_status="pending"
        ).count()

        cancelled_orders = PaymentDetail.objects.filter(
            payment_status="failed"
        ).count()

        revenue_chart = [

            {
                "month": "Jan",
                "revenue": 1200
            },

            {
                "month": "Feb",
                "revenue": 2400
            },

            {
                "month": "Mar",
                "revenue": 3200
            },

            {
                "month": "Apr",
                "revenue": 4500
            },

            {
                "month": "May",
                "revenue": 6200
            }

        ]

        return {

            "total_orders": total_orders,

            "total_revenue": completed_orders * 500,

            "active_users": total_users,

            "order_status": [

                {
                    "name": "Completed",
                    "value": completed_orders
                },

                {
                    "name": "Pending",
                    "value": pending_orders
                },

                {
                    "name": "Cancelled",
                    "value": cancelled_orders
                }

            ],

            "revenue_chart": revenue_chart

        }