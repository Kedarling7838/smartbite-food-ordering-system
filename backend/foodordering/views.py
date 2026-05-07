from django.shortcuts import render
from rest_framework.decorators import api_view,parser_classes
from django.contrib.auth import authenticate
from rest_framework.response import Response
from .models import *
from .models import User
from django.db.models import Q
from django.contrib.auth.hashers import check_password
# Create your views here.
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
def admin_login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=username, is_admin=True)

        if check_password(password, user.password):
            return Response({
                "message": "Login successful",
                "username": username
            }, status=200)

        return Response({"message": "Invalid password"}, status=401)

    except User.DoesNotExist:
        return Response({"message": "Admin not found"}, status=404)

@api_view(['POST'])
def add_category(request):
    category_name=request.data.get('category_name')
    Category.objects.create(category_name=category_name)
    return Response({"message":"Category has been created"},status=201)

from .Serializers import categorySerializer
@api_view(['GET'])
def list_categories(request):
    categories=Category.objects.all()
    serializer=categorySerializer(categories,many=True)
    return Response(serializer.data)

from rest_framework.parsers import MultiPartParser,FormParser
from .Serializers import FoodSerializer
@api_view(['POST'])
@parser_classes([MultiPartParser,FormParser])
def add_food_item(request):
    serializer=FoodSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message":"Food item has been added"},status=201)
    return Response({"message":"Something went wrong"},status=400)

@api_view(['GET'])
def list_foods(request):
    foods=Food.objects.all()
    serializer=FoodSerializer(foods,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def food_search(request):
    query=request.GET.get('q','')
    foods=Food.objects.filter(item_name__icontains=query)
    serializer=FoodSerializer(foods,many=True)
    return Response(serializer.data)

import random
@api_view(['GET'])
def random_foods(request):
    foods=list(Food.objects.all())
    random.shuffle(foods)
    limited_foods=foods[0:9]
    serializer=FoodSerializer(limited_foods,many=True)
    return Response(serializer.data)


from django.contrib.auth.hashers import make_password
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import User

@api_view(['POST'])
def register_user(request):

    first_name = request.data.get('firstname') or ""
    last_name = request.data.get('lastname') or ""
    email = request.data.get('email')
    password = request.data.get('password')

    if email:
        email = email.strip().lower()   # ADD THIS

    if not email or not password:
        return Response({"message": "Email and password required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"message": "Email already registered"}, status=400)

    User.objects.create(
        first_name=first_name,
        last_name=last_name,
        email=email,
        password=make_password(password)
    )

    return Response({"message": "User registered successfully"}, status=201)

@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    if email:
        email = email.strip().lower()
    password = request.data.get('password')
    
    print("INPUT EMAIL:", email)
    print("INPUT PASSWORD:", password)

    try:
        user = User.objects.get(email=email)
        print("USER FOUND:", user.email)
        print("DB PASSWORD:", user.password)

        if check_password(password, user.password):
            print("PASSWORD MATCH")
            return Response({
                "message": "Login successful",
                "userId": user.id,
                "userName": f"{user.first_name} {user.last_name}"
            }, status=200)

        print("PASSWORD NOT MATCH")
        return Response({"message": "Invalid credentials"}, status=401)

    except User.DoesNotExist:
        print("USER NOT FOUND")
        return Response({"message": "User not found"}, status=404)
  
from django.shortcuts import get_object_or_404
@api_view(['GET'])
def food_detail(request,id):
    # foods=Food.objects.get(id=id)
    food=get_object_or_404(Food,id=id)
    serializer=FoodSerializer(food)
    return Response(serializer.data)


@api_view(['POST'])
def add_to_cart(request):
    user_id=request.data.get('userId')
    food_id=request.data.get('foodId')
    try:
        user=User.objects.get(id=user_id)
        food=Food.objects.get(id=food_id)
        
        #if Order.objects.filter(user=user,food=food,is_order_placed=False,).exists():
        order,created=Order.objects.get_or_create(
            user=user,
            food=food,
            is_order_placed=False,
            # quantity=1,
            defaults={'quantity':1}
        )
        if not created:
            order.quantity += 1
            order.save()
        return Response({"message":"Food added to cart Successfully"},status=200)
       
    except:
        return Response({"message":"Something went wrong"},status=404)


from .Serializers import CartOrderSerializer
@api_view(['GET'])
def get_cart_items(request,user_id):
    orders=Order.objects.filter(user_id=user_id,is_order_placed=False).select_related('food')
    serializer= CartOrderSerializer(orders,many=True)
    return Response(serializer.data)


@api_view(['PUT'])  
def update_cart_quantity(request):
    order_Id=request.data.get('orderId')
    quantity=request.data.get('quantity')
    try:
        order=Order.objects.get(id=order_Id, is_order_placed=False)
        order.quantity=quantity
        order.save()
        
        return Response({"message":"Quantity updated Successfully"},status=200)
       
    except:
        return Response({"message":"Something went wrong"},status=404)


@api_view(['DELETE'])  
def delete_cart_item(request,order_id):
    try:
        order=Order.objects.get(id=order_id, is_order_placed=False)
        order.delete()
        return Response({"message":"Item deleted from Cart"},status=200)
    except:
        return Response({"message":"Something went wrong"},status=404)


def make_unique_order_number():
    while True:
        num=str(random.randint(100000000,999999999))
        if not OrderAddress.objects.filter(order_number=num).exists():
            return num
        
# import razorpay
# import random
# from django.conf import settings
# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from django.contrib.auth.models import User
# from .models import PaymentDetail

# client = razorpay.Client(auth=(
#     settings.RAZORPAY_KEY_ID,
#     settings.RAZORPAY_KEY_SECRET
# ))


# @api_view(['POST'])
# def create_razorpay_order(request):
#     try:
#         data = request.data
#         amount = data.get("amount", 50000)

#         order = client.order.create({
#             "amount": amount,
#             "currency": "INR",
#             "payment_capture": 1
#         })

#         return Response({
#             "order_id": order["id"],
#             "amount": amount
#         })

#     except Exception as e:
#         return Response({"error": str(e)}, status=500)


from .models import OrderAddress
@api_view(['POST'])
def place_order(request):
    try:
        data = request.data
        user = User.objects.get(id=int(data["userId"]))
        order_number = "ORD" + str(random.randint(10000, 99999))

        cart_items = Order.objects.filter(
            user=user,
            is_order_placed=False
        )

        for item in cart_items:
            item.is_order_placed = True
            item.order_number = order_number
            item.save()

        # save address
        OrderAddress.objects.create(
            user=user,
            order_number=order_number,
            address=data.get("address")
        )

        # save payment
        PaymentDetail.objects.create(
            user=user,
            order_number=order_number,
            payment_mode=data.get("paymentMode", "cod")
        )

        # tracking
        FoodTracking.objects.create(
            order_number=order_number,
            status="Order Confirmed",
            remark="Order placed successfully"
        )

        return Response({
            "message": "Order placed successfully",
            "order_number": order_number
        }, status=201)

    except Exception as e:
        print("ERROR:", str(e))
        return Response({"error": str(e)}, status=500)
    
from .Serializers import MyOrdersListSerializer
@api_view(['GET'])
def user_orders(request,user_id):
    orders=OrderAddress.objects.filter(user_id=user_id).order_by('-id')
    serializer= MyOrdersListSerializer(orders,many=True)
    return Response(serializer.data)

from .Serializers import OrderSerializer
@api_view(['GET'])
def order_by_order_number(request,order_number):
    orders=Order.objects.filter(order_number=order_number,is_order_placed=True).select_related('food')
    serializer= OrderSerializer(orders,many=True)
    return Response(serializer.data)



from .Serializers import OrderAddressSerializer
@api_view(['GET'])
def get_order_address(request,order_number):
    address=OrderAddress.objects.get(order_number=order_number)
    serializer= OrderAddressSerializer(address)
    return Response(serializer.data)

from django.shortcuts import render
def get_invoice(request,order_number):
    orders=Order.objects.filter(order_number=order_number,is_order_placed=True).select_related('food')
    address=OrderAddress.objects.get(order_number=order_number)
    
    grand_total=0
    order_data=[]
    for order in orders:
        total_price = order.food.item_price * order.quantity
        grand_total+=total_price
        order_data.append({
            'food':order.food,
            'quantity':order.quantity,
            'total_price':total_price
        })
    return render(request,'invoice.html',{
            'order_number':order_number,
           
            'address':address,
            'grand_total':grand_total,
            'orders':order_data
            
        })
    
    
from .Serializers import UserSerializer
@api_view(['GET'])
def get_user_profile(request,user_id):
    user=User.objects.get(id=user_id)
    serializer= UserSerializer(user)
    return Response(serializer.data)

@api_view(['PUT'])
def update_user_profile(request,user_id):
    user=User.objects.get(id=user_id)
    serializer= UserSerializer(user,data=request.data,partial=True)
    if serializer.is_valid():
           serializer.save()
           return Response({"message":"Profile Updated Successfully!"},status=200)
    return Response(serializer.errors,status=400)

@api_view(['POST'])
def change_password(request,user_id):
    current_password=request.data.get('current_password')
    new_password=request.data.get('new_password')
    user=User.objects.get(id=user_id)
    
    if not check_password(current_password,user.password):
        return Response({"message":"Current Password is Incorrect!"},status=400)
    user.password= make_password(new_password)
    user.save()
    return Response({"message":"Password Changed Successfully!"},status=200)


from .Serializers import OrderSummarySerializer
@api_view(['GET'])   
def orders_not_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status__isnull=True).order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])   
def orders_confirmed(request):
    orders = OrderAddress.objects.filter(order_final_status='Order Confirmed').order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])   
def foodbeing_prepared(request):
    orders = OrderAddress.objects.filter(order_final_status='Food being Prepared').order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])   
def Food_pickup(request):
    orders = OrderAddress.objects.filter(order_final_status='Food Pickup').order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])   
def Food_delivered(request):
    orders = OrderAddress.objects.filter(order_final_status='Food Delivered').order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])   
def order_cancelled(request):
    orders = OrderAddress.objects.filter(order_final_status='Order Cancelled').order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['GET'])   
def all_orders(request):
    orders = OrderAddress.objects.all().order_by('-order_time')
    serializer= OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

@api_view(['POST'])   
def order_between_dates(request):
    from_date=request.data.get('from_date')
    to_date=request.data.get('to_date')
    status=request.data.get('status')
    
    orders = OrderAddress.objects.filter(order_time__date__range=[from_date,to_date])
    if status == 'not_confirmed':
       orders = orders.filter(order_final_status__isnull=True)
    elif status != 'all':
       orders= orders.filter(order_final_status=True)
    
    serializer= OrderSummarySerializer(orders.order_by('-order_time'),many=True)
    return Response(serializer.data)


@api_view(['GET'])
def view_order_detail(request, order_number):
    try:
        order = OrderAddress.objects.filter(order_number=order_number).first()

        if not order:
            return Response({"message": "Order not found"}, status=404)

        foods = Order.objects.filter(
            order_number=order_number,
            is_order_placed=True
        )

        foods_data = []
        for o in foods:
            if o.food:
                foods_data.append({
                    "item_name": o.food.item_name,
                    "item_price": o.food.item_price,
                    "image": o.food.image.url if o.food.image else None,
                    "quantity": o.quantity
                })

        tracking = FoodTracking.objects.filter(order_number=order_number)

        return Response({
            "order": {
                "order_number": order.order_number,
                "order_time": order.order_time,
                "order_final_status": order.order_final_status,
                "address": order.address,
                "user_first_name": order.user.first_name,
                "user_last_name": order.user.last_name,
                "user_email": order.user.email,
            },
            "foods": foods_data,
            "tracking": FoodTrackingSerializer(tracking, many=True).data
        })

    except Exception as e:
        print("ERROR:", str(e))
        return Response({"error": str(e)}, status=500)
   
@api_view(['POST'])
def update_order_status(request):
    try:
        order_number = request.data.get('order_number')
        status_value = request.data.get('status')
        remark = request.data.get('remark')

        if not order_number or not status_value:
            return Response({'message': 'Missing data'}, status=400)

        order_address = OrderAddress.objects.get(order_number=order_number)

        # update final status
        order_address.order_final_status = status_value
        order_address.save()

        
        FoodTracking.objects.create(
            order_number=order_number,
            status=status_value,
            remark=remark if remark else status_value,
            order_cancelled_by_user=(status_value == "Order Cancelled")
        )

        return Response(
            {'message': 'Order status updated successfully'},
            status=200
        )

    except OrderAddress.DoesNotExist:
        return Response({'message': 'Order not found'}, status=404)

    except Exception as e:
        print("ERROR:", str(e))
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
def search_orders(request):
    query=request.GET.get('q','')
    if query:
         orders=OrderAddress.objects.filter(order_number__icontains=query).order_by('-order_time')
    else:
        orders=[]
    serializer=OrderSummarySerializer(orders,many=True)
    return Response(serializer.data)

from .Serializers import categorySerializer
@api_view(['GET','PUT','DELETE'])
def category_detail(request,id):
     try:  
        category=Category.objects.get(id=id)
     except Category.DoesNotExist:
        return Response({'error':'Category Not Found'},status=404)
    
     if request.method=='GET':
          serializer=categorySerializer(category)
          return Response(serializer.data)
     elif request.method=='PUT':
          serializer=categorySerializer(category,data=request.data)
          if serializer.is_valid():
              serializer.save()
          return Response({'error':'Category updated successfully'},status=200)
     elif request.method=='DELETE':
              category.delete()
              return Response({'error':'Category deleted successfully'},status=200)
      
      
@api_view(['DELETE'])
def delete_food(request,id):
     try:  
        food=Food.objects.get(id=id)
        food.delete()
        return Response({'error':'Food deleted successfully'},status=200)
     except Food.DoesNotExist:
        return Response({'error':'Food Item Not Found'},status=404)
    
@api_view(['GET','PUT'])
@parser_classes([MultiPartParser,FormParser])
def edit_food(request,id):
     try:  
        food=Food.objects.get(id=id)
     except Food.DoesNotExist:
        return Response({'error':'Food Not Found'},status=404)
    
     if request.method=='GET':
          serializer=FoodSerializer(food)
          return Response(serializer.data)
     elif request.method=='PUT':
          data=request.data.copy()
          if 'image' not in request.FILES:
              data['image'] = food.image
          if 'is_available' in data:
              data['is_available'] = data['is_available'].lower()  == 'true'
          serializer=FoodSerializer(food,data=data,partial=True)
          if serializer.is_valid():
              serializer.save()
          return Response({'error':'Food updated successfully'},status=200)
     
      
from .Serializers import UserSerializer
@api_view(['GET'])
def list_users(request):
    users=User.objects.all().order_by('-id')
    serializer=UserSerializer(users,many=True)
    return Response(serializer.data)   

@api_view(['DELETE'])
def delete_users(request,id):
     try:  
        user=User.objects.get(id=id)
        user.delete()
        return Response({'error':'User deleted successfully'},status=200)
     except User.DoesNotExist:
        return Response({'error':'User Not Found'},status=404)
    
from django.utils.timezone import now,timedelta 
from django.db.models import Sum,F 
 
@api_view(['GET'])
def dashboard_metrics(request):
    today=now().date()
    start_week= today-timedelta(days=today.weekday())
    start_month=today.replace(day=1)
    start_year=today.replace(month=1,day=1)
    
    def get_sales_total(start_date):
        paid_orders=PaymentDetail.objects.filter(payment_date__gte=start_date).values_list('order_number',flat=True)
        total=Order.objects.filter(order_number__in=paid_orders).annotate(
            total_price=F('quantity')*F('food__item_price')
        ).aggregate(sale_ammount=Sum('total_price'))['sale_ammount'] or 0.0
        return round(total,2)
    data={
        "total_orders":OrderAddress.objects.count(),
        "new_orders":OrderAddress.objects.filter(order_final_status__isnull=True).count(),
        "confirmed":OrderAddress.objects.filter(order_final_status='Order Confirmed').count(),
        "food_preparing":OrderAddress.objects.filter(order_final_status='Food being Prepared').count(),
        "food_pickup":OrderAddress.objects.filter(order_final_status='Food Pickup').count(),
        "food_delivered":OrderAddress.objects.filter(order_final_status='Food Delivered').count(),
        "canceled_orders":OrderAddress.objects.filter(order_final_status='Order Cancelled').count(),
         "total_users":User.objects.count(),
         "total_categories":Category.objects.count(),
         "total_reviews":Review.objects.count(),
         "total_wishlists":Wishlist.objects.count(),
         "today_sales":get_sales_total(today),
         "week_sales":get_sales_total(start_week),
         "month_sales":get_sales_total(start_month),
         "year_sales":get_sales_total(start_year),
    }
    return Response(data)  

# ===== GOOGLE LOGIN (ADD THIS) =====
from google.oauth2 import id_token
from google.auth.transport import requests

GOOGLE_CLIENT_ID = "703260092982-5b1jfbcd5cdejt1nv2625tdgt2cd7teq.apps.googleusercontent.com"

@api_view(['POST'])
def google_login(request):
    token = request.data.get("token")

    if not token:
        return Response({"message": "Token missing"}, status=400)

    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        print("IDINFO:", idinfo)

        email = idinfo.get('email')
        email = email.strip().lower()

        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        user = User.objects.filter(email=email).first()

        if not user:
            user = User.objects.create(
                first_name=first_name,
                last_name=last_name,
                email=email,
                password=""
            )

        return Response({
            "message": "Login Successful",
            "userId": user.id,
            "userName": f"{user.first_name} {user.last_name}"
        }, status=200)

    except Exception as e:
        print("GOOGLE ERROR:", str(e))
        return Response({"message": str(e)}, status=400)




@api_view(['POST'])
def add_to_wishlist(request):
    user_id=request.data.get('user_id')
    food_id=request.data.get('food_id')
    obj,created=Wishlist.objects.get_or_create(user_id=user_id,food_id=food_id)
    if created:
         return Response({"message":"Added to wishlist"},status=201)
    else:
        return Response({"message":"Already in wishlist"},status=400)
    
@api_view(['POST'])
def remove_from_wishlist(request):
    user_id = request.data.get('user_id')
    food_id = request.data.get('food_id')

    try:
        wishlist_item = Wishlist.objects.get(
            user_id=user_id,
            food_id=food_id
        )

        wishlist_item.delete()

        return Response(
            {"message": "Removed from wishlist"},
            status=200
        )

    except Wishlist.DoesNotExist:
        return Response(
            {"message": "Item not found in wishlist"},
            status=404
        )
        
        
        
from .Serializers import WishlistSerializer
@api_view(['GET'])
def get_wishlist(request, user_id):
    wishlist_items = Wishlist.objects.filter(user_id=user_id)
    serializer = WishlistSerializer(wishlist_items, many=True)
    return Response(serializer.data)
     
    
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import OrderAddress, FoodTracking
from .Serializers import FoodTrackingSerializer

@api_view(['GET'])
def track_order(request, order_number):
    print("Received Order Number:", order_number)

    trackingEntries = FoodTracking.objects.filter(order_number=order_number)

    # optional: avoid 404 → return at least one entry
    if not trackingEntries.exists():
        return Response([
            {
                "status": "Order Confirmed",
                "remark": "Order placed",
                "status_date": None,
                "order_cancelled_by_user": False
            }
        ])

    serializer = FoodTrackingSerializer(trackingEntries, many=True)
    return Response(serializer.data)
@api_view(['POST'])
def cancel_order(request,order_number):
    remark=request.data.get('remark')
    address=OrderAddress.objects.get(order_number=order_number)
    sample_order=Order.objects.filter(order_number=order_number).first()
    FoodTracking.objects.create(
        order_number=order_number,
        status="Order Cancelled",
        remark="Cancelled by user",
        order_cancelled_by_user=True
    )
    address.order_final_status="Order Cancelled"
    address.save()
    return Response({"message":"Order Cancelled Successfully"},status=200)
    
@api_view(['POST'])
def add_review(request,food_id):
    user_id=request.data.get('user_id')
    rating=request.data.get('rating')
    comment=request.data.get('comment')
    try:
        user=User.objects.get(id=user_id)
        food=Food.objects.get(id=food_id)
    except (User.DoesNotExist,Food.DoesNotExist):
        return Response({"message":"User or Food Not Found"},status=404)
    
    Review.objects.create(
        user=user,
        food=food,
        rating=rating,
        comment=comment,
    )
    return Response({"message":"Review Submitted"},status=201)



from .Serializers import ReviewSerializer

@api_view(['GET'])
def food_reviews(request, food_id):
    reviews = Review.objects.filter(food_id=food_id).order_by('created_at')
    serializer=ReviewSerializer(reviews,many=True)
    return Response(serializer.data)
     
    

@api_view(['DELETE','PUT'])
def review_detail(request,id):
    try:
         reviews = Review.objects.get(id=id)
    except Review.DoesNotExist:
         return Response({"message":"Review Not Found"},status=404)
    if request.method == 'DELETE':
        reviews.delete()
        return Response({"message":"Review Deleted"},status=200)
    
    if request.method == 'PUT':
        data ={"rating":request.data.get("rating",reviews.rating),
               "comment":request.data.get("comment",reviews.comment)}
        
        serializer=ReviewSerializer(reviews,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Review updated"},status=200)
        return Response(serializer.errors,status=400)

from django.db.models import Count,Avg
@api_view(['GET'])
def food_rating_summary(request, food_id):
    reviews = Review.objects.filter(food_id=food_id)
    rating_summary=reviews.values('rating').annotate(count=Count('rating')).order_by('-rating')
    average=reviews.aggregate(average=Avg('rating'))['average'] or 0
    total_reviews=reviews.count()
    return Response({
        'average':round(average,1),
        'total_reviews':total_reviews,
        'breakdown': {entry['rating']: entry['count'] for entry in rating_summary}
    })
from .Serializers import ReviewSerializer   
@api_view(['GET'])
def all_reviews(request):
    reviews = Review.objects.select_related('user','food').order_by('-created_at')
    serializer=ReviewSerializer(reviews,many=True)
    return Response(serializer.data)



@api_view(['DELETE'])
def delete_review(request,id):
     try:  
        user=Review.objects.get(id=id)
        user.delete()
        return Response({'error':'Review deleted successfully'},status=200)
     except Review.DoesNotExist:
        return Response({'error':'Review Not Found'},status=404)  
    
    
    
    
#Chat Bot


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .chat_service import chatbot_logic

@api_view(['POST'])
def chat_api(request):
    message = request.data.get("message", "")

    if "chat_session" not in request.session:
        request.session["chat_session"] = {}

    session = request.session["chat_session"]

    response = chatbot_logic(message, session)

    request.session.modified = True

    return Response(response)



#------------------------------------ --Insights Hub Logics----------------------------
from rest_framework.views import APIView
from rest_framework.response import Response

from foodordering.smartbite.dashboard_service import DashboardService


class SmartbiteDashboardAPIView(APIView):

    def get(self, request):

        data = DashboardService.get_dashboard_data()

        return Response(data)
    

from foodordering.smartbite.analytics_service import AnalyticsService


class AnalyticsAPIView(APIView):

    def get(self, request):

        data = AnalyticsService.get_analytics_data()

        return Response(data)
    
from foodordering.smartbite.conflict_service import ConflictService
class ConflictAPIView(APIView):

    def get(self, request):

        data = ConflictService.get_conflict_data()

        return Response(data)
    
from foodordering.smartbite.utils import NotificationService
class NotificationAPIView(APIView):

    def get(self, request):

        data = NotificationService.get_notifications()

        return Response(data)
    
from rest_framework.decorators import api_view
from foodordering.smartbite.utils import SmartSearchService
@api_view(["GET"])
def smartbite_search(request):

    query = request.GET.get("query", "")

    data = SmartSearchService.search(query)

    return Response(data)

from foodordering.smartbite.prediction_service import PredictionService
class PredictionAPIView(APIView):
    def get(self, request):
        data = PredictionService.get_prediction_data()
        return Response(data)
    
from foodordering.smartbite.review_service import ReviewService
class ReviewAPIView(APIView):
    def get(self, request):
        data = ReviewService.analyze_reviews()
        return Response(data)