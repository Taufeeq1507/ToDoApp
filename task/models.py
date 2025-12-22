from django.db import models

class TodoItem(models.Model):
    title=models.CharField(max_length=150)
    completed=models.BooleanField(default=False)
    created_at=models.DateTimeField(auto_now=True)
