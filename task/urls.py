from rest_framework.routers import DefaultRouter
from .views import TodoItemViewset

router=DefaultRouter()
router.register(r'task',TodoItemViewset)

urlpatterns = router.urls