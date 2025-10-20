# Backend Fix: Pagination Issue with Roadmap Model

## Issue Description

The following error is occurring in production but not in development:

```
UnorderedObjectListWarning: Pagination may yield inconsistent results with an unordered object_list: <class 'lms.models.Roadmap'> QuerySet.
```

This error occurs at the `/api/lms/export/` endpoint and is related to Django REST Framework's pagination mechanism.

## Root Cause

The error occurs because the Django REST Framework pagination is being used with an unordered queryset of the `Roadmap` model. When paginating a queryset, Django requires a consistent ordering to ensure that items don't appear on multiple pages or get skipped entirely.

## Fix Implementation

### 1. Add Default Ordering to the Roadmap Model

Add a default ordering in the `Meta` class of the `Roadmap` model:

```python
class Roadmap(models.Model):
    # existing fields...
    
    class Meta:
        ordering = ['id']  # Or any other appropriate field like 'created_at', 'name', etc.
```

### 2. Ensure Ordering in the Export View

In the view that handles the `/api/lms/export/` endpoint, explicitly order the queryset:

```python
# Find the view that handles /api/lms/export/
class ExportView(APIView):
    # ...
    def get(self, request):
        # If you're using a queryset directly:
        queryset = Roadmap.objects.all().order_by('id')  # Add explicit ordering
        
        # If you're using a paginator:
        paginator = self.pagination_class()
        ordered_queryset = Roadmap.objects.all().order_by('id')  # Add explicit ordering
        page = paginator.paginate_queryset(ordered_queryset, request)
        # ...
```

### 3. Alternative: Add Ordering to the ViewSet

If the export endpoint is using a ViewSet, you can add ordering to the `get_queryset` method:

```python
class RoadmapViewSet(viewsets.ModelViewSet):
    # ...
    
    def get_queryset(self):
        queryset = Roadmap.objects.all()
        # Add any filtering logic here
        return queryset.order_by('id')  # Add explicit ordering
```

## Testing Steps

1. Apply the fix to the development environment
2. Test the `/api/lms/export/` endpoint to ensure it works correctly
3. Verify that no pagination warnings appear in the logs
4. Deploy to production and monitor logs to confirm the issue is resolved

## Additional Notes

- The ordering field should ideally be indexed for performance
- Consider adding a unique constraint if using a non-unique field for ordering
- If the export functionality needs a specific ordering, use that field instead of `id`