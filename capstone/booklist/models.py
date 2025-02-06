from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

# Create your models here.
class User(AbstractUser):
    pfp = models.CharField(max_length=500, default='https://th.bing.com/th/id/OIP.2RJqhQYbdgRUprcC-X5zkgHaHa?rs=1&pid=ImgDetMain')
    requesting = models.ManyToManyField('self', symmetrical=False, related_name="rev_requesting")
    friendsWith = models.ManyToManyField('self', symmetrical=False, related_name="rev_friendsWith")

    def serialize(self):
        return {
            "id": self.id,
            "pfp": self.pfp,
            "username": self.username
        }

class Genres(models.Model):
    genre = models.CharField(max_length=20)
    color_class = models.CharField(max_length=25)

    def __str__(self):
        return f"{self.genre}: {self.color_class}"


class Book(models.Model):
    adder = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books_owned")
    title = models.CharField(max_length=100)
    url = models.CharField(max_length=500)
    rating = models.FloatField(max_length=3, default=0)
    description = models.CharField(max_length=5000, default="")
    genres = models.ManyToManyField(Genres, related_name="books_with_this_genre")
    timestamp = models.DateTimeField(default=timezone.now)
    image = models.CharField(max_length=300, default='https://thumbs.dreamstime.com/b/vintage-paper-texture-decorative-border-frame-old-paper-decorative-border-112688209.jpg')
    total_pages = models.IntegerField()
    current_page = models.IntegerField(default=0)
    done = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "adder": self.adder.username,
            "title": self.title,
            "url": self.url,
            "rating": self.rating,
            "description": self.description,
            "genres": [genre.genre for genre in self.genres.all()],
            "timestamp": self.timestamp,
            "image": self.image,
            "total_pages": self.total_pages,
            "current_page": self.current_page,
            "done": False
        }
    
    def __str__(self):
        return f"{self.id} : {self.title}"

class Playlist(models.Model): 
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_playlists")
    books = models.ManyToManyField(Book, related_name="book_in_playlist", blank=True)
    cover_img = models.CharField(max_length=300, default='https://static.vecteezy.com/system/resources/previews/023/450/939/non_2x/online-education-icon-online-courses-illustration-sign-webinar-symbol-or-logo-vector.jpg')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.id} => {self.owner}: {self.name}"


