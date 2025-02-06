from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),
    path("logout", views.logout_view, name="logout"),
    path("book/<int:id>", views.book, name="book"),
    path("playlist/<int:id>", views.playlist, name="playlist"),
    path("friends", views.friends, name="friends"),
    path("profile/<str:username>", views.profile, name="profile"),

    #API Routes
    path("edit/<int:id>", views.edit, name="edit"),
    path("rate/<int:id>/<int:stars>", views.rate, name="rate"),
    path("create_playlist", views.create_playlist, name="create_playlist"),
    path("add_to_playlist/<int:book_id>/<int:playlist_id>", views.add_to_playlist, name="add_to_playlist"),
    path("remove_from_playlist/<int:book_id>/<int:playlist_id>", views.remove_from_playlist, name="remove_from_playlist"),
    path("search", views.search, name="search"),
    path("pf_search", views.pf_search, name="pf_search"),
    path("add_friend/<int:id>", views.add_friend, name="add_friend"),
    path("load/<int:num>", views.load, name="load"),
    path("add_book", views.ab, name="add_book"),
    path("pfp", views.pfp, name="pfp"),
]