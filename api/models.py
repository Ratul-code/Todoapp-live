from django.db import models

# Create your models here.


class Todo(models.Model):
    title = models.CharField(max_length=200)
    uncompleted = models.BooleanField(default=True, blank=True, null=True)

    def __str__(self):
        return self.title
