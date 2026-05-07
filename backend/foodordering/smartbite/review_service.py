from collections import Counter

from nltk.sentiment import SentimentIntensityAnalyzer

from foodordering.models import Review


class ReviewService:

    @staticmethod
    def analyze_reviews():

        sia = SentimentIntensityAnalyzer()

        reviews = Review.objects.all()

        positive = 0

        negative = 0

        neutral = 0

        keyword_list = []

        review_data = []

        for review in reviews:

            comment = (
                review.comment
                if review.comment
                else ""
            )

            keyword_list.extend(
                comment.lower().split()
            )

            score = sia.polarity_scores(comment)

            compound = score["compound"]

            sentiment = "Neutral"

            if compound >= 0.05:

                sentiment = "Positive"

                positive += 1

            elif compound <= -0.05:

                sentiment = "Negative"

                negative += 1

            else:

                sentiment = "Neutral"

                neutral += 1

            review_data.append({

                "user": review.user.first_name,

                "review": comment,

                "sentiment": sentiment,

                "score": round(compound, 2)

            })

        keywords = Counter(keyword_list).most_common(6)

        keyword_chart = []

        for word, count in keywords:

            if len(word) > 2:

                keyword_chart.append({

                    "keyword": word,

                    "count": count

                })

        return {

            "positive": positive,

            "negative": negative,

            "neutral": neutral,

            "total_reviews": reviews.count(),

            "keyword_chart": keyword_chart,

            "reviews": review_data

        }