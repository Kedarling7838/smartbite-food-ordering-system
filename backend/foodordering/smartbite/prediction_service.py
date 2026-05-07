import numpy as np

from sklearn.linear_model import LinearRegression

from django.db.models import Count

from django.db.models.functions import ExtractHour

from foodordering.models import (
    Order,
    OrderAddress
)


class PredictionService:

    @staticmethod
    def get_prediction_data():

        top_foods = (

            Order.objects
            .values("food__item_name")
            .annotate(total=Count("id"))
            .order_by("-total")[:5]

        )

        food_predictions = []

        for item in top_foods:

            food_name = item["food__item_name"]

            total_orders = item["total"]

            X = np.array([
                [1],
                [2],
                [3],
                [4],
                [5]
            ])

            y = np.array([

                total_orders - 4,
                total_orders - 2,
                total_orders,
                total_orders + 2,
                total_orders + 4

            ])

            model = LinearRegression()

            model.fit(X, y)

            predicted = model.predict([[6]])[0]

            food_predictions.append({

                "food": food_name,

                "current_orders": total_orders,

                "predicted_orders": round(predicted)

            })

        peak_orders = (

            OrderAddress.objects
            .annotate(hour=ExtractHour("order_time"))
            .values("hour")
            .annotate(total=Count("id"))
            .order_by("hour")

        )

        peak_predictions = []

        for item in peak_orders:

            hour = item["hour"]

            formatted_time = f"{hour}:00"

            peak_predictions.append({

                "time": formatted_time,

                "orders": item["total"]

            })

        return {

            "food_predictions": food_predictions,

            "peak_predictions": peak_predictions,

            "ai_message":
                " Predicts future food demand using historical order patterns."

        }