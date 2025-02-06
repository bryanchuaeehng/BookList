from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render
from django.db import IntegrityError
from django.urls import reverse
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json

from .models import *

@login_required(login_url='/login')
def index(request):
    user = request.user
    continue_books = Book.objects.filter(adder=user).exclude(current_page=0).exclude(done=True).order_by("timestamp").reverse()
    to_read_books = Book.objects.filter(adder=user).filter(current_page=0).order_by("timestamp").reverse()[:10]
    user_playlists = Playlist.objects.filter(owner=user)
    done_books = Book.objects.filter(adder=user).filter(done=True).order_by("timestamp").reverse()
    favorites = Book.objects.filter(adder=user).filter(rating=5.0)
    genres = Genres.objects.all()
    return render(request, "booklist/index.html", {
        'continue_books' : continue_books,
        'to_read_books' : to_read_books,
        'user_playlists' : user_playlists,
        'done_books': done_books,
        'favorites': favorites,
        'genres': genres
    })


def login_view(request):
    if request.method == "POST":
        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            error = ""
            if not username:
                error = "Username cannot be empty."
            elif not password:
                error = "Password cannot be empty."
            else:
                error = "Incorrect username and/or password."
            return render(request, "booklist/login.html", {
                "error": error,
                "username": username,
                "password": password
            })
    else:
        return render(request, "booklist/login.html")
    

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("login"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]

        # Ensure password matches confirmation
        password = request.POST["password"]

        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "booklist/register.html", {
                "error": "Passwords must match.",
                "username": username
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, None, password)
            user.save()
        except IntegrityError:
            return render(request, "booklist/register.html", {
                "error": "Username already taken.",
                "username": username
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "booklist/register.html")


@login_required
def book(request, id):
    if request.method == "GET":
        try:
            book = Book.objects.get(id=id)
        except Book.DoesNotExist:
            return render(request, "booklist/error.html", {
                "error": "Book not found.",
                "code": 404
            })
        playlists = Playlist.objects.filter(owner=request.user)
        if book.adder == request.user:
            return render(request, "booklist/book.html", {
                "book": book,
                "playlists": playlists,
            })
        else:
            return render(request, "booklist/error.html", {
                "error": "Cannot view book that is not added by you.",
                "code": 403
            })
        

@login_required
def playlist(request, id):
    if request.method == "GET":
        try:
            playlist = Playlist.objects.get(id=id)
        except Playlist.DoesNotExist:
            return render(request, "booklist/error.html", {
                "error": "Playlist not found.",
                "code": 404
            })
        if (playlist.owner != request.user):
            return render(request, "booklist/error.html", {
                "error": "Cannot view playlist that is not owned by you.",
                "code": 403
            })
        return render(request, "booklist/playlist.html", {
            "playlist": playlist,
        })


@login_required
def friends(request):
    if request.method == "GET":
        return render(request, "booklist/friends.html")   
    pass


@login_required
def profile(request, username):
    if request.method == "GET":
        requester = request.user
        try:
            target = User.objects.get(username=username)
        except User.DoesNotExist:
            return render(request, "booklist/error.html", {
                "error": "Target user not found.",
                "code": 404
            })
        # valid 
        if target == requester or target in requester.friendsWith.all():
            books = Book.objects.filter(adder=target)
            freq_mp = {}
            for book in books:
                for genre in book.genres.all():
                    if genre in freq_mp:
                        freq_mp[genre] += 1
                    else:
                        freq_mp[genre] = 1
            freq_mp = dict(sorted(freq_mp.items(), key=lambda item: item[1], reverse=True)) 
            fav_genres = []
            for key, value in freq_mp.items():
                fav_genres.append(key)

            return render(request, "booklist/profile.html", {
                "profile_user": target,
                "continue_count": books.exclude(current_page=0).exclude(done=True).count(),
                "to_read_count": books.filter(current_page=0).count(),
                "done_count": books.filter(done=True).count(),
                "genres": fav_genres,
                "friends": target.friendsWith.all(),
                "fav_books": books.order_by('-rating')[:10],
                "ra_books": books.order_by("timestamp").reverse()[:10]
            })
        # invalid
        return render(request, "booklist/error.html", {
                "error": "Cannot view profile of non-friend user.",
                "code": 403
            })

@csrf_exempt 
def edit(request, id):
    # Only allow to reach via POST
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    try:
        book = Book.objects.get(id=id)
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found."}, status=404)
    # Disallow edits if request.user is not the post's author
    if book.adder != request.user:
        return JsonResponse({"error": "Cannot edit a post that is not yours."}, status=403)
    data = json.loads(request.body)
    edit_for = data.get("edit_for", "")
    new_content = data.get("content", "")
    if not new_content:
        return JsonResponse({"error": "Cannot have blank post."}, status=409)
    if edit_for == "page":
        if int(new_content) > int(book.total_pages):
            return JsonResponse({"error": "Cannot edit current page to be greater than total pages."}, status=409)
        book.current_page = new_content
        if int(new_content) == int(book.total_pages):
            book.done = True
        else:
            book.done = False
        book.save()
    elif edit_for == "description":
        book.description = new_content
        book.save()
    return JsonResponse({"message": "Edited successfully."}, status=201)


@csrf_exempt
def rate(request, id, stars):
    # Only allow to reach via POST
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    try:
        book = Book.objects.get(id=id)
    except Book.DoesNotExist:
        return JsonResponse({"error": "Book not found."}, status=404)
    # Disallow edits if request.user is not the post's author
    if book.adder != request.user:
        return JsonResponse({"error": "Cannot edit a post that is not yours."}, status=403)
    data = json.loads(request.body)
    new_rating = data.get("new_rating", "")
    book.rating = new_rating
    book.save()
    return JsonResponse({"message": "Rated successfully."}, status=201)


@csrf_exempt
def add_to_playlist(request, book_id, playlist_id):
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return JsonResponse({"error": "This book does not exist."}, status=404)
    try:
        playlist = Playlist.objects.get(id=playlist_id)
    except Playlist.DoesNotExist:
        return JsonResponse({"error": "This playlist does not exist."}, status=404)
    if playlist.owner != request.user:
        return JsonResponse({"error": "Cannot add to playlist that is not yours."}, status=403)
    

    playlist.books.add(book)
    playlist.save()
    return JsonResponse({"message": "Added successfully."}, status=201)


@csrf_exempt
def create_playlist(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=403)
    data = json.loads(request.body)
    title = data.get("title", "")
    img = data.get("img", "")
    if not title:
        return JsonResponse({"error": "Cannot have blank title."}, status=409)
    new_playlist = Playlist(owner=request.user, name=title)
    new_playlist.save()
    return JsonResponse({"id": new_playlist.id}, status=201)


@csrf_exempt
def remove_from_playlist(request, book_id, playlist_id):
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    try:
        book = Book.objects.get(id=book_id)
    except Book.DoesNotExist:
        return JsonResponse({"error": "This book does not exist."}, status=404)
    try:
        playlist = Playlist.objects.get(id=playlist_id)
    except Playlist.DoesNotExist:
        return JsonResponse({"error": "This playlist does not exist."}, status=404)
    if playlist.owner != request.user:
        return JsonResponse({"error": "Cannot remove from playlist that is not yours."}, status=403)
    

    playlist.books.remove(book)
    playlist.save()
    return JsonResponse({"message": "Removed successfully."}, status=201)


@csrf_exempt
def search(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=403)
    data = json.loads(request.body)
    query = str(data.get("query", ""))
    returned_ls = []
    books = Book.objects.filter(adder=request.user)
    for book in books:
        if query.lower() in book.title.lower():
            returned_ls.append(book)
    return JsonResponse([book.serialize() for book in returned_ls], safe=False)


@csrf_exempt
def pf_search(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Route can only be accessed via POST."}, status=403)
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=403)
    data = json.loads(request.body)
    query = str(data.get("query", ""))
    returned_ls = []
    users = User.objects.all().exclude(username=request.user.username)
    for eachuser in users:
        if query.lower() in eachuser.username.lower():
            returned_ls.append(eachuser)
    return JsonResponse([eachuser.serialize() for eachuser in returned_ls], safe=False)


@csrf_exempt
def add_friend(request, id):
    request_user = request.user
    if not request_user.is_authenticated:
        return render(request, "booklist/error.html", {
            "error": "Please log in first.",
            "code": 403
        })
    try:
        target_user = User.objects.get(id=id)
    except User.DoesNotExist:
        return render(request, "booklist/error.html", {
            "error": "Target user not found.",
            "code": 404
        })
    

    if target_user not in request_user.requesting.all():
        request_user.requesting.add(target_user)
        if request_user in target_user.requesting.all():
            request_user.friendsWith.add(target_user)
            target_user.friendsWith.add(request_user)
    request_user.save()
    target_user.save()

    return render(request, "booklist/friends.html", {
        "message": "Friend request sent!"
    })


@csrf_exempt
def load(request, num):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=403)
    try:
        page_num = int(num)
    except ValueError:
        return JsonResponse({"error": "Bad request."}, status=409)
    
    # requesting showall & showmore 
    to_read_books = Book.objects.filter(adder=user).filter(current_page=0).order_by("timestamp").reverse()
    return JsonResponse([book.serialize() for book in to_read_books], safe=False)

@csrf_exempt
@login_required
def ab(request):
    if request.method == "POST":
        data = json.loads(request.body)
        raw_genres = [raw_genre.strip() for raw_genre in data.get("genres").split(",")]
        if raw_genres == [""]:
            return JsonResponse({
                "error": "At least one genre required."
            }, status=400)
        
        genres = []
        for raw_genre in raw_genres:
            try:
                genre = Genres.objects.get(genre=raw_genre)
                genres.append(genre)
            except Genres.DoesNotExist:
                return JsonResponse({
                    "error": f"The genre {raw_genre} does not exist."
                }, status=400)
            
        title = data.get("title", "")
        url = data.get("url", "")
        rating = data.get("rating", "")
        description = data.get("description", "")
        image = data.get("image", "")
        total_pages = data.get("total_pages", "")
        current_page = data.get("current_page", "")

        if not title:
            return JsonResponse({
                "error": "Title cannot be empty."
            }, status=400)
        if not url:
            return JsonResponse({
                "error": "Url cannot be empty."
            }, status=400)
        if rating:
            try:
                rating = float(rating)
            except ValueError:
                return JsonResponse({
                    "error": "Rating must be a number."
                }, status=400)
        else:
            rating = 0
        if not description:
            description = ""
        if not image:
            image = "https://thumbs.dreamstime.com/b/vintage-paper-texture-decorative-border-frame-old-paper-decorative-border-112688209.jpg"
        if not total_pages:
            return JsonResponse({
                "error": "Total pages cannot be empty."
            }, status=400)   
        try:
            total_pages = int(total_pages)
        except ValueError:
            return JsonResponse({
                "error": "Total pages must be a number."
            }, status=400)
        if total_pages == 0:
            return JsonResponse({
                "error": "Total pages cannot be 0."
            }, status=400)
        if not current_page:
            current_page = 0
        try:
            current_page = int(current_page)
        except ValueError:
            return JsonResponse({
                "error": "Current page must be a number."
            }, status=400)
        if current_page > total_pages:
            return JsonResponse({
                "error": "Current page cannot be greater than total pages."
            }, status=400)
               
        book = Book(
            adder=request.user,
            title=title,
            url=url,
            rating=rating,
            description=description,
            image=image,
            total_pages=total_pages,
            current_page=current_page,
            done=(total_pages == current_page)
        )
        book.save()
        for genre in genres:
            book.genres.add(genre)
        book.save()
        return JsonResponse({
            "message": "Book added successfully",
            "id": book.id,
            "img": book.image,
            "current_page": book.current_page,
            "total_pages": book.total_pages,
            "title": book.title,
        }, status=201)


@csrf_exempt 
def pfp(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Please log in first."}, status=403)
    data = json.loads(request.body)
    pfp = data.get("img", "")
    if not pfp:
        return JsonResponse({"error": "Profile picture cannot be blank."}, status=400)
    user.pfp = pfp
    user.save()
    return JsonResponse({"message": "Changed profile picture successfully"}, status=201)